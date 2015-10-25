/*jslint node: true, vars: true */

var should = require('should'),
  LNCanonData = require('../lib/LNCanonData'),
  COMMON_CD = require('../lib/commonCanonData').CANON_DATA,
  LN_P = require('../lib/LNPnDataModel').PROPERTY,
  LnSSNValidEnum = require('../lib/LNPnDataModel').SSNValidEnum,
  LnSubjectSSNIndicatorEnum = require('../lib/LNPnDataModel').SubjectSSNIndicatorEnum;

describe('LN Canon Data tests', function() {
  'use strict';

  describe('1 create tests', function() {

    it('1.1 test create Bob', function() {
      var bob = LNCanonData.createBob();
      bob.should.have.property(LN_P.DOB, COMMON_CD.bobBirthDate);
      bob.should.have.property(LN_P.DOD, COMMON_CD.bobDeathDate);
      bob.should.have.property(LN_P.SSN, COMMON_CD.bobSSN);
      bob.should.have.property(LN_P.SSNValid, LnSSNValidEnum.Good.code);
      bob.should.have.property(LN_P.SubjectSSNIndicator, LnSubjectSSNIndicatorEnum.Yes.code);
      LNCanonData.checkBobStructure(bob);
    });

    it('1.2 test override props.id checkBobStructure ', function() {
      var bob = LNCanonData.createBob();
      bob['@id'] = '23'; // by default checks on canonId
      LNCanonData.checkBobStructure(bob, {id: '23'});
    });

    it('1.3 test create ln Alice', function() {
      var a = LNCanonData.createAlice();
      a.should.have.property(LN_P.DOB, COMMON_CD.aliceBirthDate);
      LNCanonData.checkAliceStructure(a);
    });

  }); // describe 1
});
