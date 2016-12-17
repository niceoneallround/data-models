/*jslint node: true, vars: true */

const BaseSubjectPNDataModel = require('../lib/BaseSubjectPNDataModel');
const BASE_P = BaseSubjectPNDataModel.PROPERTY;
const JSONLDUtils = require('jsonld-utils/lib/jldUtils');
const should = require('should');

describe('1. BaseSubjectPNDataModel - validate JSONLD context', function () {
  'use strict';

  it('1.1 expand full object', function () {
    const bob = {
      id: 'https://id.webshield.io/com/acme/1718181',
      type: 'Subject',
      givenName: 'bob',
      familyName: 'smith',
      taxID: 'tax_id',
      sourceID: 1718181,
      address: {
        id: 'https://id.webshield.io/com/acme/address/addr_1',
        type: 'PostalAddress',
        postalCode: '94107'
      },
    };

    //console.log(BaseSubjectPNDataModel.model.JSONLD_CONTEXT);
    let optionsMap = new Map();
    optionsMap.set('@context', BaseSubjectPNDataModel.model.JSONLD_CONTEXT);
    return JSONLDUtils.promises.expandCompact(bob, optionsMap)
      .then(function (result) {
        //console.log('***EXPANDED/Compact:%s', JSON.stringify(result, null, 2));

        //  check ASSUMPTIONS used by code
        result.should.have.property('@id');
        result.should.have.property('@type');
        result.should.have.property('https://schema.org/taxID');
        result.should.have.property('http://pn.schema.webshield.io/prop#sourceID');
      });
  });
});

describe('2. BaseSubjectPNDataModel - test Canons', function () {
  'use strict';

  it('2.1 create canons', function () {

    let props = { domainName: 'abc.com' };
    let alice = BaseSubjectPNDataModel.canons.createAlice(props);
    alice.should.have.property('@id',  BaseSubjectPNDataModel.canons.data.alice.id);
    alice.should.have.property('@type', BaseSubjectPNDataModel.TYPE.Subject);
    alice.should.have.property(BASE_P.address);
    alice[BASE_P.address].should.have.property('@id');

    let bob = BaseSubjectPNDataModel.canons.createBob(props);
    bob.should.have.property('@id',  BaseSubjectPNDataModel.canons.data.bob.id);
  });
});
