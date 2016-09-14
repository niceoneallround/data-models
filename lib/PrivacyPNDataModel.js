/*jslint node: true, vars: true */
'use strict';

//
//  This file contains Privacy related PN data model types and properties
//

var assert = require('assert'),
    jsonldUtils = require('jsonld-utils/lib/jldUtils'),
    moment = require('moment'),
    PNDataModel = require('./PNDataModel'),
    PN_P = PNDataModel.PROPERTY,
    PN_T = PNDataModel.TYPE,
    util = require('util'),
    PROPERTY, TYPE, URLS, ID, OCTX, PATAG_TYPE, model,
    pipeCounter = 0;

// the model ID
ID = 'http://privacy.pn.schema.webshield.io';

URLS = {
  P:      ID + '/prop#',
  OCTX:   ID + '/octx#',
  T:      ID + '/type#'
};

PATAG_TYPE = 'patag';
URLS.PATAG = 'https://pn.tag.webshield.io/' + PATAG_TYPE;

//
// The following are taken from the IM directory in the product - see the API document and connector README.md for ones
// that are still used.
//
PROPERTY = {
};

TYPE = {
  Obfuscated:         URLS.T + 'Obfuscated'
};

OCTX = {
  AETNA_POC1:       URLS.OCTX + 'aetna_poc_1'
};

//------------------
// convenience routines
//------------------
model = {};
model.utils = {};

//
// Create a privacy pipe resource that can be passed to create privacy pipe URL
//
model.utils.createPrivacyPipeResource = function createPrivacyPipeResource(props) {
  var ppReq = {};

  // check mandatory props
  assert(props.action, util.format('createPrivacyPipe: no props.action:%j', props));
  assert(props.client, util.format('createPrivacyPipe: no props.client:%j', props));
  assert(props.destination, util.format('createPrivacyPipe: no props.destination:%j', props));
  assert(props.hostname, util.format('createPrivacyPipe: no props.hostname:%j', props));

  if (props.idValue) {
    ppReq['@id'] = PNDataModel.ids.createPrivacyPipeId(props.hostname, props.idValue);
  } else {
    pipeCounter = pipeCounter + 1;
    ppReq['@id'] = PNDataModel.ids.createPrivacyPipeId(props.hostname, moment().unix() + '-' + pipeCounter);
  }

  ppReq['@type'] = [PN_T.Metadata, PN_T.PrivacyPipe];
  ppReq[PN_P.action] = props.action;

  if (props.client['@type']) {
    ppReq[PN_P.client] = props.client;
  } else {
    ppReq[PN_P.client] = PNDataModel.utils.createCNameValue(props.client);
  }

  if (props.destination['@type']) {
    ppReq[PN_P.destination] = props.destination;

  } else {
    ppReq[PN_P.destination] = PNDataModel.utils.createURLValue(props.destination);
  }

  //
  // if passed in external encrypt metadata then add
  //
  if (props.externalEncryptMd) {
    if (ppReq[PN_P.externalEncryptMd]) {
      ppReq[PN_P.externalEncryptMd].push(props.externalEncryptMd);
    } else {
      ppReq[PN_P.externalEncryptMd] = [props.externalEncryptMd];
    }
  }

  if (props.action === PN_T.Obfuscate) {
    // when obfuscating need to say what node to use - on deObfuscate will use correct one as stored in metadata
    assert(props.privacyAlgorithmId, util.format('createPrivacyPipe: no props.privacyAlgorithmId:%j', props));

    ppReq[PN_P.privacyAlgorithm] = props.privacyAlgorithmId;

    // privacy node is not a requirement
    if (props.privacyNode) {
      if (props.privacyNode['@type']) {
        ppReq[PN_P.privacyNode] = props.privacyNode;
      } else {
        ppReq[PN_P.privacyNode] = PNDataModel.utils.createURLValue(props.privacyNode);
      }
    }

  } else if (props.action === PN_T.DeObfuscate) {
    assert(!props.privacyAlgorithm,
      util.format('createPrivacyPipe: should not pass a privacy Algorithm for de-obfuscate as gets from pipe:%j', props));

    // must pass in the privacy context as needed to determine how to de-obfuscate
    assert(props.privacyContext, util.format('createPrivacyPipe: for de-obfuscate need the privacyContext:%j', props));
    ppReq[PN_P.privacyContext] = props.privacyContext;

    // for de-obfuscate the privacy context must hold the pipe that was used to obfuscate so can get stuff needed for de-obfuscate
    assert(props.privacyContext[PN_P.subjectPrivacyPipe],
      util.format('createPrivacyPipe: for de-obfuscate the privacyContext must have a: %s request:%j', PN_P.subjectPrivacyPipe, props));
  }

  return ppReq;
};

