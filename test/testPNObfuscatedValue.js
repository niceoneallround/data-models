/*jslint node: true, vars: true */

const assert = require('assert');
const should = require('should');
const PNDataModel = require('../lib/PNDataModel');
const PNOVUtils = require('../lib/PNObfuscatedValue').utils;
const util = require('util');

describe('PNov Obfuscated Value Tests', function () {
  'use strict';

  describe('1 create PN Obfuscated Value Tests', function () {

    it('1.1 create PN obfuscated value with just a value', function () {
      let ov = PNOVUtils.pack('paiid', 'val1');
      ov.should.have.property('@type', 'paiid');
      ov.should.have.property('@value', 'val1');
    });

    it('1.2 create PN obfuscated value with a value, nonce, and aad', function () {
      let ov = PNOVUtils.pack('paiid', 'val1', { n: 'non1', aad: 'aad1', });
      ov.should.have.property('@type', 'paiid');
      ov.should.have.property('@value', 'non1.aad1.val1');
    });

    it('1.3 create PN obfuscated value with a value and a nonce', function () {
      let ov = PNOVUtils.pack('paiid', 'val1', { n: 'non1', });
      ov.should.have.property('@type', 'paiid');
      ov.should.have.property('@value', 'non1..val1');
    });

    it('1.4 create PN obfuscated value with a value and a aad', function () {
      let ov = PNOVUtils.pack('paiid', 'val1', { aad: 'aad1', });
      ov.should.have.property('@type', 'paiid');
      ov.should.have.property('@value', '.aad1.val1');
    });

  }); // describe 1

  describe('2 unpack a PN Obfuscated Value Tests', function () {

    it('2.1 should unpack just a value', function () {
      let ov = { '@type': 'paiid', '@value': 'val1' };
      let unpack = PNOVUtils.unpack(ov);
      unpack.should.have.property('type', 'paiid');
      unpack.should.have.property('v', 'val1');
      unpack.should.not.have.property('n');
      unpack.should.not.have.property('aad');
    });

    it('2.2 should unpack a value, nonce and aad', function () {
      let ov = { '@type': 'paiid', '@value': 'non1.aad1.val1' };
      let unpack = PNOVUtils.unpack(ov);
      unpack.should.have.property('type', 'paiid');
      unpack.should.have.property('v', 'val1');
      unpack.should.have.property('n', 'non1');
      unpack.should.have.property('aad', 'aad1');
    });

    it('2.3 should unpack a value, and aad', function () {
      let ov = { '@type': 'paiid', '@value': '.aad1.val1' };
      let unpack = PNOVUtils.unpack(ov);
      unpack.should.have.property('type', 'paiid');
      unpack.should.have.property('v', 'val1');
      unpack.should.not.have.property('n');
      unpack.should.have.property('aad', 'aad1');
    });

    it('2.4 should unpack a value, and nonce', function () {
      let ov = { '@type': 'paiid', '@value': 'nonce1..val1' };
      let unpack = PNOVUtils.unpack(ov);
      unpack.should.have.property('type', 'paiid');
      unpack.should.have.property('v', 'val1');
      unpack.should.have.property('n', 'nonce1');
      unpack.should.not.have.property('aad');
    });
  }); // describe 2

  describe('3 create Oitem tests', function () {

    it('3.1 should created Oitem just id, type and v', function () {
      let oitem = PNOVUtils.createOItem('id1', 'type1', 'value1');
      oitem.should.have.property('id', 'id1');
      oitem.should.have.property('type', 'type1');
      oitem.should.have.property('v', 'value1');
    }); //it 3.1

    it('3.2 should create an Oitem from a PN Obfuscated Value', function () {
      let ov = { '@type': 'paiid', '@value': 'nonce1..val1' };
      let newOI = PNOVUtils.createOItemFromOV('11', ov);
      newOI.should.have.property('id', '11');
      newOI.should.have.property('type', 'paiid');
      newOI.should.have.property('v', 'val1');
      newOI.should.have.property('n', 'nonce1');
    }); //it 3.2
  }); // describe 3

  describe('4 create OV tests', function () {

    it('4.1 should create a PN Obfuscted value from an Oitem', function () {
      let oitem = PNOVUtils.createOItem('id1', 'type1', 'value1');
      let ov = PNOVUtils.createOVFromOItem(oitem);
      ov.should.have.property('@type', 'type1');
      ov.should.have.property('@value', 'value1');
    }); //it 4.1
  }); // describe 4

  describe('5 test is OV', function () {

    it('5.1 should return true is value is an OV', function () {
      const pvId = PNDataModel.ids.createPrivacyActionInstanceId('fake.com', 1);
      const ov = { '@type': pvId, '@value': 'dont-care', };
      assert(PNOVUtils.isOV(ov), util.format('Value should be an OV:%j', ov));
    }); //it 5.1

    it('5.2 should return false is value is a string', function () {
      assert(!PNOVUtils.isOV('abce'), util.format('Value should not be an OV:%s', 'abce'));
    }); //it 5.2

    it('5.3 should return false is value is a jsonld object node', function () {
      const o = { '@type': 'abc', '@id': 'dont-care', };
      assert(!PNOVUtils.isOV(o), util.format('Value should not be an OV:%j', o));
    }); //it 5.3

    it('5.4 should return false if @type is not an action', function () {
      const o = { '@type': 'abc', '@value': 'dont-care', };
      assert(!PNOVUtils.isOV(o), util.format('Value should not be an OV:%j', o));
    }); //it 5.4

  }); // describe 5
});
