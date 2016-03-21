/*jslint node: true, vars: true */

var should = require('should'),
  PPN = require('../lib/PrivacyPNDataModel'),
  PPNUtils = PPN.utils;

describe('Test Privacy PN Data Models', function () {
  'use strict';

  describe('1 test create PATAG', function () {

    it('1.1 should create in correct format', function () {
      var tagValue = 'deadcows', patag;

      patag = PPNUtils.createPATAG(tagValue);
      patag.should.be.equal('http://privacy.pn.schema.webshield.io/patag#deadcows');
    });

  }); // describe 1
});