// add the external encrypt to the pipe resource request before it is created
//
model.utils.addExternalEncryptMD2PrivacyPipeReq = function addExternalEncryptMD2PrivacyPipeReq(ppReq, externalEncryptMd) {
  assert(ppReq, 'ppReq param is missing');
  assert(externalEncryptMd, 'externalEncryptMd param is missing');
  if (ppReq[PN_P.externalEncryptMd]) {
    ppReq[PN_P.externalEncryptMd].push(externalEncryptMd);
  } else {
    ppReq[PN_P.externalEncryptMd] = [externalEncryptMd];
  }
};

//
// Create a privacy algorithm tag used in the @type of an obfuscted value of a known format from the pipe info
// this is used to understand how to decrypt data it identifies a unique pipe, unique actions, unique step.
//
// The format is pipeId/privacystep.orderNumber/privacyAction.orderNumber#value
//
// privacyPipeId - required
// privacyStepNumber - optional
// privacyActionNumber - optional
// value - optional
// OR
// external - means data was encrypted before passing into PN and this tag identifies what encrypt metadata to use to decrypt.
//
model.utils.createPATAGFromPipe = function createPATAGFromPipe(privacyPipeId, optionals) {
  assert(privacyPipeId, 'privacyPipeId param missing');

  var tag = privacyPipeId;

  if ((optionals) && (optionals.privacyStepNumber)) {
    tag = tag + '?privacyStepNumber=' + optionals.privacyStepNumber;

    if (optionals.privacyActionNumber) {
      tag = tag + '&privacyActionNumber=' + optionals.privacyActionNumber;
    }

    if (optionals.value) {
      tag = tag + '&value=' + optionals.value;
    }
  } else if ((optionals) && (optionals.value)) {
    tag = tag + '?value=' + optionals.value;
  } else if ((optionals) && (optionals.external)) {
    tag = tag + '?external=' + optionals.external;
  }

  return tag;
};

/*model.utils.xcreatePATAG = function xcreatePATAG(hostname, tagValue) {
  assert(hostname, 'hostname param missing');
  assert(tagValue, 'tagValue param missing');
  return PNDataModel.tags.createTag(PATAG_TYPE, hostname, tagValue);
};*/

//
// Utility routine that creates an obfuscted JSONLD typed value from a passed in 'value' and a passed in 'obfuscstion context'.
//
// The 'value' is the obfuscatated value (token, hash, random, encrypted value, etc) and is placed in the @value property. If reversable
// it can passed to the service to reverse it.
//
// The 'privacy algorithm tag - a reference to metadata that is needed to dereference the data, place in @type
// The patag has a well know format https://pn.tag.webshield.io/(patag)/(reversed host name)/#(jwt)
//  - 0-n tags added by the external obfuscation service
//
//
// The following is an example
//
//  {'@id': 'someId',
//   '@type': ['ACME_T:Subject'],
//   'ACME_P:SSN': 'ssn_1'}
//
//  {'@id': 'someId',
//   '@type' ['atena_t:Subject'],
//   'ACME_P:SSN': {
//     '@type' : 'https://pn.tag.webshield.io/(patag)/com/acme#(some value), // jwt holding metadata
//     '@value': 'encrypted value from external source'
//    }
//  }
//
// props.octx - the obfuscation context
// props.evalue - the encryted value
//
model.utils.createObfuscatedValue = function createObfuscatedValue(props) {
  assert(props, util.format('privacyUtils.createValue - no props provided'));
  assert(props.evalue, util.format('privacyUtils.createValue no props.evalue provided:%j', props));
  assert(props.patag, util.format('privacyUtils.createValue no props.patag provided:%j', props));
  if (Array.isArray(props.patag)) {
    assert((props.patag.length === 1), util.format('if props.patag is an array then size must be one:%j', props.patag));
  }

  return jsonldUtils.createV({ value: props.evalue, type: props.patag });
};

