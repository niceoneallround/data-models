/*jslint node: true, vars: true */

var assert = require('assert'),
  contextUtils = require('../../lib/jsonld-contexts/utils'),
  PNDataModel = require('../../lib/PNDataModel'),
  should = require('should'),
  util = require('util');

describe('JSONLD Context utils tests', function () {
  'use strict';

  describe('1 Read context tests', function () {
    it('1.1 should read PNDataModel context', function (done) {
      contextUtils.getContext(PNDataModel.ID, function (err, context) {
        assert(!err, util.format('Error:%j reading context', err));
        assert(context, util.format('no context read for datamodel:%s', PNDataModel.ID));
        context.should.have.property('@context');
        done();
      });
    }); // 1.1
  }); // describe 1
});
