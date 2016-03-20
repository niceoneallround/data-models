/*jslint node: true, vars: true */

var should = require('should'),
  PNDataModel = require('../lib/PNDataModel'),
  PN_P = PNDataModel.PROPERTY,
  PN_T = PNDataModel.TYPE,
  PNMetaModelFactory = require('../lib/PNMetaModelFactory');

describe('test PNMetaModelFactory', function () {
  'use strict';

  describe('1 test create', function () {

    it('1.1 should create metaModel passing an id', function () {
      var mm = PNMetaModelFactory.create('1.1');
      mm.getDataModelId().should.be.equal('1.1');
    });

    it('1.2 should support type', function () {
      var mm = PNMetaModelFactory.create('1.2'), td;

      mm.addTypeDescriptor(PN_T.TRUST_MODEL);
      td = mm.getMd(PN_T.TRUST_MODEL);
      td.isType().should.be.equal(true);
      td.isValueProperty().should.be.equal(false);
      td.isObjectProperty().should.be.equal(false);
    });

    it('1.3 should support value property', function () {
      var mm = PNMetaModelFactory.create('1.3'), pvd;

      mm.addValuePropertyDescriptor(PN_P.next);
      pvd = mm.getMd(PN_P.next);
      pvd.isType().should.be.equal(false);
      pvd.isValueProperty().should.be.equal(true);
      pvd.isObjectProperty().should.be.equal(false);
    });

    it('1.4 should support object property', function () {
      var mm = PNMetaModelFactory.create('1.4'), pod;

      mm.addObjectPropertyDescriptor(PN_P.dataModel);
      pod = mm.getMd(PN_P.dataModel);
      pod.isType().should.be.equal(false);
      pod.isValueProperty().should.be.equal(false);
      pod.isObjectProperty().should.be.equal(true);
    });
  }); // describe 1
});
