/*jslint node: true, vars: true */

const should = require('should');
const PNDataModel = require('../lib/PNDataModel');
const PN_T = PNDataModel.TYPE;
const PNSyndicatedEntity = require('../lib/PNSyndicatedEntity');

describe('PNSE PN Syndicated Entty Tests', function () {
  'use strict';

  describe('1 create PN Syndicated Tests', function () {

    it('1.1 create PN obfuscated value with just a value', function () {
      let se = PNSyndicatedEntity.create('23', { hostname: 'abc.com', });
      se.should.have.property('@id');
      se.should.have.property('@type', [PN_T.SyndicatedEntity]);
    });

  }); // describe 1

});
