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
  DOB:                URLS.P + 'birthDate',
  DOD:                URLS.P + 'deathDate',
  Gender:             URLS.P + 'Gender',
  MemberId:           URLS.P + 'memberId',
  MemberIdType:       URLS.P + 'memberIdType',
  SourceID:           URLS.P + 'SourceID',
  SSN:                URLS.P + 'SSN',
  MemScore:           URLS.P + 'memScore',
  SSNValid:           URLS.P + 'SSNValid',

  // name
  //
  FirstName:          URLS.P + 'firstName',
  MiddleName:         URLS.P + 'middleName',
  LastName:           URLS.P + 'lastName',
  Suffix:             URLS.P + 'suffix',

  // address
  //
  Address:            URLS.P + 'Address',
  Address1stLine:     URLS.P + 'addressLine1',
  Address2ndLine:     URLS.P + 'addressLine2',
  City:               URLS.P + 'city',
  State:              URLS.P + 'state',
  Zip5:               URLS.P + 'zip5',
  CountryCode:        URLS.P + 'countryCode'
};

SSNValidEnum = {
  Good: { code: 'Good', friendly: 'An exact match to a SSN on file' },
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
