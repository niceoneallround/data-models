/*jslint node: true, vars: true */

const should = require('should');
const PNDataModel = require('../lib/PNDataModel');
const PN_P = PNDataModel.PROPERTY;
const PN_T = PNDataModel.TYPE;
const PNSyndicatedEntity = require('../lib/PNSyndicatedEntity');

describe('PNSE PN Syndicated Entty Tests', function () {
  'use strict';

  describe('1 create PN Syndicated Tests', function () {

    it('1.1 create PN obfuscated value with just a value', function () {
      let se = PNSyndicatedEntity.createJSON('23', { hostname: 'abc.com', jobId: 'job-id', pnDataModelId: 'dm-id', subjectIds: 'a' });
      se.should.have.property('@id', 'https://pn.id.webshield.io/syndicated_entity/com/abc#23');
      se.should.have.property('@type', [PN_T.SyndicatedEntity]);
      se.should.have.property(PN_P.pnDataModel, 'dm-id');
      se.should.have.property(PN_P.subject, ['a']);
      se.should.have.property(PN_P.job, 'job-id');
    });

  }); // describe 1

});
