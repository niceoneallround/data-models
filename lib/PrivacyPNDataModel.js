/*jslint node: true, vars: true */
'use strict';

//
//  This file contains Privacy related PN data model types and properties
//

var PROPERTY, TYPE, URLS, ID, OCTX;

// the model ID
ID = 'http://privacy.pn.schema.webshield.io';

URLS = {
  P:    ID + '/prop#',
  OCTX: ID + '/octx#',
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

OCTX = {
  AETNA_POC1:       URLS.OCTX + 'aetna_poc_1'
};

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  OCTX:         OCTX,
  OCTX_URL:     URLS.OCTX,
  TYPE:         TYPE,
  T_URL:        URLS.T
};