//
// Check if obfuscated by seeing if @type contains a value with that has a substring of the obfuscation context (OLD)
// or has a substring of a privacy algorithm tag
//
// @typedValue - can be a singleton or an array with 1 instance
model.utils.isObfuscated = function isObfuscated(typedValue) {

  // handle the deprecated PPN_OCTX_URL for now
  function checkTagIsObfuscationTag(tag) {
    if (
        (tag.indexOf('privacy_pipe') !== -1) ||
        (tag.indexOf(URLS.OCTX) !== -1) ||
        (tag.indexOf(URLS.PATAG) !== -1)) {
      return true;
    } else {
      return false;
    }
  }

  function checkTypeContainsObfuscationTags(value) {
    var i;
    if (value['@type']) {
      if (Array.isArray(value['@type'])) {
        for (i = 0; i < value['@type'].length; i++) {
          if (checkTagIsObfuscationTag(value['@type'][i])) {
            return true;
          }
        }
      } else {
        return checkTagIsObfuscationTag(value['@type']);
      }
    } else {
      // no @type so cannot determine so return false
      return false;
    }
  }

  if (!Array.isArray(typedValue)) {
    return checkTypeContainsObfuscationTags(typedValue);
  } else if (typedValue.length === 0) {
    return false;
  } else {
    assert((typedValue.length === 1),
      util.format('typedValue is an array of more than one item - cannot determine if obfusctaed so barf:%j', typedValue));
    return checkTypeContainsObfuscationTags(typedValue[0]);
  }
};

//--------------------------------
// Privacy Algorithm Complete example
//------------------------------
/*
{
  '@id': 'https://pn.id.webshield.io/privacy_algorithm/com/acme#pa_ssn_1'
  '@type': pn_t:PrivacyAlgorithm,
  'pn_p:privacy_step':[{
    '@id': 'https://pn.id.webshield.io/privacy_step/com/acme#ps_ssn_1',
    '@type': pn_t:PrivacyStep,
    'pn_p.node_type': <pn_t.PrivacyNode or pn_t.Connector>,
    'pn_p:client': {'@type': 'pn_t:X509CN', '@value': 'pn.acme.com'},
    'pn_p:next': {'@type': 'pn_t:URL, '@value': 'https://pstore.pn.webshield.io/data/store'},
    'pn_p:order_number': '1',
    'pn_p:privacy_action': [{
      '@id': https://pn.id.webshield.io/privacy_action/com/acme#ps_ssn_1'
      '@type': 'pn_t:PrivacyAction',
      'pn_p:Action': 'pn_t:Obfuscate' or pn_t.DeObfuscate,
      'pn_p:node_type': <pn_t.Internal or pn_t.External>,
      'pn_p:patag': 'url placed in obfuscated values',
      'pn_p:obfuscation_service': {}
      'pn_p:privacy_schema': [{
        { '@id': <url>, '@type': pn_t:SchemaItem,
          'pn_p:node_type': 'acme_t:Subject',
          'pn_p:prop_names: [acme_p:SSN]'}
      }]
    }]
   }]
}
*/

// create a privacy algorithm from the past in props
//
// *id - the id https://pn.id.webshield.io/privacy_algorithm/<hostname reversed>#<some id>
// *pn_p.privacy_steps - ordered list of privacy steps
//
model.utils.createPrivacyAlgorithm = function createPrivacyAlgorithm(props) {
  assert(props, 'props param missing');
  assert(props.privacyStep, util.format('props.privacyStep missing:%j', props));
  assert(props.issuer, util.format('props.issuer is missing:%j', props));

  var pa = {};
  pa['@type'] = [PN_T.Metadata, PN_T.PrivacyAlgorithm];

  if (props.id) {
    pa['@id'] = props.id;
  } else if (props.hostname) {
    pa['@id'] = PNDataModel.ids.createPrivacyAlgorithmId(props.hostname,  moment().unix());
  }

  pa[PN_P.issuer] = PNDataModel.utils.createCNameValue(props.issuer);

  assert(pa['@id'], util.format('privacyAlgorithm create - could not create @id as either id or hostname missing:%j', props));

  if (!Array.isArray(props.privacyStep)) {
    pa[PN_P.privacyStep] = [props.privacyStep];
  } else {
    pa[PN_P.privacyStep] = props.privacyStep.slice();
  }

  return pa;
};

