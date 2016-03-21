/*jslint node: true, vars: true */
'use strict';

//
//  This file contains Privacy related PN data model types and properties
//

var assert = require('assert'),
    jsonldUtils = require('jsonld-utils/lib/jldUtils'),
    util = require('util'),
    PROPERTY, TYPE, URLS, ID, OCTX, model;

// the model ID
ID = 'http://privacy.pn.schema.webshield.io';

URLS = {
  P:      ID + '/prop#',
  OCTX:   ID + '/octx#',
  PATAG:  ID + '/patag#', // holds context needed by the privacy algorithm to reverse
  T:      ID + '/type#'
};

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
// Create a privacy algroithm tag used in the @type of an obfuscted value of a known format - that will be unique for log files
// *tagValue
//
// The format is https://privacy.pn.schema.webshield.io/patag#(tagValue)
//
model.utils.createPATAG = function createPATAG(tagValue) {
  return URLS.PATAG + tagValue;
};

//
// Utility routine that creates an obfuscted JSONLD typed value from a passed in 'value' and a passed in 'obfuscstion context'.
//
// The 'value' is the obfuscatated value (token, hash, random, encrypted value, etc) and is placed in the @value property. If reversable
// it can passed to the service to reverse it.
//
// The 'obfusction context' is an instance or an array holding the below. It is stored in the @type property
//  - 1 PN obfuscation tag needed by a privacy algorithm to understand how to orchestrate the reversing of the value, may be a obfuscated.
//  - 0-n PN meta tags about the obfuscated value, for example comparible. May be obfuscated.
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
//     '@type' : [
//       'https://privacy.pn.schema.webshield.io/patag#(some value), // used by privacy algorithm (id, jwt, etc)
//       'https://privacy.pn.schema.webshield.io/type#comparible', // used by parties looking at privacy graph
//       'https://(external-service-hostname).pn.schema.io/eostag#(some value)' // used by external obfuscation service
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
  assert(props.octx, util.format('privacyUtils.createValue no props.octx provided:%j', props));
  return jsonldUtils.createV({ value: props.evalue, type: props.octx });
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
