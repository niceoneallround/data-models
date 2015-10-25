/*jslint node: true, vars: true */
'use strict';

var assert = require('assert'),
  AETNA_P = require('./AetnaPnDataModel').PROPERTY,
  AETNA_T = require('./AetnaPnDataModel').TYPE,
  jsonldUtils = require('jsonld-utils/lib/jldUtils'),
  util = require('util'),
  _ = require('underscore'),
  COMMON_CD = require('./commonCanonData').CANON_DATA,
  CANON_DATA;

CANON_DATA = {
  aliceAetnaId:       'http://id.webshield.io/xycom/aetna/people/alice',
  aliceAetnaSourceID: 'http://aetna.xycom/people/alice',

  //
  // bob data
  bobAetnaId:         'http://id.webshield.io/xycom/aetna/people/bob',
  bobAetnaSourceID:   'http://aetna.xycom/people/bob'
};

function checkSubjectStructure(s, props) {

  var address;
  assert(s, 'No subject passed in');
  s.should.have.property('@id', props.id);
  assert(jsonldUtils.isType(s, AETNA_T.Subject), util.format('Subject is not an Aetna subject:%j', s));

  // check inline
  s.should.have.property(AETNA_P.Gender);
  s.should.have.property(AETNA_P.DOB);
  s.should.have.property(AETNA_P.SourceID);
  s.should.have.property(AETNA_P.SSN);

  // check name
  s.should.have.property(AETNA_P.FirstName);
  s.should.have.property(AETNA_P.LastName);

  // check address
  s.should.have.property(AETNA_P.Address);
  address = jsonldUtils.getO(s[AETNA_P.Address]);
  assert(jsonldUtils.isType(address, AETNA_T.Address), util.format('Address is not an Aetna Address:%j', address));

  address.should.have.property(AETNA_P.Address1stLine);
  address.should.have.property(AETNA_P.Address2ndLine);
  address.should.have.property(AETNA_P.City);
  address.should.have.property(AETNA_P.State);
  address.should.have.property(AETNA_P.Zip5);

  // should not be any undefined
  assert(!(_.has(s, 'undefined')), util.format('Subject has undefined properties:%j', s));
  assert(!(_.has(address, 'undefined')), util.format('Address has undefined properties:%j', s));
}

// create bob in aetna schema
function createBob() {
  var b = {};
  b['@id'] = CANON_DATA.bobAetnaId;
  b['@type'] = [AETNA_T.Subject];
  b[AETNA_P.Gender] = COMMON_CD.bobGender;
  b[AETNA_P.DOB] = COMMON_CD.bobBirthDate;
  b[AETNA_P.SSN] = COMMON_CD.bobSSN;

  b[AETNA_P.SourceID] = CANON_DATA.bobAetnaSourceID;

  // add name
  b[AETNA_P.FirstName] = COMMON_CD.bobGivenName;
  b[AETNA_P.LastName] = COMMON_CD.bobFamilyName;

  // add address
  b[AETNA_P.Address] = jsonldUtils.createBlankNode({'@type': [AETNA_T.Address]});
  b[AETNA_P.Address][AETNA_P.Address1stLine] = COMMON_CD.bobAddressLine1;
  b[AETNA_P.Address][AETNA_P.Address2ndLine] = COMMON_CD.bobAddressLine2;
  b[AETNA_P.Address][AETNA_P.City] = COMMON_CD.bobCity;
  b[AETNA_P.Address][AETNA_P.State] = COMMON_CD.bobState;
  b[AETNA_P.Address][AETNA_P.Zip5] = COMMON_CD.bobZip5;

  return b;
}

function checkBobStructure(bob, props) {
  if (!props) {
    props = {};
  }

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.bobAetnaId;
  }

  checkSubjectStructure(bob, props);

}

// ALICE

function createAlice() {
  var b = {};
  b['@id'] = CANON_DATA.aliceAetnaId;
  b['@type'] = [AETNA_T.Subject];
  b[AETNA_P.Gender] = COMMON_CD.aliceGender;
  b[AETNA_P.DOB] = COMMON_CD.aliceBirthDate;
  b[AETNA_P.SourceID] = CANON_DATA.aliceAetnaSourceID;
  b[AETNA_P.SSN] = COMMON_CD.aliceSSN;

  // add name
  b[AETNA_P.FirstName] = COMMON_CD.aliceGivenName;
  b[AETNA_P.LastName] = COMMON_CD.aliceFamilyName;

  // add address
  b[AETNA_P.Address] = jsonldUtils.createBlankNode({'@type': [AETNA_T.Address]});
  b[AETNA_P.Address][AETNA_P.Address1stLine] = COMMON_CD.aliceAddressLine1;
  b[AETNA_P.Address][AETNA_P.Address2ndLine] = COMMON_CD.aliceAddressLine2;
  b[AETNA_P.Address][AETNA_P.City] = COMMON_CD.aliceCity;
  b[AETNA_P.Address][AETNA_P.State] = COMMON_CD.aliceState;
  b[AETNA_P.Address][AETNA_P.Zip5] = COMMON_CD.aliceZip5;

  return b;
}

function checkAliceStructure(alice, props) {
  if (!props) {
    props = {};
  }

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.aliceAetnaId;
  }

  return checkSubjectStructure(alice, props);
}

module.exports = {
  CANON_DATA: CANON_DATA,
  createAlice: createAlice,
  checkAliceStructure: checkAliceStructure,
  createBob: createBob,
  checkBobStructure: checkBobStructure
};
