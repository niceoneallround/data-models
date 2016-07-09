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
    ExperianTransactionID: 'alice_experian_xact',
    SourceID:   'alice_experian_sourceid',
    SSN:        'alice_experian_ssn',
    AetnaMemberIdNeededForAcceptto: 'alice_mem_acceptto_experian'
  },

  bob: {
    id:         'https://id.webshield.io/com/experian/people/bob',
    ExperianTransactionID: 'bob_experian_xact',
    SourceID:   'bob_experian_sourceid',
    SSN:        'bob_experian_ssn',
    AetnaMemberIdNeededForAcceptto: 'bob_mem_acceptto_experian'
  },

  rich: {
    id:         'https://id.webshield.io/com/experian/people/rich',
    ExperianTransactionID: 'rich_experian_xact',
    SourceID:   'rich_experian_sourceid',
    SSN:        'rich_experian_ssn',
    AetnaMemberIdNeededForAcceptto: 'rich_mem_acceptto_experian'
  },

  roger: {
    id:         'https://id.webshield.io/com/experian/people/roger',
    ExperianTransactionID: 'roger_experian_xact',
    SourceID:   'roger_experian_sourceid',
    SSN:        'roger_experian_ssn',
    AetnaMemberIdNeededForAcceptto: 'roger_mem_acceptto_experian'
  }
};

// props.id
// props.skipSSN
utils.checkSubjectStructure = function checkSubjectStructure(s, props) {

  var address, name;
  assert(s, 'No subject passed in');
  s.should.have.property('@id', props.id);
  assert(jsonldUtils.isType(s, EXPERIAN_T.Subject), util.format('Subject is not an Experian subject:%j', s));

  // If the common canonical data has a bithhdate for this subject then check the subject does
  if (COMMON_CD[props.name].BirthDate) {
    s.should.have.property(EXPERIAN_P.DOB);
  }

  if (COMMON_CD[props.name].Gender) {
    s.should.have.property(EXPERIAN_P.Gender);
  }

  s.should.have.property(EXPERIAN_P.ExperianTransactionID);
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
  b[EXPERIAN_P.SSN] = CANON_DATA.bob.SSN;
  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA.bob.ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA.bob.SourceID;
  b[EXPERIAN_P.AetnaMemberIdNeededForAcceptto] = CANON_DATA.bob.AetnaMemberIdNeededForAcceptto;

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

  props.name = 'bob';

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
  b[EXPERIAN_P.SSN] = CANON_DATA.alice.SSN;
  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA.alice.ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA.alice.SourceID;
  b[EXPERIAN_P.AetnaMemberIdNeededForAcceptto] = CANON_DATA.alice.AetnaMemberIdNeededForAcceptto;

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

  props.name = 'alice';

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
  b[EXPERIAN_P.SSN] = CANON_DATA.rich.SSN;
  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA.rich.ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA.rich.SourceID;
  b[EXPERIAN_P.AetnaMemberIdNeededForAcceptto] = CANON_DATA.rich.AetnaMemberIdNeededForAcceptto;

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

  props.name = 'rich';

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.rich.id;
  }

  return utils.checkSubjectStructure(rich, props);
};

//------------------------
// roger
//-------------------------

utils.createRoger = function createRoger() {
  var b = {}, name = 'roger';
  b['@id'] = CANON_DATA[name].id;
  b['@type'] = [EXPERIAN_T.Subject];

  if (COMMON_CD[name].Gender) {
    b[EXPERIAN_P.Gender] = COMMON_CD[name].Gender;
  }

  if (COMMON_CD[name].BirthDate) {
    b[EXPERIAN_P.DOB] = COMMON_CD[name].BirthDate;
  }

  if (CANON_DATA[name].SSN) {
    b[EXPERIAN_P.SSN] = CANON_DATA[name].SSN;
  }

  b[EXPERIAN_P.ExperianTransactionID] = CANON_DATA[name].ExperianTransactionID;
  b[EXPERIAN_P.SourceID] = CANON_DATA[name].SourceID;
  b[EXPERIAN_P.AetnaMemberIdNeededForAcceptto] = CANON_DATA[name].AetnaMemberIdNeededForAcceptto;

  // add address
  b[EXPERIAN_P.CurrentAddress] = ExperianPnDataModel.utils.createAddressNode();
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.Address1] = COMMON_CD[name].AddressLine1;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.City] = COMMON_CD[name].City;
  b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.State] = COMMON_CD[name].State;

  if (COMMON_CD[name].ZipCode) {
    b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.ZipCode] = COMMON_CD[name].ZipCode;
  } else if (COMMON_CD[name].Zip5) {
    b[EXPERIAN_P.CurrentAddress][EXPERIAN_P.ZipCode] = COMMON_CD[name].Zip5;
  }

  b[EXPERIAN_P.Name] = ExperianPnDataModel.utils.createNameNode();
  b[EXPERIAN_P.Name][EXPERIAN_P.First] = COMMON_CD[name].GivenName;

  if (COMMON_CD[name].additionalName) {
    b[EXPERIAN_P.Name][EXPERIAN_P.Middle] = COMMON_CD[name].additionalName;
  }

  b[EXPERIAN_P.Name][EXPERIAN_P.Surname] = COMMON_CD[name].FamilyName;

  return b;
};

// props.id
// props.skipSSN
utils.checkRogerStructure = function checkRogerStructure(roger, props) {
  if (!props) {
    props = {};
  }

  props.name = 'roger';

  // if not passed in the use default
  if (!props.id) {
    props.id =  CANON_DATA.roger.id;
  }

  return utils.checkSubjectStructure(roger, props);
};

module.exports = {
  CANON_DATA: CANON_DATA,
  utils: utils
};