// create a privacy step from the past in props
//
// An instantiated  privacy step has the following properties
// *id - the id https://pn.id.webshield.io/privacy_step/<hostname reversed>#<some id>
// *pn_p.client - the cname of the client used for TLS client auth
// *pn_p.next - the URL of where to post the result
// *pn_p.privacy_action - array of pn_t.PrivacyAction that obfuscate or de-obfuscate data, ok for there to be none in whic
// case just authenticating the action.
//
model.utils.createPrivacyStep = function createPrivacyStep(props) {
  assert(props, 'props param missing');
  assert(props.client, util.format('props.client is missing:%j', props));
  assert(props.next, util.format('props.next is missing:%j', props));
  assert(props.orderNumber, util.format('props.orderNumber is missing:%j', props));

  return model.utils.createNonInstantiatedPrivacyStep(props);
};

//
// Creates a privacy step for the PA that can be instantiated later using a privacy pipe. The
// pipe provides the client and next so not mandatory here.
//
model.utils.createNonInstantiatedPrivacyStep = function createNonInstantiatedPrivacyStep(props) {
  assert(props, 'props param missing');

  var ps = {};
  ps['@type'] = PN_T.PrivacyStep;

  if (props.id) {
    ps['@id'] = props.id;
  } else if (props.hostname) {
    ps['@id'] = PNDataModel.ids.createPrivacyStepId(props.hostname,  moment().unix());
  }

  assert(ps['@id'], util.format('privacyStep create - could not create @id as either id or hostname missing:%j', props));

  if (props.orderNumber) {
    ps[PN_P.orderNumber] = props.orderNumber;
  } else {
    ps[PN_P.orderNumber] = '1';
  }

  if (props.nodeType) {
    ps[PN_P.nodeType] = props.nodeType;
  } else {
    ps[PN_P.nodeType] = PN_T.PrivacyNode;
  }

  // privacy action is optional as may just be authenticating
  if (props.privacyAction) {
    if (!Array.isArray(props.privacyAction)) {
      ps[PN_P.privacyAction] = [props.privacyAction];
    } else {
      ps[PN_P.privacyAction] = props.privacyAction.slice();
    }
  } else {
    ps[PN_P.privacyAction] = [];
  }

  if (props.client) {
    ps[PN_P.client] = props.client;
  }

  if (props.next) {
    ps[PN_P.next] = props.next;
  }

  return ps;
};

// create a privacy action from the past in props
//
// A privacy action has the following properties
// *id - the id https://pn.id.webshield.io/privacy_action/<hostname reversed>#<some id>
// *pn_p.action - is either
//    *pn_t.Obfuscate - obfuscate data
//    *pn_t.DeObfuscate - de-obfuscate data
// *pn_p.node_type
// *pn_p.encryption_metadata
// *pn_p.patag - tag to place in any values that are obfuscated
// *pn_p.obfuscation_service
// *pn_p.privacy_schema - what types and properties to obfuscate
//
model.utils.createPrivacyAction = function createPrivacyAction(props) {
  assert(props, 'props param missing');
  assert(props.action, util.format('props.action is missing:%j', props));
  assert(!props.obfuscationService, 'add code for obfuscaitonService');
  assert(props.orderNumber, util.format('props.orderNumber is missing:%j', props));

  var pa = {};
  pa['@type'] = PN_T.PrivacyAction;

  if (props.id) {
    pa['@id'] = props.id;
  } else if (props.hostname) {
    pa['@id'] = PNDataModel.ids.createPrivacyActionId(props.hostname, moment().unix());
  }

  assert(pa['@id'], util.format('privacyAction create - could not create @id as either id or hostname missing:%j', props));

  // in future may make optional and just populate at runtime
  pa[PN_P.patag] = props.patag;

  pa[PN_P.action] = props.action;

  pa[PN_P.orderNumber] = props.orderNumber;

  if (props.nodeType) {
    pa[PN_P.nodeType] = props.nodeType;
  } else {
    pa[PN_P.nodeType] = PN_T.Internal;
  }

  if (props.encryptionMetadata) {
    pa[PN_P.encryptionMetadata] = props.encryptionMetadata;
  }

  //
  // if the node type is internal then must have a schema to tell it what to do also must have
  //
  if (pa[PN_P.nodeType] === PN_T.Internal) {
    assert(props.privacySchema, util.format('props.privacySchema is missing:%j', props));

    // process privacy schema to make sure ok
    if (!Array.isArray(props.privacySchema)) {
      pa[PN_P.privacySchema] = [props.privacySchema];
    } else {
      pa[PN_P.privacySchema] = props.privacySchema.slice();
    }

    pa[PN_P.privacySchema].forEach(function (item) {
      assert(item['@id'], util.format('SchemaItem does not have an @id'));
      assert(jsonldUtils.isType(item, PN_T.SchemaItem), util.format('item:%j is not a %s', item, PN_T.SchemaItem));
      assert(item[PN_P.nodeType], util.format('SchemaItem:%j does not have property %s', item, PN_P.nodeType));
      assert(item[PN_P.propName], util.format('SchemaItem:%j does not have property %s', item, PN_P.propName));

      // if an array then copy it, as previous slice would just have kept the reference
      if (Array.isArray(item[PN_P.nodeType])) {
        item[PN_P.nodeType] = item[PN_P.nodeType].slice();
      }

      // if an array then copy it, as previous slice would just have kept the reference
      if (Array.isArray(item[PN_P.propName])) {
        item[PN_P.propName] = item[PN_P.propName].slice();
      }
    });
  }

  return pa;
};

