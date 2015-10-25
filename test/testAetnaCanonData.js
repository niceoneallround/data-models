/*jslint node: true, vars: true */

var should = require('should'),
  AetnaCanonData = require('../lib/AetnaCanonData'),
  COMMON_CD = require('../lib/commonCanonData').CANON_DATA,
  AETNA_P = require('../lib/AetnaPnDataModel').PROPERTY,
  AetnaSSNValidEnum = require('../lib/AetnaPnDataModel').SSNValidEnum;

describe('Aetna Canon Data tests', function() {
  'use strict';

  describe('1 create tests', function() {

    it('1.1 test create Bob', function() {
      var bob = AetnaCanonData.createBob();
      bob.should.have.property(AETNA_P.DOB, COMMON_CD.bobBirthDate);
      bob.should.have.property(AETNA_P.SSN, COMMON_CD.bobSSN);
      AetnaCanonData.checkBobStructure(bob);
    });

    it('1.2 test override props.id checkBobStructure ', function() {
      var bob = AetnaCanonData.createBob();
      bob['@id'] = '23'; // by default checks on canonId
      AetnaCanonData.checkBobStructure(bob, {id: '23'});
    });

    it('1.3 test create ln Alice', function() {
      var a = AetnaCanonData.createAlice();
      a.should.have.property(AETNA_P.DOB, COMMON_CD.aliceBirthDate);
      AetnaCanonData.checkAliceStructure(a);
    });

    it('1.4 test SSNValid enum', function() {
      var a = AetnaCanonData.createAlice();
      AetnaCanonData.checkAliceStructure(a);
      a[AETNA_P.SSNValid] = AetnaSSNValidEnum.Good.code;
      a.should.have.property(AETNA_P.SSNValid, 'Good');
    });

  }); // describe 2
});
