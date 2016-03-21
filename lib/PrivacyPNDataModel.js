/*jslint node: true, vars: true */
'use strict';

//
//  This file contains Privacy related PN data model types and properties
//

var PROPERTY, TYPE, URLS, ID, OCTX, model;

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

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  OCTX:         OCTX,
  OCTX_URL:     URLS.OCTX,
  PATAG_URL:    URLS.PATAG,
  TYPE:         TYPE,
  T_URL:        URLS.T,

  // utils
  utils:        model.utils
};
