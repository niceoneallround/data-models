/*jslint node: true, vars: true */

var should = require('should'),
  assert = require('assert'),
  PPN = require('../lib/PrivacyPNDataModel'),
  PPNUtils = PPN.utils,
  util = require('util');

describe('Test Privacy PN Data Models', function () {
  'use strict';

  describe('1 test create PATAG', function () {

    it('1.1 should create in correct format', function () {
      var tagValue = 'deadcows', patag;

      patag = PPNUtils.createPATAG(tagValue);
      patag.should.be.equal('http://privacy.pn.schema.webshield.io/patag#deadcows');
    });
  }); // describe 1

  describe('2 test create obfuscated typed value', function () {

    it('2.1 should create with an array ', function () {
      var props, pv, patag;

      patag = PPNUtils.createPATAG('test21');

      props = {};
      props.evalue = '23';
      props.octx = [patag];
      pv = PPNUtils.createObfuscatedValue(props);
      assert(pv, util.format('no privacy value returned for props:%j', props));

      pv.should.have.property('@value', props.evalue);
      pv.should.have.property('@type');
      assert((pv['@type'].length === 1), util.format('expected type length of 1 got:%s pv is:%j', pv['@type'].length, pv));
      pv['@type'][0].should.be.equal(patag);

    });

    it('2.2 create with octx and instance', function () {
      var props, pv, patag;

      patag = PPNUtils.createPATAG('test22');

      props = {};
      props.evalue = '56';
      props.octx = patag;
      pv = PPNUtils.createObfuscatedValue(props);
      assert(pv, util.format('no privacy value returned for props:%j', props));

      pv.should.have.property('@value', props.evalue);
      pv.should.have.property('@type', patag);
    });
  }); // describe 2

  describe('3 isObfuscated tests', function () {

    var patag = PPNUtils.createPATAG('test3');

    it('3.1 array with just a non typed @value', function () {
      var t = [{ '@value': '23' }];
      assert(!PPNUtils.isObfuscated(t), util.format('isObfuscted did not return false%j', t));
    });

    it('3.2 a non typed @value', function () {
      var t = { '@value': '23' };
      assert(!PPNUtils.isObfuscated(t), util.format('isObfuscted did not return false%j', t));
    });

    it('3.3 array containing an obfuscated @type and @value in expanded format - i.e an array', function () {
      var t = [{ '@type':patag, '@value': '23' }];
      assert(PPNUtils.isObfuscated(t), util.format('isObfuscted did not return false%j', t));
    });

    it('3.4 array containing an obfuscated @type and @value in compact format', function () {
      var t = { '@type': patag, '@value': '23' };
      assert(PPNUtils.isObfuscated(t), util.format('isObfuscted did not return false%j', t));
    });

    it('3.5 array containing an obfuscated @type and @value in expanded format - i.e an array', function () {
      var t = [{ '@type': 'type1', '@value': '23' }];
      assert(!PPNUtils.isObfuscated(t), util.format('isObfuscted did not return false%j', t));
    });

    it('3.6 array containing an NON obfuscated @type and @value in compact format', function () {
      var t = { '@type': 'type1', '@value': '23' };
      assert(!PPNUtils.isObfuscated(t), util.format('isObfuscted did not return false%j', t));
    });
  }); // describe 2
});
