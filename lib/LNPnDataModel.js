/*jslint node: true, vars: true */
'use strict';

//
//  This file contains the PN LN datamodel JSON-LD types and properties
//

var PROPERTY, TYPE, URLS, ID,
  jsonldUtils = require('jsonld-utils/lib/jldUtils');

// the model ID
ID = 'http://ln.schema.webshield.io';

URLS = {
  P:    ID + '/prop#',
  T:    ID + '/type#'
};

PROPERTY = {
  DOB:                    URLS.P + 'DOB', // format dd/mm/yyyy
  DOD:                    URLS.P + 'DOD', // format dd/mm/yyyy
  Gender:                 URLS.P + 'Gender',
  SourceID:               URLS.P + 'SourceID',
  SubjectSSNIndicator:    URLS.P + 'SubjectSSNIndicator',
  SSN:                    URLS.P + 'SSN',
  SSNValid:               URLS.P + 'SSNValid',

  // name
  //
  Name:                   URLS.P + 'Name',  // the name node
  First:                  URLS.P + 'First',
  Last:                   URLS.P + 'Last',
  Middle:                 URLS.P + 'Middle',
  Prefix:                 URLS.P + 'Prefix',
  Suffix:                 URLS.P + 'Suffix',

  // address
  //
  Address:                URLS.P + 'Address', // the address node
  City:                   URLS.P + 'City',
  State:                  URLS.P + 'State',
  StreetAddress1:         URLS.P + 'StreetAddress1',
  StreetAddress2:         URLS.P + 'StreetAddress2',
  StreetNumber:           URLS.P + 'StreetNumber',
  StreetSuffix:           URLS.P + 'StreetSuffix',
  UnitDesignation:        URLS.P + 'UnitDesignation',
  UnitNumber:             URLS.P + 'UnitNumber',
  Zip5:                   URLS.P + 'Zip5'
};

TYPE = {
  Address:    URLS.T + 'Address',
  Name:       URLS.T + 'Name',
  Subject:    URLS.T + 'Subject'
};

// create an empty Name node
function createNameNode() {
  return jsonldUtils.createBlankNode({'@type': TYPE.Name});
}

// create an empty Address Node
function createAddressNode() {
  return jsonldUtils.createBlankNode({'@type': TYPE.Address});
}

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  TYPE:         TYPE,
  T_URL:        URLS.T,

  // Functions
  createAddressNode: createAddressNode,
  createNameNode: createNameNode
};
