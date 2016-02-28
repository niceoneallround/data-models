/*jslint node: true, vars: true */

var assert = require('assert'),
  contextUtils = require('../../lib/jsonld-contexts/utils'),
  jsonldUtils = require('jsonld-utils/lib/jldUtils'),
  PNDataModel = require('../../lib/PNDataModel'),
  PN_P = PNDataModel.PROPERTY,
  PN_T = PNDataModel.TYPE,
  should = require('should'),
  util = require('util');

describe('JSONLD Context utils tests', function () {
  'use strict';

  describe('1 Read context tests', function () {

    it('1.1 should read PNDataModel context', function () {

      var getContextPromise = contextUtils.promises.getContext(PNDataModel.ID);

      // return promise from catch as mocha will check if ok or error
      return getContextPromise.then(
        function (context) {
          assert(context, util.format('then - no context read for datamodel:%s - context:%j', PNDataModel.ID, context));
          context.should.have.property('@context');
        },

        function (err) {
          throw new Error(err);
        }
      );
    }); // 1.1
  }); // describe 1

  describe('2 Read context, and use in extracting information from a PnDataModel jsonld graph', function () {

    var testObject = {
        '@id': 'http://id.webshield.io/request/acme/com#21',
        '@type': [PN_T.CreateDataset] };
    testObject[PN_P.domain] = { '@id': 'http://id.pn.webshield.io/domain#1' };
    testObject[PN_P.dataModel] = { '@id': 'http://id.pn.webshield.io/datamodel#1' };

    it('2.1 should findObject in the PNDataModel object', function () {

      var getContextPromise = contextUtils.promises.getContext(PNDataModel.ID);

      //console.log('testObject:%j', testObject);

      // return promise from catch as mocha will check if ok or error
      return getContextPromise.then(
        function (context) {
          var findObjectPromise;
          assert(context, util.format('then - no context read for datamodel:%s - context:%j', PNDataModel.ID, context));

          findObjectPromise = jsonldUtils.promises.findObjects(
                                          testObject,
                                          PN_T.CreateDataset,
                                          new Map().set('@context', context));

          // return the promise from the then so mocha can check the results
          return findObjectPromise.then(
            function (result) {
              assert(result, 'did not find object?');
              result.should.have.property('@id', testObject['@id']);
            },

            function (err) {
              throw new Error(util.format('2.1 test failed in findObject: %j', err));
            }
          );
        },

        function (err) { // err on getContextPromise
          throw new Error(util.format('2.1 test failed in getContext: %j', err));
        }
      );
    }); // 2.1

    it('2.2 should NOT findObject in the PNDataModel object', function () {

      var getContextPromise = contextUtils.promises.getContext(PNDataModel.ID);

      //console.log('testObject:%j', testObject);

      // return promise from catch as mocha will check if ok or error
      return getContextPromise.then(
        function (context) {
          var findObjectPromise;
          assert(context, util.format('then - no context read for datamodel:%s - context:%j', PNDataModel.ID, context));

          findObjectPromise = jsonldUtils.promises.findObjects(
                                          testObject,
                                          'http://bogus',
                                          new Map().set('@context', context));

          // return the promise from the then so mocha can check the results
          return findObjectPromise.then(
            function (result) {
              assert(!result, 'should did not find object?');
            },

            function (err) {
              throw new Error(util.format('2.2 test failed in findObject: %j', err));
            }
          );
        },

        function (err) { // err on getContextPromise
          throw new Error(util.format('2.2 test failed in getContext: %j', err));
        }
      );
    }); // 2.3
  }); // describe 2
});
