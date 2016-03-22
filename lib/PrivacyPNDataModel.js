/*jslint node: true, vars: true */
'use strict';

//
//  This file contains Privacy related PN data model types and properties
//

var assert = require('assert'),
    jsonldUtils = require('jsonld-utils/lib/jldUtils'),
    PN = require('./PNDataModel'),
    PN_P = PN.PROPERTY,
    PN_T = PN.TYPE,
    util = require('util'),
    PROPERTY, TYPE, URLS, ID, OCTX, PATAG_TYPE, model;

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
// Create a privacy algroithm tag used in the @type of an obfuscted value of a known format - that will be unique for log files.
//
// *tagValue - the metadata needed to reverse the encryption - for now a JWT
//
// The format is https://pn.tag.webshield.io/patag/(reversed host name)#tagValue
//
model.utils.createPATAG = function createPATAG(hostname, tagValue) {
  assert(hostname, 'hostname param missing');
  assert(tagValue, 'tagValue param missing');
  return PN.tags.createTag(PATAG_TYPE, hostname, tagValue);
};

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
    if ((tag.indexOf(URLS.OCTX) !== -1) ||
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

// create a privacy algorithm from the past in props
//
// A privacy step has the following properties
// *id - the id https://pn.id.webshield.io/privacy_algorithm/<hostname reversed>#<some id>
// *pn_p.privacy_steps - ordered list of privacy steps
// *pn_p.issuer - cname of who created
// *pn_p.creation_date - date created
// *pn_p.signature - signature across the whole privacy algorithm to prove not tampered and source
//
model.utils.createPrivacyAlgorithm = function createPrivacyAlgorithm(props) {
  assert(props, 'props param missing');
  return null;
};

// create a privacy step from the past in props
//
// A privacy step has the following properties
// *id - the id https://pn.id.webshield.io/privacy_step/<hostname reversed>#<some id>
// *pn_p.client - the cname of the client used for TLS client auth
// *pn_p.next - the URL of where to post the result
// *pn_p.privacy_action - array of pn_t.PrivacyAction
//
model.utils.createPrivacyStep = function createPrivacyStep(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id is missing:%j', props));
  assert(props.client, util.format('props.client is missing:%j', props));
  assert(props.next, util.format('props.next is missing:%j', props));
  assert(props.privacyAction, util.format('props.privacyAction is missing:%j', props));

  var ps = {};
  ps['@id'] = props.id;
  ps['@type'] = PN_T.PrivacyStep;

  if (!Array.isArray(props.privacyAction)) {
    ps[PN_P.privacyAction] = [props.privacyAction];
  } else {
    ps[PN_P.privacyAction] = props.privacyAction.slice();
  }

  ps[PN_P.client] = props.client;
  ps[PN_P.next] = props.next;

  return ps;
};

// create a privacy action from the past in props
//
// A privacy action has the following properties
// *id - the id https://pn.id.webshield.io/privacy_action/<hostname reversed>#<some id>
// *pn_p.action - is either pn_t.Obfuscate or pn_t.DeObfuscate
// *pn_p.patag - tag to place in any values that are obfuscated
// *pn_p.obfuscation_service
// *pn_p.privacy_schema - what types and properties to obfuscate
//
model.utils.createPrivacyAction = function createPrivacyAction(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id is missing:%j', props));
  assert(props.patag, util.format('props.patag is missing:%j', props));
  assert(props.action, util.format('props.action is missing:%j', props));
  assert(!props.obfuscationService, 'add code for obfuscaitonService');
  assert(props.privacySchema, util.format('props.privacySchema is missing:%j', props));
  var pa = {};
  pa['@id'] = props.id;
  pa['@type'] = PN_T.PrivacyAction;

  // in future may make optional and just populate at runtime
  pa[PN_P.patag] = props.patag;

  pa[PN_P.action] = props.action;

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

  return pa;
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
