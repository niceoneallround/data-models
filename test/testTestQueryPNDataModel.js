/*jslint node: true, vars: true */

const TestQueryPNDataModel = require('../lib/TestQueryPNDataModel');
const JSONLDUtils = require('jsonld-utils/lib/jldUtils');
const should = require('should');

describe('1. TestQueryPNDataModel - validate JSONLD context', function () {
  'use strict';

  it('1.1 should expand properties that can be used for params or queries', function () {
    const bob = {
      id: 'https://id.webshield.io/com/acme/1718181',
      type: 'SubjectQueryRestriction',
      givenName: 'bob',
      familyName: 'smith',
      taxID: 'tax_id',
      sourceID: 1718181,
      subjectID: 'https://id.fake',
      address: {
        id: 'https://id.webshield.io/com/acme/address/addr_1',
        type: 'PostalAddress',
        postalCode: '94107'
      },
    };

    //console.log(TestQueryPNDataModel.model.JSONLD_CONTEXT);
    let optionsMap = new Map();
    optionsMap.set('@context', TestQueryPNDataModel.model.JSONLD_CONTEXT);
    return JSONLDUtils.promises.expandCompact(bob, optionsMap)
      .then(function (result) {
        //console.log('***EXPANDED/Compact:%s', JSON.stringify(result, null, 2));

        //  check ASSUMPTIONS used by code
        result.should.have.property('@id');
        result.should.have.property('@type');
        result.should.have.property('https://schema.org/taxID');
        result.should.have.property('http://pn.schema.webshield.io/prop#sourceID');
        result.should.have.property('https://pn.schema.webshield.io/prop#subjectID');
      });
  });
});
