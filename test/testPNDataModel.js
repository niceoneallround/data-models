/*jslint node: true, vars: true */

var should = require('should'),
  assert = require('assert'),
  PNDataModel = require('../lib/PNDataModel'),
  PN_P = PNDataModel.PROPERTY,
  PN_T = PNDataModel.TYPE;

describe('PNDataModel tests', function () {
  'use strict';

  describe('1 test findObjects specialized to PNDataModel works', function () {

    var testObject, data = [];

    testObject = {};
    testObject['@id'] = 'http://id.webshield.io/test#1';
    testObject['@type'] = PN_T.CreateDataset;
    testObject[PN_P.domain] = 'http://id.webshield.io/domain/io/webshield#1';
    data.push(testObject);

    testObject = {};
    testObject['@id'] = 'http://id.webshield.io/test#2';
    testObject['@type'] = PN_T.Assertion;
    testObject[PN_P.domain] = 'http://id.webshield.io/assertion/io/webshield#2';
    data.push(testObject);

    it('1.1 test find the object', function () {

      var findObjectPromise = PNDataModel.promises.findObjects(data, PN_T.CreateDataset);

      // let mocha deal with all unexpected errors
      return findObjectPromise.then(
        function (result) {
          assert(result, '1.1 no result returned?');
          result.should.have.property('@id', data[0]['@id']);
        });
    }); // 1.1

    it('1.2 test find the object', function () {

      var findObjectPromise = PNDataModel.promises.findObjects(data, PN_T.Assertion);

      // let mocha deal with all unexpected errors
      return findObjectPromise.then(
        function (result) {
          assert(result, '1.2 no result returned?');
          result.should.have.property('@id', data[1]['@id']);
        });
    }); // 1.2

    it('1.3 test do not find the object', function () {

      var findObjectPromise = PNDataModel.promises.findObjects(data, 'http://bogus');

      // let mocha deal with all unexpected errors
      return findObjectPromise.then(
        function (result) {
          assert(!result, '1.3 no result returned?');
        });
    }); // 1.3

  }); // describe 1

  describe('2 test id creation', function () {

    it('2.1 test create dataset id', function () {

      var dataModelId = 'https://testpn.schema.webshield.io',
          datasetId;

      datasetId = PNDataModel.ids.createDatasetId(dataModelId);

      assert(datasetId, 'no datasetId returned');

      datasetId.should.be.equal('https://pn.id.webshield.io/datasets/io/webshield/schema/testpn');

    }); // 2.1

  }); // describe 1
});
