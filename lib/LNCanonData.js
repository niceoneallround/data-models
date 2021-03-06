/*jslint node: true, vars: true */
'use strict';

var assert = require('assert'),
  LN_P = require('./LNPnDataModel').PROPERTY,
  LN_T = require('./LNPnDataModel').TYPE,
  LnSSNValidEnum = require('./LNPnDataModel').SSNValidEnum,
  LnSubjectSSNIndicatorEnum = require('./LNPnDataModel').SubjectSSNIndicatorEnum,
  LN = require('./LNPnDataModel'),
  jsonldUtils = require('jsonld-utils/lib/jldUtils'),
  util = require('util'),
  _ = require('underscore'),
  COMMON_CD = require('./commonCanonData').CANON_DATA,
  CANON_DATA,
  ACCURINT_TEST_DATA;

CANON_DATA = {
  // alice
  aliceLNId:          'http://id.webshield.io/ln/com#alice_lexid',  // http://id.webshield.io/<org-dns>#<id>
  aliceLNSourceID:    'http://ln.com/people/alice_lexid',
  aliceUniqueId:      'alice_lexid',
  aliceLNSSNValid:    LnSSNValidEnum.AnotherOnwer.code,
  aliceLNSubjectSSNIndicator: LnSubjectSSNIndicatorEnum.Maybe.code,

  // bob data
  bobLNId:            'http://id.webshield.io/ln/com#bob_lexid', // http://id.webshield.io/<org-dns>#<id>
  bobLNSourceID:      'http://ln.com/people/bob_lexid',
  bobUniqueId:        'bob_lexid',
  bobLNSSNValid:      LnSSNValidEnum.Good.code,
  bobLNSubjectSSNIndicator: LnSubjectSSNIndicatorEnum.Yes.code,

  rich: {
    LNId: 'http://id.webshield.io/ln/com#rich_lexid',
    LNSourceId:   'http://ln.com/people/rich_lexid',
    UniqueId: 'rich_lexid',
    SSNValid:      LnSSNValidEnum.Good.code,
    LNSubjectSSNIndicator: LnSubjectSSNIndicatorEnum.Yes.code
  }
};

// Test data provided by LN
ACCURINT_TEST_DATA = {
  alexero: {
    Name: {
      Prefix: 'MR',
      First: 'SIDNEY',
      Middle: 'HIRSH',
      Last: 'ALEXERO'
    },
    Address: {
      City: 'GREENWATER',
      State: 'FL',
      Zip5: '93840'
    },
    DOB: '1939/10/16'
  },
  clintost: {
    Name: {
      Prefix: 'MR',
      First: 'ANTHONY',
      Middle: 'ROBERT',
      Last: 'CLINTOST'
    },
    Address: {
      City: 'CARRVALE',
      State: 'OH',
      Zip5: '85123'
    },
    DOB: '1962/06/09'
  }
};

