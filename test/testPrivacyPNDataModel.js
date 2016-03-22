/*jslint node: true, vars: true */

var should = require('should'),
  assert = require('assert'),
  jsonldUtils = require('jsonld-utils/lib/jldUtils'),
  PN = require('../lib/PNDataModel'),
  PN_P = PN.PROPERTY,
  PN_T = PN.TYPE,
  PPN = require('../lib/PrivacyPNDataModel'),
  PPNUtils = PPN.utils,
  util = require('util');

describe('Test Privacy PN Data Models', function () {
  'use strict';

  describe('1 test create PATAG', function () {

    it('1.1 should create in correct format', function () {
      var tagValue = 'deadcowsJWT', patag, hostname = 'pn.acme.com';

      patag = PPNUtils.createPATAG(hostname, tagValue);
      patag.should.be.equal('https://pn.tag.webshield.io/patag/com/acme/pn#deadcowsJWT');
    });
  }); // describe 1

  describe('2 test create obfuscated typed value', function () {

    var patag = PPNUtils.createPATAG('pn.acme.com', 'test2');

    it('2.1 should create with an array ', function () {
      var props, pv;

      props = {};
      props.evalue = '23';
      props.patag = [patag];
      pv = PPNUtils.createObfuscatedValue(props);
      assert(pv, util.format('no privacy value returned for props:%j', props));

      pv.should.have.property('@value', props.evalue);
      pv.should.have.property('@type');
      assert((pv['@type'].length === 1), util.format('expected type length of 1 got:%s pv is:%j', pv['@type'].length, pv));
      pv['@type'][0].should.be.equal(patag);

    });

    it('2.2 create with patag and instance', function () {
      var props, pv;
      props = {};
      props.evalue = '56';
      props.patag = patag;
      pv = PPNUtils.createObfuscatedValue(props);
      assert(pv, util.format('no privacy value returned for props:%j', props));

      pv.should.have.property('@value', props.evalue);
      pv.should.have.property('@type', patag);
    });
  }); // describe 2

  describe('3 isObfuscated tests', function () {

    var patag = PPNUtils.createPATAG('pn.acme.com', 'test3');

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
  }); // describe 3

  describe('4 test Privacy Action', function () {

    var hostname = 'pn.acme.com';

    it('4.1 should create when all prop options are passed in - type and prop are values', function () {
      var paction, patag, id, props;

      id = PN.ids.createPrivacyActionId(hostname, '4_1_test');
      patag = PPNUtils.createPATAG(hostname, 'deadcows');

      props = {};
      props.id = id;
      props.patag = patag;
      props.action = PN_T.Obfuscate;

      props.privacy_schema = jsonldUtils.createBlankNode({ '@type': PN_T.SchemaItem });
      props.privacy_schema[PN_P.propType] = 'http://test.webshield.io/type#bogus';
      props.privacy_schema[PN_P.propName] = 'http://test.webshield.io/prop#bogus_prop';

      paction = PPNUtils.createPrivacyAction(props);

      paction.should.have.property('@id', id);
      assert(jsonldUtils.isType(paction, PN_T.PrivacyAction), util.format('%j should be a %s', paction, PN_T.PrivacyAction));
      paction.should.have.property(PN_P.patag, patag);
      paction.should.have.property(PN_P.action, PN_T.Obfuscate);
      paction.should.have.property(PN_P.privacySchema);
      paction[PN_P.privacySchema].length.should.be.equal(1);
      paction[PN_P.privacySchema].forEach(function (item) {
        assert(jsonldUtils.isType(item, PN_T.SchemaItem), util.format('item:%j is not type:%s', item, PN_T.SchemaItem));
        item.should.have.property(PN_P.propType, 'http://test.webshield.io/type#bogus');
        item.should.have.property(PN_P.propName, 'http://test.webshield.io/prop#bogus_prop');
      });
    }); // 4.1

    it('4.2 should create when all prop options are passed in - type and prop are arrays', function () {
      var paction, patag, id, props;

      id = PN.ids.createPrivacyActionId(hostname, '4_1_test');
      patag = PPNUtils.createPATAG(hostname, 'deadcows');

      props = {};
      props.id = id;
      props.patag = patag;

      props.action = PN_T.DeObfuscate;

      props.privacy_schema = jsonldUtils.createBlankNode({ '@type': PN_T.SchemaItem });
      props.privacy_schema[PN_P.propType] = ['http://test.webshield.io/type#bogus'];
      props.privacy_schema[PN_P.propName] = ['http://test.webshield.io/prop#bogus_prop'];

      paction = PPNUtils.createPrivacyAction(props);

      paction.should.have.property('@id', id);
      assert(jsonldUtils.isType(paction, PN_T.PrivacyAction), util.format('%j should be a %s', paction, PN_T.PrivacyAction));
      paction.should.have.property(PN_P.patag, patag);
      paction.should.have.property(PN_P.action, PN_T.DeObfuscate);
      paction.should.have.property(PN_P.privacySchema);
      paction[PN_P.privacySchema].length.should.be.equal(1);
      paction[PN_P.privacySchema].forEach(function (item) {
        assert(jsonldUtils.isType(item, PN_T.SchemaItem), util.format('item:%j is not type:%s', item, PN_T.SchemaItem));
        item.should.have.property(PN_P.propType);
        item[PN_P.propType].length.should.be.equal(1);
        item.should.have.property(PN_P.propName);
        item[PN_P.propName].length.should.be.equal(1);
      });
    }); // 4.2
  }); // describe 4

});
