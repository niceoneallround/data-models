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
  bobAetnaSourceID:   'http://aetna.xycom/people/bob',

  rich: {
    AetnaId:         'http://id.webshield.io/xycom/aetna/people/rich',
    AetnaSourceID:   'http://aetna.xycom/people/rich'
  },

  roger: {
    AetnaId:         'http://id.webshield.io/xycom/aetna/people/roger',
    AetnaSourceID:   'http://aetna.xycom/people/roger'
  }
};

// props.id
// props.skipSSN
function checkSubjectStructure(s, props) {

  var address;
  assert(s, 'No subject passed in');
  s.should.have.property('@id', props.id);
  assert(jsonldUtils.isType(s, AETNA_T.Subject), util.format('Subject is not an Aetna subject:%j', s));
  s.should.have.property(AETNA_P.SourceID);

  // check inline
  if (COMMON_CD[props.name].Gender) {
    s.should.have.property(AETNA_P.Gender);
  }

  if (COMMON_CD[props.name].BirthDate) {
    s.should.have.property(AETNA_P.DOB);
  }

  // if ask to not check SSN then skip this - as test will do
  if (props && !props.skipSSN) {
    s.should.have.property(AETNA_P.SSN);
  }

  // check name
  s.should.have.property(AETNA_P.FirstName);
  s.should.have.property(AETNA_P.LastName);

  // check address
  s.should.have.property(AETNA_P.Address);
  address = jsonldUtils.getO(s[AETNA_P.Address]);
  assert(jsonldUtils.isType(address, AETNA_T.Address), util.format('Address is not an Aetna Address:%j', address));

  address.should.have.property(AETNA_P.Address1stLine);

  if (COMMON_CD[props.name].AddressLine2) {
    address.should.have.property(AETNA_P.Address2ndLine);
  }

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
  b[AETNA_P.Address] = jsonldUtils.createBlankNode({ '@type': [AETNA_T.Address] });
  b[AETNA_P.Address][AETNA_P.Address1stLine] = COMMON_CD.bobAddressLine1;
  b[AETNA_P.Address][AETNA_P.Address2ndLine] = COMMON_CD.bobAddressLine2;
  b[AETNA_P.Address][AETNA_P.City] = COMMON_CD.bobCity;
  b[AETNA_P.Address][AETNA_P.State] = COMMON_CD.bobState;
  b[AETNA_P.Address][AETNA_P.Zip5] = COMMON_CD.bobZip5;

  return b;
}

// props.id
// props.skipSSN
function checkBobStructure(bob, props) {
  if (!props) {
    props = {};
  }

  props.name = 'bob';

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
  b[AETNA_P.Address] = jsonldUtils.createBlankNode({ '@type': [AETNA_T.Address] });
  b[AETNA_P.Address][AETNA_P.Address1stLine] = COMMON_CD.aliceAddressLine1;
  b[AETNA_P.Address][AETNA_P.Address2ndLine] = COMMON_CD.aliceAddressLine2;
  b[AETNA_P.Address][AETNA_P.City] = COMMON_CD.aliceCity;
  b[AETNA_P.Address][AETNA_P.State] = COMMON_CD.aliceState;
  b[AETNA_P.Address][AETNA_P.Zip5] = COMMON_CD.aliceZip5;

  return b;
}

// props.id
// props.skipSSN
function checkAliceStructure(alice, props) {
  if (!props) {
    props = {};
  }

  props.name = 'alice';

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.aliceAetnaId;
  }

  return checkSubjectStructure(alice, props);
}

// Rich
function createRich() {
  var b = {};
  b['@id'] = CANON_DATA.rich.AetnaId;
  b['@type'] = [AETNA_T.Subject];
  b[AETNA_P.Gender] = COMMON_CD.rich.Gender;
  b[AETNA_P.DOB] = COMMON_CD.rich.BirthDate;
  b[AETNA_P.SourceID] = CANON_DATA.rich.AetnaSourceID;
  b[AETNA_P.SSN] = COMMON_CD.rich.SSN;

  // add name
  b[AETNA_P.FirstName] = COMMON_CD.rich.GivenName;
  b[AETNA_P.LastName] = COMMON_CD.rich.FamilyName;

  // add address
  b[AETNA_P.Address] = jsonldUtils.createBlankNode({ '@type': [AETNA_T.Address] });
  b[AETNA_P.Address][AETNA_P.Address1stLine] = COMMON_CD.rich.AddressLine1;
  b[AETNA_P.Address][AETNA_P.Address2ndLine] = COMMON_CD.rich.AddressLine2;
  b[AETNA_P.Address][AETNA_P.City] = COMMON_CD.rich.City;
  b[AETNA_P.Address][AETNA_P.State] = COMMON_CD.rich.State;
  b[AETNA_P.Address][AETNA_P.Zip5] = COMMON_CD.rich.Zip5;

  return b;
}

// props.id
// props.skipSSN
function checkRichStructure(rich, props) {
  if (!props) {
    props = {};
  }

  props.name = 'rich';

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.rich.AetnaId;
  }

  return checkSubjectStructure(rich, props);
}

//------------------
// Roger
//------------------

function createRoger() {
  var b = {}, name = 'roger';

  b['@id'] = CANON_DATA[name].AetnaId;
  b['@type'] = [AETNA_T.Subject];
  b[AETNA_P.SourceID] = CANON_DATA[name].AetnaSourceID;

  if (COMMON_CD[name].Gender) {
    b[AETNA_P.Gender] = COMMON_CD[name].Gender;
  }

  if (COMMON_CD[name].BirthDate) {
    b[AETNA_P.DOB] = COMMON_CD[name].BirthDate;
  }

  if (CANON_DATA[name].SSN) {
    b[AETNA_P.SSN] = COMMON_CD[name].SSN;
  }

  // add name
  b[AETNA_P.FirstName] = COMMON_CD[name].GivenName;
  b[AETNA_P.LastName] = COMMON_CD[name].FamilyName;
  if (COMMON_CD[name].additionalName) {
    b[AETNA_P.MiddleName] = COMMON_CD[name].additionalName;
  }

  // add address
  b[AETNA_P.Address] = jsonldUtils.createBlankNode({ '@type': [AETNA_T.Address] });
  b[AETNA_P.Address][AETNA_P.Address1stLine] = COMMON_CD[name].AddressLine1;

  if (CANON_DATA[name].AddressLine2) {
    b[AETNA_P.Address][AETNA_P.Address2ndLine] = COMMON_CD[name].AddressLine2;
  }

  b[AETNA_P.Address][AETNA_P.City] = COMMON_CD[name].City;
  b[AETNA_P.Address][AETNA_P.State] = COMMON_CD[name].State;
  b[AETNA_P.Address][AETNA_P.Zip5] = COMMON_CD[name].Zip5;

  return b;
}

// props.id
// props.skipSSN
function checkRogerStructure(roger, props) {
  if (!props) {
    props = {};
  }

  props.name = 'roger';
  props.skipSSN = true; // roger never has a ssn

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.roger.AetnaId;
  }

  return checkSubjectStructure(roger, props);
}

module.exports = {
  CANON_DATA: CANON_DATA,
  createAlice: createAlice,
  checkAliceStructure: checkAliceStructure,
  createBob: createBob,
  checkBobStructure: checkBobStructure,
  createRich: createRich,
  checkRichStructure: checkRichStructure,
  createRoger: createRoger,
  checkRogerStructure: checkRogerStructure
};