//  check the structure of a LN Subject, compare values with props
// props.id
function checkSubjectStructure(s, props) {
  var name, address;

  assert(s, 'No subject passed in');
  s.should.have.property('@id', props.id);
  assert(jsonldUtils.isType(s, LN_T.Subject), util.format('Subject is not an Aetna subject:%j', s));

  //  check inline
  s.should.have.property(LN_P.Gender);
  s.should.have.property(LN_P.DOB);
  s.should.have.property(LN_P.SourceID);
  s.should.have.property(LN_P.SSN);
  s.should.have.property(LN_P.SSNValid);
  s.should.have.property(LN_P.SubjectSSNIndicator);

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

  // should not be any undefined
  assert(!(_.has(s, 'undefined')), util.format('Subject has undefined properties:%j', s));
  assert(!(_.has(address, 'undefined')), util.format('Address has undefined properties:%j', s));
  assert(!(_.has(name, 'undefined')), util.format('Name has undefined properties:%j', s));
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
  b[LN_P.DOD] = COMMON_CD.bobDeathDate; // only bob has
  b[LN_P.SourceID] = CANON_DATA.bobLNSourceID;
  b[LN_P.UniqueId] = CANON_DATA.bobUniqueId;
  b[LN_P.SSN] = COMMON_CD.bobSSN;
  b[LN_P.SSNValid] = CANON_DATA.bobLNSSNValid;
  b[LN_P.SubjectSSNIndicator] = CANON_DATA.bobLNSubjectSSNIndicator;

  // create name
  b[LN_P.Name] = LN.createNameNode();
  b[LN_P.Name][LN_P.First] = COMMON_CD.bobGivenName;
  b[LN_P.Name][LN_P.Last] = COMMON_CD.bobFamilyName;

  // create address
  b[LN_P.Address] = LN.createAddressNode();
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

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.bobLNId;
  }

  checkSubjectStructure(bob, props);

  // bob has DOD
  bob.should.have.property(LN_P.DOD);

  bob.should.have.property(LN_P.UniqueId, CANON_DATA.bobUniqueId);
  bob.should.have.property(LN_P.SourceID, CANON_DATA.bobLNSourceID);
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
  b[LN_P.SourceID] = CANON_DATA.aliceLNSourceID;
  b[LN_P.UniqueId] = CANON_DATA.aliceUniqueId;
  b[LN_P.SSN] = COMMON_CD.aliceSSN;
  b[LN_P.SSNValid] = CANON_DATA.aliceLNSSNValid;
  b[LN_P.SubjectSSNIndicator] = CANON_DATA.aliceLNSubjectSSNIndicator;

  // create name
  b[LN_P.Name] = jsonldUtils.createBlankNode({ '@type': [LN_T.Name] });
  b[LN_P.Name][LN_P.First] = COMMON_CD.aliceGivenName;
  b[LN_P.Name][LN_P.Last] = COMMON_CD.aliceFamilyName;

  // create address
  b[LN_P.Address] = jsonldUtils.createBlankNode({ '@type': [LN_T.Address] });
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

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.aliceLNId;
  }

  alice.should.have.property(LN_P.SourceID, CANON_DATA.aliceLNSourceID);
  alice.should.have.property(LN_P.UniqueId, CANON_DATA.aliceUniqueId);

  return checkSubjectStructure(alice, props);
}

function createRich() {
  var b = {};
  b = jsonldUtils.createNode(CANON_DATA.rich.LNId, LN_T.Subject);

  // add top node props
  b[LN_P.Gender] = COMMON_CD.rich.Gender;
  b[LN_P.DOB] = COMMON_CD.rich.BirthDate;
  b[LN_P.SourceID] = CANON_DATA.rich.LNSourceID;
  b[LN_P.UniqueId] = CANON_DATA.rich.UniqueId;
  b[LN_P.SSN] = COMMON_CD.rich.SSN;
  b[LN_P.SSNValid] = CANON_DATA.rich.LNSSNValid;
  b[LN_P.SubjectSSNIndicator] = CANON_DATA.rich.LNSubjectSSNIndicator;

  // create name
  b[LN_P.Name] = jsonldUtils.createBlankNode({ '@type': [LN_T.Name] });
  b[LN_P.Name][LN_P.First] = COMMON_CD.rich.GivenName;
  b[LN_P.Name][LN_P.Last] = COMMON_CD.rich.FamilyName;

  // create address
  b[LN_P.Address] = jsonldUtils.createBlankNode({ '@type': [LN_T.Address] });
  b[LN_P.Address][LN_P.StreetAddress1] = COMMON_CD.rich.AddressLine1;
  b[LN_P.Address][LN_P.StreetAddress2] = COMMON_CD.rich.AddressLine2;
  b[LN_P.Address][LN_P.City] = COMMON_CD.rich.City;
  b[LN_P.Address][LN_P.State] = COMMON_CD.rich.State;
  b[LN_P.Address][LN_P.Zip5] = COMMON_CD.rich.Zip5;

  return b;
}

function checkRichStructure(rich, props) {
  if (!props) {
    props = {};
  }

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.rich.LNId;
  }

  rich.should.have.property(LN_P.SourceID, CANON_DATA.rich.LNSourceID);
  rich.should.have.property(LN_P.UniqueId, CANON_DATA.rich.UniqueId);

  return checkSubjectStructure(rich, props);
}

module.exports = {
  ACCURINT_TEST_DATA: ACCURINT_TEST_DATA,
  CANON_DATA: CANON_DATA,
  createAlice: createAlice,
  checkAliceStructure: checkAliceStructure,
  createBob: createBob,
  checkBobStructure: checkBobStructure,
  createRich: createRich,
  checkRichStructure: checkRichStructure
};