//
// Privacy Context varies by usage - see identity syndicate for example
//
model.utils.createPrivacyContext = function createPrivacyContext(props) {
  assert(props.hostname, util.format('createPrivacyContext - props.hostname is missing: %j', props));
  var pc = {
    '@id': PNDataModel.ids.createPrivacyContextId(props.hostname, moment().unix()),
    '@type': [PN_T.PrivacyContext]
  };

  return pc;
};

//--------------------------------
// ENCRYPTION METADATA HElPERS
//-------------------------------

// domainName - the domain that is creating - do not use host as want to be more specific
// mtype - the mechanism type - for example SHA2_256, AES_256 - can be what ever the caller wants
// mdomainName - the mechanism domain namem for exampele ionic.com
//
model.utils.createEncryptMetadata = function createEncryptMetadata(props) {
  assert(props.domainName, util.format('createEncryptionMetadata- props.domainName is missing: %j', props));

  //
  // If marked as metadata need to update the MServcie to know about so for now will not :)
  //
  var md = {
    '@id': PNDataModel.ids.createEncryptMetadataId(props.domainName, moment().unix()),
    '@type': [PN_T.EncryptMetadata]
  };

  if ((props.mType) && (props.mDomainName)) {
    md[PN_P.encryptMechanism] = PNDataModel.ids.createEncryptMechanismId(props.mDomainName, props.mType);
  }

  return md;
};

//--------------------------------------
// Provision Helpers
//--------------------------------------

//
// Create a Provision that is stored in a service
//
model.utils.createProvision = function createProvision(hostname, pvRq) {
  assert(hostname, 'hostname param is missing');
  assert(pvRq, 'pvRq param missing');
  assert(pvRq['@id'], util.format('pvRq does not have an @id: %j', pvRq));
  assert(jsonldUtils.isType(pvRq, PN_T.Provision, util.format('pvRq:%j is not of type:%s', pvRq, PN_T.Provision)));
  assert(pvRq[PN_P.privacyPipe], util.format('pvRq does not have a privacy pipe id: %j', pvRq));

  var pv = {};
  pv['@id'] = pvRq['@id'];
  pv['@type'] = [PN_T.Provision];
  pv[PN_P.privacyPipe] = pvRq[PN_P.privacyPipe];
  pv[PN_P.provisionedMetadata] = pvRq[PN_P.provisionedMetadata];

  return pv;
};

//
// Verify Provision Request
//
model.utils.verifyProvision = function verifyProvision(rq, hostname) {

  if (!rq) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR no %s passed in request', PN_T.Provision)
    });
  }

  if (!rq['@id']) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR @id missing from:%j', rq)
    });
  }

  if (!((jsonldUtils.isType(rq, PN_T.Provision)))) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR type is not [%s] missing in:%j', PN_T.Provision, rq)
    });
  }

  return null;
};

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  OCTX:         OCTX,
  OCTX_URL:     URLS.OCTX,
  TYPE:         TYPE,
  T_URL:        URLS.T,

  // utils
  utils:        model.utils
};
