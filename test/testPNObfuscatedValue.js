/*jslint node: true, vars: true */

const should = require('should');
const PNOVUtils = require('../lib/PNObfuscatedValue').utils;

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

  describe('3 OItem tests', function () {

    it('3.1 should created Oitem just id, type and v', function () {
      let oitem = PNOVUtils.createOItem('id1', 'type1', 'value1');
      oitem.should.have.property('id', 'id1');
      oitem.should.have.property('type', 'type1');
      oitem.should.have.property('v', 'value1');
    }); //it 3.1

    it('3.2 should create a PN Obfuscted value from an Oitem', function () {
      let oitem = PNOVUtils.createOItem('id1', 'type1', 'value1');
      let ov = PNOVUtils.createOVFromOItem(oitem);
      ov.should.have.property('@type', 'type1');
      ov.should.have.property('@value', 'value1');
    }); //it 3.1
  }); // describe 3
});
