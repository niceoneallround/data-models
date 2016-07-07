/*jslint node: true, vars: true */

var should = require('should'),
  AccepttoCanonData = require('../lib/AccepttoCanonData'),
  ACE_CANON_DATA = require('../lib/AccepttoCanoNData').CANON_DATA,
  ACCEPTTO_P = require('../lib/AccepttoPnDataModel').PROPERTY;

describe('Acceptto Canon Data tests', function () {
  'use strict';

  describe('1 create Acceptto canon data tests', function () {

    it('1.1 test create outbound encrypt metadata', function () {
      var md = AccepttoCanonData.utils.createOutboundEncryptMetadata();
      md.should.have.property(ACCEPTTO_P.processId, ACE_CANON_DATA.out.processId);
      md.should.have.property(ACCEPTTO_P.outboundJobId, ACE_CANON_DATA.out.jobId);
    });

    it('1.2 test create inbound encrypt metadata', function () {
      var md = AccepttoCanonData.utils.createInboundEncryptMetadata();
      md.should.have.property(ACCEPTTO_P.processId, ACE_CANON_DATA.in.processId);
      md.should.have.property(ACCEPTTO_P.inboundJobId, ACE_CANON_DATA.in.jobId);
    });

  }); // describe 1
});
