/*jslint node: true, vars: true */

var should = require('should'),
  ExperianCanonData = require('../lib/ExperianCanonData'),
  COMMON_CD = require('../lib/commonCanonData').CANON_DATA,
  ExperianPnDataModel = require('../lib/ExperianPnDataModel'),
  EXP_CANON_DATA = require('../lib/ExperianCanoNData').CANON_DATA,
  EXPERIAN_P = ExperianPnDataModel.PROPERTY;

describe('Experian Canon Data tests', function () {
  'use strict';

  describe('1 create tests', function () {

    it('1.1 test create Bob', function () {
      var bob = ExperianCanonData.utils.createBob();
      bob.should.have.property(EXPERIAN_P.DOB, COMMON_CD.bob.BirthDate);
      bob.should.have.property(EXPERIAN_P.SSN, EXP_CANON_DATA.bob.SSN);
      ExperianCanonData.utils.checkBobStructure(bob);
    });

    it('1.2 test override props.id checkBobStructure ', function () {
      var bob = ExperianCanonData.utils.createBob();
      bob['@id'] = '23'; // by default checks on canonId
      ExperianCanonData.utils.checkBobStructure(bob, { id: '23' });
    });

    it('1.3 test create Alice', function () {
      var a = ExperianCanonData.utils.createAlice();
      a.should.have.property(EXPERIAN_P.DOB, COMMON_CD.alice.BirthDate);
      ExperianCanonData.utils.checkAliceStructure(a);
    });

    it('1.3 test create Rich', function () {
      var a = ExperianCanonData.utils.createRich();
      a.should.have.property(EXPERIAN_P.DOB, COMMON_CD.rich.BirthDate);
      ExperianCanonData.utils.checkRichStructure(a);
    });

  }); // describe 1
});
