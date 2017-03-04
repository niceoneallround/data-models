/*jslint node: true, vars: true */

const should = require('should');
const assert = require('assert');
const jsonldUtils = require('jsonld-utils/lib/jldUtils');
const PNDataModel = require('../lib/PNDataModel');
const PN_P = PNDataModel.PROPERTY;
const PN_T = PNDataModel.TYPE;
const util = require('util');

describe('PNDataModel tests', function () {
  'use strict';

  describe('1 test findObjects specialized to PNDataModel works', function () {

    let data = [];

    let testObject = {};
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

      let findObjectPromise = PNDataModel.promises.findObjects(data, PN_T.CreateDataset);

      // let mocha deal with all unexpected errors
      return findObjectPromise.then(
        function (result) {
          assert(result, '1.1 no result returned?');
          result.should.have.property('@id', data[0]['@id']);
        });
    }); // 1.1

    it('1.2 test find the object', function () {

      let findObjectPromise = PNDataModel.promises.findObjects(data, PN_T.Assertion);

      // let mocha deal with all unexpected errors
      return findObjectPromise.then(
        function (result) {
          assert(result, '1.2 no result returned?');
          result.should.have.property('@id', data[1]['@id']);
        });
    }); // 1.2

    it('1.3 test do not find the object', function () {

      let findObjectPromise = PNDataModel.promises.findObjects(data, 'http://bogus');

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

    it('2.2 test create request id', function () {
      var hostname = 'pn.acme.com',
          id = 22, rqId;

      rqId = PNDataModel.ids.createRequestId(hostname, id);
      assert(rqId, 'no rqId returned');
      rqId.should.be.equal('https://pn.id.webshield.io/requests/com/acme/pn#22');
    }); // 2.2

    it('2.3 test create provision id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 23, pvId;

      pvId = PNDataModel.ids.createProvisionId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://pn.id.webshield.io/provisions/io/webshield/svr/ps#23');
    }); // 2.3

    it('2.4 test create privacy pipe id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 24, pvId;

      pvId = PNDataModel.ids.createPrivacyPipeId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/privacy_pipe/io/webshield/svr/ps#24');
    }); // 2.4

    it('2.5 test create datamodel id', function () {
      var hostname = 'aetna.com', id;

      id = PNDataModel.ids.createDataModelId(hostname);
      assert(id, 'no id returned');
      id.should.be.equal('https://aetna.com.schema.webshield.io');
    }); // 2.5

    it('2.6 test create query result id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 24, pvId;

      pvId = PNDataModel.ids.createQueryResultId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://pn.id.webshield.io/query_result/io/webshield/svr/ps#24');
    }); // 2.6

    it('2.7 test create privacy step id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 24, pvId;

      pvId = PNDataModel.ids.createPrivacyStepId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/privacy_step/io/webshield/svr/ps#24');
    }); // 2.7

    it('2.7.a test create privacy step id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 24, pvId;

      pvId = PNDataModel.ids.createPrivacyStepInstanceId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/pstep_instance/io/webshield/svr/ps#24');
    }); // 2.7.a

    it('2.8 test create privacy action id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 24, pvId;

      pvId = PNDataModel.ids.createPrivacyActionId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/privacy_action/io/webshield/svr/ps#24');
    }); // 2.8

    it('2.8.a test create privacy action instance id', function () {
      const hostname = 'ps.svr.webshield.io';
      const id = 24;

      let pvId = PNDataModel.ids.createPrivacyActionInstanceId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/paction_instance/io/webshield/svr/ps#24');
    }); // 2.8.a

    it('2.9 test create privacy algorithm id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 29, pvId;

      pvId = PNDataModel.ids.createPrivacyAlgorithmId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/privacy_algorithm/io/webshield/svr/ps#29');
    }); // 2.9

    it('2.9.a test create privacy algorithm instance id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 29, pvId;

      pvId = PNDataModel.ids.createPrivacyAlgorithmInstanceId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/palgorithm_instance/io/webshield/svr/ps#29');
    }); // 2.9.a

    it('2.10 test create error id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 29, errId;

      errId = PNDataModel.ids.createErrorId(hostname, id);
      assert(errId, 'no errId returned');
      errId.should.be.equal('https://pn.id.webshield.io/error/io/webshield/svr/ps#29');
    }); // 2.10

    it('2.11 test create identity_syndication_algorithm id', function () {
      var hostname = 'ps.svr.webshield.io',
          v = 211, id;

      id = PNDataModel.ids.createIdentitySyndicationAlgorithmId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/identity_syndication_algorithm/io/webshield/svr/ps#211');
    }); // 2.11

    it('2.12 test create identity_syndication_job id', function () {
      var hostname = 'ps.svr.webshield.io',
          v = 212, id;

      id = PNDataModel.ids.createIdentitySyndicationJobId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/identity_syndication_job/io/webshield/svr/ps#212');
    }); // 2.12

    it('2.13 test create reference source id', function () {
      var hostname = 'ps.svr.webshield.io',
          v = 212, id;

      id = PNDataModel.ids.createReferenceSourceId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/reference_source/io/webshield/svr/ps#212');
    }); // 2.13

    it('2.14 test create message id', function () {
      var hostname = 'ps.svr.webshield.io',
          v = 212, id;

      id = PNDataModel.ids.createMessageId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://pn.id.webshield.io/message/io/webshield/svr/ps#212');
    }); // 2.14

    it('2.15 test create message id', function () {
      var hostname = 'ps.svr.webshield.io',
          v = 212, id;

      id = PNDataModel.ids.createPrivacyContextId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://pn.id.webshield.io/privacy_context/io/webshield/svr/ps#212');
    }); // 2.15

    it('2.16 test create user data id', function () {
      var hostname = 'acme.com',
          v = 212, id;

      id = PNDataModel.ids.createUserDataId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://id.webshield.io/com/acme#212');
    }); // 2.16

    it('2.17 test create resource id', function () {
      var hostname = 'acme.com',
          v = 212, id;

      id = PNDataModel.ids.createResourceId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/resource/com/acme#212');
    }); // 2.17

    it('2.18 test create syndication request id', function () {
      var hostname = 'acme.com',
          v = 212, id;

      id = PNDataModel.ids.createSyndicationRequestId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://pn.id.webshield.io/syndication_request/com/acme#212');
    }); // 2.18

    it('2.18b test create syndicatated entity id', function () {
      var hostname = 'acme.com',
          v = 212, id;

      id = PNDataModel.ids.createSyndicatedEntityId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://pn.id.webshield.io/syndicated_entity/com/acme#212');
    }); // 2.18b

    it('2.19 test create kms id', function () {
      const hostname = 'acme.com';
      const v = 212;

      let id = PNDataModel.ids.createKMSId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/kms/com/acme#212');
    }); // 2.19

    it('2.20 test create encrypt key metadata id', function () {
      const hostname = 'acme.com';
      const v = 212;

      let id = PNDataModel.ids.createEncryptKeyMetadataId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/encrypt_key_md/com/acme#212');
    }); // 2.20

    it('2.21 test create PN Data Model id', function () {
      const hostname = 'acme.com';
      const v = 212;

      let id = PNDataModel.ids.createPNDataModelId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/pndatamodel/com/acme#212');
    }); // 2.21

    it('2.22 test create Organization id', function () {
      const hostname = 'acme.com';
      const v = 212;

      let id = PNDataModel.ids.createOrganizationId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/organization/com/acme#212');
    }); // 2.22

    it('2.23 test create Ingest Privacy Agent Id', function () {
      const hostname = 'acme.com';
      const v = 212;

      let id = PNDataModel.ids.createIngestPrivacyAgentId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/ingest_privacy_agent/com/acme#212');
    }); // 2.23

    it('2.24 test create basic data @id, should have no pn.id prefix', function () {
      const hostname = 'acme.com';
      const v = 212;
      const type = 'address';

      let id = PNDataModel.ids.createExternalId(hostname, v, type);
      assert(id, 'no id returned');
      id.should.be.equal('https://id.webshield.io/com/acme/address#212');
    }); // 2.24

    it('2.25 test create Obfuscation Service Id', function () {
      const hostname = 'acme.com';
      const v = 212;

      let id = PNDataModel.ids.createObfuscationServiceId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://md.pn.id.webshield.io/obfuscation_service/com/acme#212');
    }); // 2.25

    it('2.26 test if pass in a url the leaves as a url', function () {
      const hostname = 'acme.com';
      const v = 'https://abc.com';

      let id = PNDataModel.ids.createObfuscationServiceId(hostname, v);
      assert(id, 'no id returned');
      id.should.be.equal('https://abc.com');
    }); // 2.25

    it('2.27 test create query id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 27, pvId;

      pvId = PNDataModel.ids.createQueryId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://pn.id.webshield.io/query/io/webshield/svr/ps#27');
    }); // 2.27

    it('2.28 test subject link id', function () {
      var hostname = 'ps.svr.webshield.io',
          id = 27, pvId;

      pvId = PNDataModel.ids.createSubjectLinkId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://pn.id.webshield.io/subject_link/io/webshield/svr/ps#27');
    }); // 2.28

    it('2.29 test query restriction id', function () {
      const hostname = 'ps.svr.webshield.io';
      const id = 27;

      let pvId = PNDataModel.ids.createQueryRestrictionId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://pn.id.webshield.io/query_restriction/io/webshield/svr/ps#27');
    }); // 2.29

    it('2.30 test query privacy agent id', function () {
      const hostname = 'ps.svr.webshield.io';
      const id = 27;

      let pvId = PNDataModel.ids.createQueryPrivacyAgentId(hostname, id);
      assert(pvId, 'no pvId returned');
      pvId.should.be.equal('https://md.pn.id.webshield.io/query_privacy_agent/io/webshield/svr/ps#27');
    }); // 2.30

  }); // describe 2

  describe('3 test tag utils', function () {

    it('3.1 test create tag', function () {
      var hostname = 'ps.svr.webshield.io', tagType = 'test_tag',
          id = 24, tag;

      tag = PNDataModel.tags.createTag(tagType, hostname, id);
      assert(tag, 'no tag returned');
      tag.should.be.equal('https://pn.tag.webshield.io/test_tag/io/webshield/svr/ps#24');
    }); // 3.1
  }); // describe 3

  describe('4 test canme and url utils', function () {

    it('4.1 test create cname typed value', function () {
      var hostname = 'ps.svr.webshield.io', tv;

      tv = PNDataModel.utils.createCNameValue(hostname);
      assert(tv, 'no typed value returned');
      tv.should.have.property('@type', PN_T.X509CN);
      tv.should.have.property('@value', hostname);
    }); // 4.1

    it('4.2 test create url typed value', function () {
      var url = 'https://ps.svr.webshield.io/mock', tv;

      tv = PNDataModel.utils.createURLValue(url);
      assert(tv, 'no typed value returned');
      tv.should.have.property('@type', PN_T.URL);
      tv.should.have.property('@value', url);
    }); // 4.2
  }); // 4

  describe('5 test error utils', function () {

    it('5.1 test create error', function () {
      var hostname = 'ps.svr.webshield.io', props = {}, error;

      props.id = PNDataModel.ids.createErrorId(hostname, 'test51');
      props.httpStatus = '200';
      props.error = jsonldUtils.createV({ type: PN_T.TypeError, value: 'property had incorrect value' });

      error = PNDataModel.errors.createError(props);
      assert(error, 'no error returned');
      error.should.have.property('@id');
      error.should.have.property('@type');
      assert(jsonldUtils.isType(error, PN_T.Error), util.format('%j is not of type:%s', error, PN_T.Error));
      error.should.have.property(PN_P.httpStatus, '200');
      error.should.have.property(PN_P.error);

      assert(PNDataModel.errors.isError(error), util.format('isError returned false for:%j', error));
    }); // 5.1

    it('5.2 test create type error', function () {
      var hostname = 'ps.svr.webshield.io', props = {}, error;

      props.id = PNDataModel.ids.createErrorId(hostname, 'test52');
      props.errMsg = 'hello';

      error = PNDataModel.errors.createTypeError(props);
      assert(error, 'no error returned');
      error.should.have.property('@id');
      error.should.have.property('@type');
      assert(jsonldUtils.isType(error, PN_T.Error), util.format('%j is not of type:%s', error, PN_T.Error));
      error.should.have.property(PN_P.httpStatus, '400');
      error.should.have.property(PN_P.error);

      assert(PNDataModel.errors.isError(error), util.format('isError returned false for:%j', error));
    }); // 5.2

    it('5.3 test create not found error', function () {
      var hostname = 'ps.svr.webshield.io', props = {}, error;

      props.id = PNDataModel.ids.createErrorId(hostname, 'test53');
      props.errMsg = 'hello';

      error = PNDataModel.errors.createNotFoundError(props);
      assert(error, 'no error returned');
      error.should.have.property('@id');
      error.should.have.property('@type');
      assert(jsonldUtils.isType(error, PN_T.Error), util.format('%j is not of type:%s', error, PN_T.Error));
      error.should.have.property(PN_P.httpStatus, '404');
      error.should.have.property(PN_P.error);

      assert(PNDataModel.errors.isError(error), util.format('isError returned false for:%j', error));
    }); // 5.3

    it('5.4 test create invalid jwt', function () {
      var hostname = 'ps.svr.webshield.io', props = {}, error;

      props.id = PNDataModel.ids.createErrorId(hostname, 'test54');
      props.jwtError = { error: 'jwtMalformed' };
      props.type = 'a-type';

      error = PNDataModel.errors.createInvalidJWTError(props);
      assert(error, 'no error returned');
      error.should.have.property('@id');
      error.should.have.property('@type');
      assert(jsonldUtils.isType(error, PN_T.Error), util.format('%j is not of type:%s', error, PN_T.Error));
      error.should.have.property(PN_P.httpStatus, '400');
      error.should.have.property(PN_P.error);

      assert(PNDataModel.errors.isError(error), util.format('isError returned false for:%j', error));
    }); // 5.4

    it('5.5 test create forbidden error', function () {
      var hostname = 'ps.svr.webshield.io', props = {}, error;

      props.id = PNDataModel.ids.createErrorId(hostname, 'test53');
      props.errMsg = 'hello';

      error = PNDataModel.errors.createForbiddenError(props);
      assert(error, 'no error returned');
      error.should.have.property('@id');
      error.should.have.property('@type');
      assert(jsonldUtils.isType(error, PN_T.Error), util.format('%j is not of type:%s', error, PN_T.Error));
      error.should.have.property(PN_P.httpStatus, '403');
      error.should.have.property(PN_P.error);

      assert(PNDataModel.errors.isError(error), util.format('isError returned false for:%j', error));
    }); // 5.5

    it('5.6 test create UNAUTHORIZED error', function () {
      var hostname = 'ps.svr.webshield.io', props = {}, error;

      props.id = PNDataModel.ids.createErrorId(hostname, 'test53');
      props.errMsg = 'hello';

      error = PNDataModel.errors.createUnauthorizedError(props);
      assert(error, 'no error returned');
      error.should.have.property('@id');
      error.should.have.property('@type');
      assert(jsonldUtils.isType(error, PN_T.Error), util.format('%j is not of type:%s', error, PN_T.Error));
      error.should.have.property(PN_P.httpStatus, '401');
      error.should.have.property(PN_P.error);

      assert(PNDataModel.errors.isError(error), util.format('isError returned false for:%j', error));
    }); // 5.6
  }); // describe 5

  describe('6 Test Id to Param utils and the reverse', function () {

    it('6.1 test createMdParamFromMdId simple', function () {
      var id = 'https://md.pn.id.webshield.io/privacy_algorithm/com/acme#value';
      PNDataModel.ids.paramUtils.createMdParamFromMdId(id).should.be.equal('privacy_algorithm___com___acme--value');
    }); //it 6.2

    it('6.2 test createMdParamFromMdId value has dashes', function () {
      var id = 'https://md.pn.id.webshield.io/privacy_algorithm/com/acme#value-1';
      PNDataModel.ids.paramUtils.createMdParamFromMdId(id).should.be.equal('privacy_algorithm___com___acme--value-1');
    }); //it 6.2

    it('6.3 createParamFromDomain test value has dahes', function () {
      var id = 'md.pn.id.webshield.io';
      PNDataModel.ids.paramUtils.createParamFromDomain(id).should.be.equal('md-pn-id-webshield-io');
    }); //it 6.3

    it('6.4 createMdIdFromParam should produce an id from a param id', function () {
      var param = 'privacy_algorithm___com___acme--value-1';
      PNDataModel.ids.paramUtils.createMdIdFromParam(param).should.be.equal('https://md.pn.id.webshield.io/privacy_algorithm/com/acme#value-1');
    }); //it 6.4

    it('6.5 test create param and then reverse are the same', function () {
      var id = 'https://md.pn.id.webshield.io/privacy_algorithm/com/acme#value-1',
          paramId = PNDataModel.ids.paramUtils.createMdParamFromMdId(id);
      paramId.should.be.equal('privacy_algorithm___com___acme--value-1');
      PNDataModel.ids.paramUtils.createMdIdFromParam(paramId).should.be.equal(id);
    }); //it 6.5

    it('6.6 test createParam value from bug with sv-1 being turned into sv/1', function () {
      var param = 'privacy_pipe___io___webshield___aetnacon___sv-1--aetna-outbound-pipe2is-1468188067-1',
      id = 'https://md.pn.id.webshield.io/privacy_pipe/io/webshield/aetnacon/sv-1#aetna-outbound-pipe2is-1468188067-1';

      PNDataModel.ids.paramUtils.createMdParamFromMdId(id).should.be.equal(param);

    }); //it 6.6

    it('6.7 test createParam value from bug with sv-1 being turned into sv/1', function () {
      var param = 'privacy_pipe___io___webshield___aetnacon___sv-1--aetna-outbound-pipe2is-1468188067-1';

      PNDataModel.ids.paramUtils.createMdIdFromParam(param).should.be.equal(
        'https://md.pn.id.webshield.io/privacy_pipe/io/webshield/aetnacon/sv-1#aetna-outbound-pipe2is-1468188067-1');

      PNDataModel.ids.paramUtils.createMdIdFromParam(param).should.not.be.equal(
          'https://md.pn.id.webshield.io/privacy_pipe/io/webshield/aetnacon/sv/1#aetna-outbound-pipe2is-1468188067-1');
    }); //it 6.7

    it('6.8 test MdParam from MdId - was having a bug#1', function () {
      let id = 'https://md.pn.id.webshield.io/privacy_algorithm/com/aetna#connector-pa-id-aetna-e2etest';

      PNDataModel.ids.paramUtils.createMdParamFromMdId(id).should.be.equal(
        'privacy_algorithm___com___aetna--connector-pa-id-aetna-e2etest'
      );
    }); //it 6.8

    it('6.9 test MdParam from MdId - was having a bug#2 - missing the s from http', function () {
      let id = 'https://md.pn.id.webshield.io/anything/foo/bar#1';

      PNDataModel.ids.paramUtils.createMdParamFromMdId(id).should.be.equal('anything___foo___bar--1');
    }); //it 6.9

    describe('7 Test Domain Helpers', function () {

      it('7.1 should create a valid domainRequest', function () {
        var domainReq, props = {};

        props.name = 'fake.domain';
        props.datamodel = 'http://fake-datamodel';
        domainReq = PNDataModel.model.utils.createDomainRequest(props);

      }); //it 7.1
    });

    describe('8 test syndication job utils', function () {

      it('8.1 should return job is finished if status !== 202', function () {
        var job = { status: 200 };
        assert(PNDataModel.model.utils.isSyndicationJobFinished(job), 'job should be finished');
      }); // 8.1

      it('8.2 should return job is NOT finished if status === 202 ', function () {
        var job = { status: 202 };
        assert(!PNDataModel.model.utils.isSyndicationJobFinished(job), 'job should not be finished');
      }); // 8.2

      it('8.2 should return job is finished if status === 400 ', function () {
        var job = { status: 400 };
        assert(PNDataModel.model.utils.isSyndicationJobFinished(job), 'job should be finished');
      }); // 8.2

    }); // 8

  }); // describe 1
});
