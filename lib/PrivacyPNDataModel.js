/*jslint node: true, vars: true */
'use strict';

//
//  This file contains Privacy related PN data model types and properties
//

var PROPERTY, TYPE, URLS, ID, TAG, OTYPE;

// the model ID
ID = 'http://privacy.pn.schema.webshield.io';

URLS = {
  P:    ID + '/prop#',
  TAG:  ID + '/tag#',
  OT:   ID + '/otype#',
  T:    ID + '/type#'
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

// Tags are used to convery information about the @type
TAG = {
  OpaqueToken:       URLS.TAG + 'OpaqueToken'
};

OTYPE = {
  AETNA_POC1:       URLS.OT + 'atena_poc_1'
};

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  OTYPE:        OTYPE,
  TYPE:         TYPE,
  T_URL:        URLS.T,
  TAG:          TAG
};
