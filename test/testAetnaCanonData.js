/*jslint node: true, vars: true */

const should = require('should');
const AetnaCanonData = require('../lib/AetnaCanonData');
const COMMON_CD = require('../lib/commonCanonData').CANON_DATA;
const AETNA_P = require('../lib/AetnaPnDataModel').PROPERTY;
const AetnaSSNValidEnum = require('../lib/AetnaPnDataModel').SSNValidEnum;

describe('Aetna Canon Data tests', function () {
  'use strict';

  describe('1 create Aetna canon data tests', function () {

    it('1.1 test create Bob', function () {
      let bob = AetnaCanonData.createBob();
      bob.should.have.property(AETNA_P.DOB, COMMON_CD.bobBirthDate);
      bob.should.have.property(AETNA_P.SSN, COMMON_CD.bobSSN);
      AetnaCanonData.checkBobStructure(bob);
    });

    it('1.2 test override props.id checkBobStructure ', function () {
      let bob = AetnaCanonData.createBob();
      bob['@id'] = '23'; // by default checks on canonId
      AetnaCanonData.checkBobStructure(bob, { id: '23' });
    });

    it('1.3 test create Alice', function () {
      let a = AetnaCanonData.createAlice();
      a.should.have.property(AETNA_P.DOB, COMMON_CD.aliceBirthDate);
      AetnaCanonData.checkAliceStructure(a);
    });

    it('1.4 test SSNValid enum', function () {
      let a = AetnaCanonData.createAlice();
      AetnaCanonData.checkAliceStructure(a);
      a[AETNA_P.SSNValid] = AetnaSSNValidEnum.Good.code;
      a.should.have.property(AETNA_P.SSNValid, 'Good');
    });

    it('1.5 test create Rich', function () {
      let r = AetnaCanonData.createRich();
      r.should.have.property(AETNA_P.DOB, COMMON_CD.rich.BirthDate);
      AetnaCanonData.checkRichStructure(r);
    });

    it('1.6 test create Roger', function () {
      let r = AetnaCanonData.createRoger();
      AetnaCanonData.checkRogerStructure(r);
    });

  }); // describe 2
});
