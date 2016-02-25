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

      var getContextPromise = contextUtils.getContextPromise(PNDataModel.ID);

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

    it('2.1 should read PNDataModel context', function () {

      var getContextPromise = contextUtils.getContextPromise(PNDataModel.ID),
          testObject;

      testObject = {
        '@id': 'http://id.webshield.io/request/acme/com#1',
        '@type': [PN_T.CreateCollection] };
      testObject[PN_P.domain] = { '@id': 'http://id.pn.webshield.io/domain#1' };
      testObject[PN_P.dataModel] = { '@id': 'http://id.pn.webshield.io/datamodel#1' };

      console.log('testObject:%j', testObject);

      // return promise from catch as mocha will check if ok or error
      return getContextPromise.then(
        function (context) {
          var findObjectPromise;
          assert(context, util.format('then - no context read for datamodel:%s - context:%j', PNDataModel.ID, context));

          findObjectPromise = jsonldUtils.findObjectsPromise(
                                          testObject,
                                          PN_T.CreateCollection,
                                          new Map().set('@context', context));

          findObjectPromise.then(
            function (result) {
              console.log('result:%j', result);
            },

            function (reason) {
              console.log('reason:%j', reason);
            }
          );
        },

        function (err) {
          throw new Error(err);
        }
      );
    }); // 1.1
  }); // describe 1
});
