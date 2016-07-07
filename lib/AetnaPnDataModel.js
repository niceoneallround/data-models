/*jslint node: true, vars: true */
'use strict';

//
//  This file contains the PN Aetna datamodel JSON-LD types and properties
//

var utils = {}, model = {},
  jsonldUtils = require('jsonld-utils/lib/jldUtils');

// the model ID
model.ID = 'http://aetna.schema.webshield.io';

model.URLS = {
  P:    model.ID + '/prop#',
  T:    model.ID + '/type#'
};

model.JSON_SCHEMA = {
  $schema: 'http://aetna.schema.webshield.io',
  'http//json-schema.org/title': 'http://aetna.schema.webshield.io/type#Subject',
  'http://json-schema.org/type': 'object',
  'http://json-schema.org/properties': {
    '@id': { 'http://json-schema.org/type': 'string' },
    '@type': { 'http://json-schema.org/type': 'array' },
    'http://aetna.schema.webshield.io/prop#AetnaJobID': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#birthDate': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#deathDate': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#memberID': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#memberIdType': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#memberScore': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#primaryMemberId': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#SourceID': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#SSN': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#firstName': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#middleName': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#lastName': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#suffix': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#gender': { 'http://json-schema.org/type': 'string' },
    'http://aetna.schema.webshield.io/prop#address': {
      'http//json-schema.org/title': 'http://aetna.schema.webshield.io/type#address',
      'http://json-schema.org/type': 'object',
      'http://json-schema.org/properties': {
        '@id': { 'http://json-schema.org/type': 'string' },
        '@type': { 'http://json-schema.org/type': 'array' },
        'http://aetna.schema.webshield.io/prop#addressLine1': { 'http://json-schema.org/type': 'string' },
        'http://aetna.schema.webshield.io/prop#addressLine2': { 'http://json-schema.org/type': 'string' },
        'http://aetna.schema.webshield.io/prop#city': { 'http://json-schema.org/type': 'string' },
        'http://aetna.schema.webshield.io/prop#state': { 'http://json-schema.org/type': 'string' },
        'http://aetna.schema.webshield.io/prop#zip5': { 'http://json-schema.org/type': 'string' },
        'http://aetna.schema.webshield.io/prop#countryCode': { 'http://json-schema.org/type': 'string' }
      } // address properties
    }, // address
  } // properties
};

model.PROPERTY = {
  AetnaProcessID:     model.URLS.P + 'Aetna_process_id',
  DOB:                model.URLS.P + 'birthDate',
  DOD:                model.URLS.P + 'deathDate',
  Gender:             model.URLS.P + 'Gender',
  MemberExperianId:   model.URLS.P + 'mem_experian_id',
  MemberId:           model.URLS.P + 'memberId',
  MemberIdAlt:        model.URLS.P + 'memberIdAlt',
  MemberIdType:       model.URLS.P + 'memberIdType',
  PrimarySubscriberMemberId:          model.URLS.P + 'PrimarySubscriberMemberId',
  PrimarySubscriberMemberIdAlt:       model.URLS.P + 'PrimarySubscriberMemberIdAlt',
  PrimarySubscriberMemberPNId:        model.URLS.P + 'PrimarySubsceiberMemberPNId',
  SourceID:           model.URLS.P + 'SourceID',
  SSN:                model.URLS.P + 'SSN',
  MemScore:           model.URLS.P + 'memScore',
  SSNValid:           model.URLS.P + 'SSNValid',
  AetnaMemberIdNeededForAcceptto:          model.URLS.P + 'AetnaMemberIdNeededForAcceptto',

  // name
  //
  FirstName:          model.URLS.P + 'firstName',
  MiddleName:         model.URLS.P + 'middleName',
  LastName:           model.URLS.P + 'lastName',
  Suffix:             model.URLS.P + 'suffix',

  // address
  //
  Address:            model.URLS.P + 'Address',
  Address1stLine:     model.URLS.P + 'addressLine1',
  Address2ndLine:     model.URLS.P + 'addressLine2',
  City:               model.URLS.P + 'city',
  State:              model.URLS.P + 'state',
  Zip5:               model.URLS.P + 'zip5',
  CountryCode:        model.URLS.P + 'countryCode'
};

model.SSNValidEnum = {
  Good: { code: 'Good', friendly: 'An exact match to a SSN on file' },
  Unknown: { code: 'Unknown', friendly: 'No match to a SSN on file' },
  Maybe: { code: 'Maybe', friendly: 'Matches a SSN on file but is suspect because other individuals have te same SSN on file' },
  MaybeNoRSSSN: { code: 'MaybeNoRSSSN', friendly: 'RS found subject but does not have a SSN for the subject' },
  MaybeBothHaveSSN: { code: 'MaybeBothHaveSN',
      friendly: 'RS found subject and source has subject but cannot compare as encryption type does not support it.' }
};

model.TYPE = {
  Address:    model.URLS.T + 'Address',
  Subject:    model.URLS.T + 'Subject'
};

//----------------------
// Utilities
//----------------------

// create an empty Address Node
utils.createAddressNode = function createAddressNode() {
  return jsonldUtils.createBlankNode({ '@type': model.TYPE.Address });
};

module.exports = {
  model:        model,
  utils:        utils,
  ID:           model.ID,
  PROPERTY:     model.PROPERTY,
  P_URL:        model.URLS.P,
  TYPE:         model.TYPE,
  T_URL:        model.URLS.T,
  SSNValidEnum: model.SSNValidEnum
};
