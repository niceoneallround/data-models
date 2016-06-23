/*jslint node: true, vars: true */
'use strict';

var assert = require('assert'),
  ExperianPnDataModel = require('./ExperianPnDataModel'),
  EXPERIAN_P = ExperianPnDataModel.PROPERTY,
  EXPERIAN_T = ExperianPnDataModel.TYPE,
  jsonldUtils = require('jsonld-utils/lib/jldUtils'),
  util = require('util'),
  _ = require('underscore'),
  COMMON_CD = require('./commonCanonData').CANON_DATA,
  CANON_DATA,
  utils = {};

CANON_DATA = {
  alice: {
    id:         'https://id.webshield.io/com/experian/people/alice',
    ExperianTransactionID: 'https://experian-com/experian-id/alice',
    SourceID:   'https://experian-com/experian-id/alice'
  },

  bob: {
    id:         'https://id.webshield.io/com/experian/people/bob',
    ExperianTransactionID: 'https://experian-com/experian-id/bob',
    SourceID:   'https://experian-com/experian-id/bob'
  },

  rich: {
    id:         'https://id.webshield.io/com/experian/people/rich',
    ExperianTransactionID: 'https://experian-com/experian-id/rich',
    SourceID:   'https://experian-com/experian-id/rich'
  }
};

// props.id
// props.skipSSN
utils.checkSubjectStructure = function checkSubjectStructure(s, props) {

  var address, name;
  assert(s, 'No subject passed in');
  s.should.have.property('@id', props.id);
  assert(jsonldUtils.isType(s, EXPERIAN_T.Subject), util.format('Subject is not an Experian subject:%j', s));

  // check inline
  s.should.have.property(EXPERIAN_P.DOB);
  s.should.have.property(EXPERIAN_P.ExperianTransactionID);
  s.should.have.property(EXPERIAN_P.Gender);
  s.should.have.property(EXPERIAN_P.SourceID);
  if (props && !props.skipSSN) {
    s.should.have.property(EXPERIAN_P.SSN);
  }

  // check name
  s.should.have.property(EXPERIAN_P.Name);
  name = jsonldUtils.getO(s[EXPERIAN_P.Name]);
  assert(jsonldUtils.isType(name, EXPERIAN_T.Name), util.format('Name is not an Experian Name:%j', address));
  name.should.have.property(EXPERIAN_P.First);
  name.should.have.property(EXPERIAN_P.Surname);

  // check address
  s.should.have.property(EXPERIAN_P.CurrentAddress);
  address = jsonldUtils.getO(s[EXPERIAN_P.CurrentAddress]);
  assert(jsonldUtils.isType(address, EXPERIAN_T.Address), util.format('Address is not an Experian Address:%j', address));
  address.should.have.property(EXPERIAN_P.Address1);
  address.should.have.property(EXPERIAN_P.City);
  address.should.have.property(EXPERIAN_P.State);
  address.should.have.property(EXPERIAN_P.ZipCode);

  // should not be any undefined
  assert(!(_.has(s, 'undefined')), util.format('Subject has undefined properties:%j', s));
  assert(!(_.has(address, 'undefined')), util.format('Address has undefined properties:%j', s));
};

// create bob
utils.createBob = function createBob() {
  var b = {};
  b['@id'] = CANON_DATA.bob.id;
  b['@type'] = [EXPERIAN_T.Subject];
  b[EXPERIAN_P.Gender] = COMMON_CD.bob.Gender;
  b[EXPERIAN_P.DOB] = COMMON_CD.bob.BirthDate;
  b[EXPERIAN_P.SSN] = COMMON_CD.bob.SSN;
  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA.bob.ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA.bob.SourceID;

  // add address
  b[EXPERIAN_P.CurrentAddress] = ExperianPnDataModel.utils.createAddressNode();
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.Address1] = COMMON_CD.bob.AddressLine1;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.City] = COMMON_CD.bob.City;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.State] = COMMON_CD.bob.State;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.ZipCode] = COMMON_CD.bob.Zip5;

  b[EXPERIAN_P.Name] = ExperianPnDataModel.utils.createNameNode();
  b[EXPERIAN_P.Name][EXPERIAN_P.First] = COMMON_CD.bob.GivenName;
  b[EXPERIAN_P.Name][EXPERIAN_P.Surname] = COMMON_CD.bob.FamilyName;

  return b;
};

// props.id
// props.skipSSN
utils.checkBobStructure = function checkBobStructure(bob, props) {
  if (!props) {
    props = {};
  }

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.bob.id;
  }

  return utils.checkSubjectStructure(bob, props);

};

// ALICE
utils.createAlice = function createAlice() {
  var b = {};
  b['@id'] = CANON_DATA.alice.id;
  b['@type'] = [EXPERIAN_T.Subject];
  b[EXPERIAN_P.Gender] = COMMON_CD.alice.Gender;
  b[EXPERIAN_P.DOB] = COMMON_CD.alice.BirthDate;
  b[EXPERIAN_P.SSN] = COMMON_CD.alice.SSN;
  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA.alice.ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA.alice.SourceID;

  // add address
  b[EXPERIAN_P.CurrentAddress] = ExperianPnDataModel.utils.createAddressNode();
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.Address1] = COMMON_CD.alice.AddressLine1;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.City] = COMMON_CD.alice.City;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.State] = COMMON_CD.alice.State;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.ZipCode] = COMMON_CD.alice.Zip5;

  b[EXPERIAN_P.Name] = ExperianPnDataModel.utils.createNameNode();
  b[EXPERIAN_P.Name][EXPERIAN_P.First] = COMMON_CD.alice.GivenName;
  b[EXPERIAN_P.Name][EXPERIAN_P.Surname] = COMMON_CD.alice.FamilyName;

  return b;
};

// props.id
// props.skipSSN
utils.checkAliceStructure = function checkAliceStructure(alice, props) {
  if (!props) {
    props = {};
  }

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.alice.id;
  }

  return utils.checkSubjectStructure(alice, props);
};

// Rich
utils.createRich = function createRich() {
  var b = {};
  b['@id'] = CANON_DATA.rich.id;
  b['@type'] = [EXPERIAN_T.Subject];
  b[EXPERIAN_P.Gender] = COMMON_CD.rich.Gender;
  b[EXPERIAN_P.DOB] = COMMON_CD.rich.BirthDate;
  b[EXPERIAN_P.SSN] = COMMON_CD.rich.SSN;
  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA.rich.ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA.rich.SourceID;

  // add address
  b[EXPERIAN_P.CurrentAddress] = ExperianPnDataModel.utils.createAddressNode();
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.Address1] = COMMON_CD.rich.AddressLine1;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.City] = COMMON_CD.rich.City;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.State] = COMMON_CD.rich.State;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.ZipCode] = COMMON_CD.rich.Zip5;

  b[EXPERIAN_P.Name] = ExperianPnDataModel.utils.createNameNode();
  b[EXPERIAN_P.Name][EXPERIAN_P.First] = COMMON_CD.rich.GivenName;
  b[EXPERIAN_P.Name][EXPERIAN_P.Surname] = COMMON_CD.rich.FamilyName;

  return b;
};

// props.id
// props.skipSSN
utils.checkRichStructure = function checkRichStructure(rich, props) {
  if (!props) {
    props = {};
  }

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.rich.id;
  }

  return utils.checkSubjectStructure(rich, props);
};

module.exports = {
  CANON_DATA: CANON_DATA,
  utils: utils
};
