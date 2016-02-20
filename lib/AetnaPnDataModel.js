/*jslint node: true, vars: true */
'use strict';

//
//  This file contains the PN Aetna datamodel JSON-LD types and properties
//

var PROPERTY, TYPE, URLS, ID, SSNValidEnum;

// the model ID
ID = 'http://aetna.schema.webshield.io';

URLS = {
  P:    ID + '/prop#',
  T:    ID + '/type#'
};

PROPERTY = {
  DOB:                URLS.P + 'DOB',
  DOD:                URLS.P + 'DOD',
  Gender:             URLS.P + 'Gender',
  SourceID:           URLS.P + 'SourceID',
  SSN:                URLS.P + 'SSN',
  SSNValid:           URLS.P + 'SSNValid',

  // name
  //
  FirstName:          URLS.P + 'FirstName',
  LastName:           URLS.P + 'LastName',

  // address
  //
  Address:            URLS.P + 'Address',
  Address1stLine:     URLS.P + 'Address1stLine',
  Address2ndLine:     URLS.P + 'Address2ndLine',
  City:               URLS.P + 'City',
  State:              URLS.P + 'State',
  Zip5:               URLS.P + 'Zip5'
};

SSNValidEnum = {
  Good: { code: 'Good', friendly:' An exact match to a SSN on file' },
  Unknown: { code: 'Unknown', friendly: 'No match to a SSN on file' },
  Maybe: { code: 'Maybe', friendly: 'Matches a SSN on file but is suspect because other individuals have te same SSN on file' }
};

TYPE = {
  Address:    URLS.T + 'Address',
  Subject:    URLS.T + 'Subject'
};

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  TYPE:         TYPE,
  T_URL:        URLS.T,
  SSNValidEnum: SSNValidEnum
};
