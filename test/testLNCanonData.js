/*jslint node: true, vars: true */

//
// Test configuration im
//
var should = require('should'),
  LNCanonData = require('../lib/LNCanonData'),
  COMMON_CD = require('../lib/commonCanonData').CANON_DATA,
  LN_P = require('../lib/LNPnDataModel').PROPERTY,
  _ = require('underscore');

describe('LN Canon Data tests', function() {
  'use strict';

  describe('1 test create alice and bob', function() {

    it('1.1 test create ln Bob', function() {
      var bob = LNCanonData.createBob();
      bob.should.have.property(LN_P.DOB, COMMON_CD.bobBirthDate);
      bob.should.have.property(LN_P.SSN, COMMON_CD.bobSSN);
      _.has(bob, 'undefined').should.be.eql(false, 'bob has an undefined property');

      LNCanonData.checkBobStructure(bob);
    });

    it('1.2 test override props.id checkBobStructure ', function() {
      var bob = LNCanonData.createBob();
      bob['@id'] = '23'; // by default checks on canonId
      LNCanonData.checkBobStructure(bob, {id: '23'});
    });

    it('1.2 test create ln Alice', function() {
      var a = LNCanonData.createAlice();
      a.should.have.property(LN_P.DOB, COMMON_CD.aliceBirthDate);
      _.has(a, 'undefined').should.be.eql(false, 'alice has an undefined property');

      LNCanonData.checkAliceStructure(a);
    });

  }); // describe 1
});
