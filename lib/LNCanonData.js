/*jslint node: true, vars: true */
'use strict';

var assert = require('assert'),
  LN_P = require('./LNPnDataModel').PROPERTY,
  LN_T = require('./LNPnDataModel').TYPE,
  jsonldUtils = require('jsonld-utils/lib/jldUtils'),
  util = require('util'),
  COMMON_CD = require('./commonCanonData').CANON_DATA,
  CANON_DATA;

CANON_DATA = {
  // alice
  aliceLNId:          'http://id.webshield.io/xycom/ln/people/alice',
  aliceLNSourceID:    'http://ln.xycom/people/alice',
  aliceLNSSNValid:    'F',

  // bob data
  bobLNId:            'http://id.webshield.io/xycom/ln/people/bob',
  bobLNSourceID:      'http://ln.xycom/people/bob',
  bobLNSSNValid:      'G'
};

//  check the structure of a LN Subject, compare values with props
// props.id
function checkSubjectStructure(s, props) {
  var name, address;

  s.should.have.property('@id', props.id);
  assert(jsonldUtils.isType(s, LN_T.Subject), util.format('Subject is not an Aetna subject:%j', s));

  //  check inline
  s.should.have.property(LN_P.Gender);
  s.should.have.property(LN_P.DOB);
  s.should.have.property(LN_P.SourceID);
  s.should.have.property(LN_P.SSN);
  s.should.have.property(LN_P.SSNValid);

  // check name
  s.should.have.property(LN_P.Name);
  name = jsonldUtils.getO(s[LN_P.Name]);
  name.should.have.property(LN_P.First);
  name.should.have.property(LN_P.Last);

  // check address
  s.should.have.property(LN_P.Address);
  address = jsonldUtils.getO(s[LN_P.Address]);
  assert(jsonldUtils.isType(address, LN_T.Address), util.format('Address is not an LN Address:%j', address));

  address.should.have.property(LN_P.StreetAddress1);
  address.should.have.property(LN_P.StreetAddress2);
  address.should.have.property(LN_P.City);
  address.should.have.property(LN_P.State);
  address.should.have.property(LN_P.Zip5);
}

//
// Create a LN Alice using canonical data
//
function createBob() {
  var b;
  b = jsonldUtils.createNode(CANON_DATA.bobLNId, LN_T.Subject);

  // add top node props
  b[LN_P.Gender] = COMMON_CD.bobGender;
  b[LN_P.DOB] = COMMON_CD.bobBirthDate;
  b[LN_P.SourceID] = CANON_DATA.bobLNSourceID;
  b[LN_P.SSN] = COMMON_CD.bobSSN;
  b[LN_P.SSNValid] = CANON_DATA.bobLNSSNValid;

  // create name
  b[LN_P.Name] = jsonldUtils.createBlankNode({'@type': [LN_T.Name]});
  b[LN_P.Name][LN_P.First] = COMMON_CD.bobGivenName;
  b[LN_P.Name][LN_P.Last] = COMMON_CD.bobFamilyName;

  // create address
  b[LN_P.Address] = jsonldUtils.createBlankNode({'@type': [LN_T.Address]});
  b[LN_P.Address][LN_P.StreetAddress1] = COMMON_CD.bobAddressLine1;
  b[LN_P.Address][LN_P.StreetAddress2] = COMMON_CD.bobAddressLine2;
  b[LN_P.Address][LN_P.City] = COMMON_CD.bobCity;
  b[LN_P.Address][LN_P.State] = COMMON_CD.bobState;
  b[LN_P.Address][LN_P.Zip5] = COMMON_CD.bobZip5;

  return b;
}

function checkBobStructure(bob, props) {
  if (!props) {
    props = {};
  }

  props.id =  CANON_DATA.bobLNId;
  return checkSubjectStructure(bob, props);
}

//
// Create a LN Alice using canonical data
//
function createAlice() {
  var b = {};
  b = jsonldUtils.createNode(CANON_DATA.aliceLNId, LN_T.Subject);

  // add top node props
  b[LN_P.Gender] = COMMON_CD.aliceGender;
  b[LN_P.DOB] = COMMON_CD.aliceBirthDate;
  b[LN_P.SourceID] = COMMON_CD.aliceLNSourceID;
  b[LN_P.SSN] = COMMON_CD.aliceSSN;
  b[LN_P.SSNValid] = CANON_DATA.aliceLNSSNValid;

  // create name
  b[LN_P.Name] = jsonldUtils.createBlankNode({'@type': [LN_T.Name]});
  b[LN_P.Name][LN_P.First] = COMMON_CD.aliceGivenName;
  b[LN_P.Name][LN_P.Last] = COMMON_CD.aliceFamilyName;

  // create address
  b[LN_P.Address] = jsonldUtils.createBlankNode({'@type': [LN_T.Address]});
  b[LN_P.Address][LN_P.StreetAddress1] = COMMON_CD.aliceAddressLine1;
  b[LN_P.Address][LN_P.StreetAddress2] = COMMON_CD.aliceAddressLine2;
  b[LN_P.Address][LN_P.City] = COMMON_CD.aliceCity;
  b[LN_P.Address][LN_P.State] = COMMON_CD.aliceState;
  b[LN_P.Address][LN_P.Zip5] = COMMON_CD.aliceZip5;

  return b;
}

function checkAliceStructure(alice, props) {
  if (!props) {
    props = {};
  }

  props.id =  CANON_DATA.aliceLNId;
  return checkSubjectStructure(alice, props);
}

module.exports = {
  CANON_DATA: CANON_DATA,
  createAlice: createAlice,
  checkAliceStructure: checkAliceStructure,
  createBob: createBob,
  checkBobStructure: checkBobStructure
};
