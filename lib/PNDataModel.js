/*jslint node: true, vars: true */
'use strict';

var assert = require('assert'),
    contextUtils = require('./jsonld-contexts/utils'),
    jsonldUtils = require('jsonld-utils/lib/jldUtils'),
    URL = require('url'),
    util = require('util');

//
//  This file contains the PN Public API datamodel JSON-LD types and properties
//

var PROPERTY, TYPE, URLS, ID, model;

// the model ID - FIXME need to change to 'https://pn.schema.webshield.io'
ID = 'http://api.webshield.io';

// Register the JSONLD context with the context utils
contextUtils.register(ID, 'PNDataModel');

URLS = {
  P:    ID + '/prop#',
  T:    ID + '/type#'
};

//
// The following are taken from the IM directory in the product - see the API document and connector README.md for ones
// that are still used.
//
PROPERTY = {
  accessPolicy:             URLS.P + 'access_policy', // used in dataset, holds trust criteria
  assertions:               URLS.P + 'assertions', // public API
  auditLogRef:              URLS.P + 'audit_log_ref', // reference to an audit log
  auditRecord:              URLS.P + 'audit_record', // a object or array of audit records
  context:                  URLS.P + 'context', // a general property that can be used to pass context around - connectors
  chainId:                  URLS.P + 'chain_id',  // public API
  creator:                  URLS.P + 'creator',  // public API
  creationTime:             URLS.P + 'creation_time',  // public API
  consumerClassConstraints: URLS.P + 'consumer_class_constraints', // used in trust criteria to control data consumers
  dataIds:                  URLS.P + 'data_ids', // points to data containers in the service message
  dataModel:                URLS.P + 'data_model', // data model either and @id or the whole object
  datasetRef:               URLS.P + 'dataset_ref', // reference to a dataset, contains simid and datasetid
  datasetId:                URLS.P + 'dataset_id',
  datasets:                 URLS.P + 'datasets', // public API
  datasetData:              URLS.P + 'dataset_data', // contains dataset_data
  dataConsumer:             URLS.P + 'data_consumer', // identity of a data consumer
  dataOwner:                URLS.P + 'data_owner', // identity of a data owner
  description:              URLS.P + 'description',  // public API
  destination:              URLS.P + 'destination', // used in privacy pipe policy and pnRequest
  directoryAuthority:       URLS.P + 'directory_authority', // public API of the form http://domain:port
  domain:                   URLS.P + 'domain', // domain either the @id or an object
  entityType:               URLS.P + 'entity_type', // public API
  entityRef:                URLS.P + 'entity_ref', // contains a datasetRef and atleast and @id that is the internal id
  eventId:                  URLS.P + 'event_id', // used to record an eventId for example in Audit
  eventIdText:              URLS.P + 'event_id_text', // text version of the event id
  defaults:                 URLS.P + 'defaults', // generic defaults
  dobPolicies:              URLS.P + 'dob_policies', // an array of deObfuscation policies
  domainData:               URLS.P + 'domain_data', // public API
  error:                    URLS.P + 'error', // property holds errors
  errorCode:                URLS.P + 'error_code',  // public API
  errorMessage:             URLS.P + 'error_message', // public API
  fetchResponseURL:         URLS.P + 'fetch_response_url', // public API
  graph:                    '@graph',
  basePath:                 'base_path',
  homeURL:                  URLS.P + 'homeURL', // used in policies when describig external connectors
  hostType:                 URLS.P + 'host_type', // public API part of service policy allows tagging of what service want in path
  httpStatus:               URLS.P + 'http_status', // public API
  id:                       '@id', // public API
  identity:                 URLS.P + 'identity', // used to hold the cname of external systems
  issuer:                   URLS.P + 'issuer',  // public API
  issueTime:                URLS.P + 'issue_time', // public API
  items:                    URLS.P + 'items', // generic uses to represent a set of items
  lastUpdatedTime:          URLS.P + 'last_updated_time', // public API
  md:                       URLS.P + 'md', // property holds metadata about an object
  name:                     URLS.P + 'name', // public API
  next:                     URLS.P + 'next', // used in provisioning pipes  -- FUTURE WHEN ADD PIPE
  obfuscationCriteria:      URLS.P + 'obfuscation_criteria',
  obfuscationService:       URLS.P + 'obfuscation_service', // public API used in provisioning of pipes
  obPolicies:               URLS.P + 'ob_policies', // public API an array of obfuscation policies
  oValue:                   URLS.P + 'o_value', // obfuscated value in a privacy graph value
  payload:                  'payload',
  pipeId:                   URLS.P + 'pipe_id',
  port:                     'port',
  policies:                 URLS.P + 'policies', // public API
  previous:                 URLS.P + 'previous', // used in provisioning pipes -- FUTURE WHEN ADD PIPE
  privacyAlgorithms:        URLS.P + 'privacy_algorithms', // public API - an array of privacy pipe polices
  privacyAlgorithmId:       URLS.P + 'privacy_algorithm_id', // public API - privacy pipe id
  privacyAlgorithmIds:      URLS.P + 'privacy_algorithm_ids', // public API - an array of privacy pipe ids
  privacyNodes:             URLS.P + 'privacy_nodes', // privacy nodes within the privacy pipe
  privacyPipePolicyId:      URLS.P + 'privacyPipePolicyId', // a generic privacy pipe policy id
  privacyPipePolicies:      URLS.P + 'privacy_pipe_policy', // public API used in privacy policy
  privacySchema:            URLS.P + 'privacy_schema', // public API used in privacy policy describes <type, property> relationship with truct and obfuscation criteria
  propNameDescs:            URLS.P + 'prop_name_descs', // an array of prop name descriptors as a {@type='', @value=typename}, obfuscation.
  propId:                   URLS.P + 'prop_id', // the URL of a property
  protocol:                 'protocol',
  projection:               URLS.P + 'projection', // public API
  properties:               URLS.P + 'properties', // public API - an object
  queryRestriction:         URLS.P + 'query_restriction', // node holds query restrictions used across types of queries
  referenceSource:          URLS.P + 'reference_source', // points to either an array or a single reference source policy
  result:                   URLS.P + 'result', // generic holder for results depending on object will be different.
  respondingTo:             URLS.P + 'responding_to', // public API contains the id of the service request that generated this object
  respondingToPolicy:       URLS.P + 'responding_to_policy', // public API contains the id of the policy that generated this assertion.
  repoInfo:                 URLS.P + 'repoInfo', // an object that holds repo specific info such as the mongo db id.
  rspPathPolicy:            URLS.P + 'rsp_path_policy', // public API
  serviceName:              URLS.P + 'service_name',
  serviceRequirements:      URLS.P + 'service_requirements',
  servicePathPolicy:        URLS.P + 'service_path_policy', // public API
  serviceRequest:           URLS.P + 'service_request', // public API
  schema:                   URLS.P + 'schema', // used in metadata
  simId:                    URLS.P + 'sim_id', // public API
  sims:                     URLS.P + 'sims', // public API
  source:                   URLS.P + 'source', // public API source of a privacy pipe
  sourceId:                 URLS.P + 'source_id', // provides a unique id for a source of something, used in upload
  statusCode:               URLS.P + 'status_code',
  subjectDatasetIds:        URLS.P + 'subject_dataset_ids', // public API
  syndicationSubject:       URLS.P + 'syndication_subject',  // public API
  syndicationProperties:    URLS.P + 'syndication_properties', // public API
  signature:                'signature',
  svcRequestId:             URLS.P + 'svc_request_id', // log and audit files want to record this so can link as necessary
  topology:                 URLS.P + 'topology', // may be an @id or object
  topologyId:               URLS.P + 'topology_id', // topology to use to load/query data - FIXME REPLACED WITH TOPOLOGY
  trustCriteria:            URLS.P + 'trust_criteria', // public API used within a prvacy policy
  type:                     '@type', // public API
  typeId:                   URLS.P  + 'type_id', // a type id URL
  typeDesc:                 URLS.P + 'type_desc', // used to describe a type as a {@type='', @value=typename}, obfuscation.
  updatedCount:             URLS.P + 'updated_count',
  value:                    '@value'
};

TYPE = {
  Request:          'Request', // used for non service requests
  Response:         'Response', // used for non service responses

  //
  // Service Types
  //
  APIP:         URLS.T + 'APIP',
  AS:           URLS.T + 'AS',
  DA:           URLS.T + 'DA',
  PB:           URLS.T + 'PB',
  PP:           URLS.T + 'PP',
  PNODE:        URLS.T + 'PNODE',
  PRELOADER:    URLS.T + 'PRELOADER',
  RSP:          URLS.T + 'RSP',
  UP:           URLS.T + 'UP',

  //
  // PnService Functions that are used to build a path
  //
  PnServiceFunction:                      'PnServiceFunction',
  ManageSIM:                               URLS.T + 'ManageSIM', // public API
  CreatePath:                             'CreatePath',
  CreateSIM:                               URLS.T + 'CreateSIM', // public API
  DeObfuscate:                             URLS.T + 'DeObfuscate', // part of privacy node
  FetchSvcResponse:                        URLS.T + 'FetchSvcResponse', // public API
  FetchSvcResponseGenerated:               URLS.T + 'FetchSvcResponseGenerated', // public API
  Obfuscate:                               URLS.T + 'Obfuscate', // part of privacy node
  DePrivatize:                            'DePrivatize',
  Privatize:                              'Privatize',
  ProvisionPrivacyNode:                    URLS.T + 'ProvisionPrivacyNode',
  ReturnPath:                             'ReturnPath',
  ReferenceSourceSubjectQuery:            'ReferenceSourceSubjectQuery',
  SubjectQuery:                            URLS.T + 'SubjectQuery', // public API
  SvcResponseCreateSIM:                   'SvcResponseCreateSIM',
  SvcResponseManageSIM:                   'SvcResponseManageSIM',
  SvcResponseReferenceSourceSubjectQuery: 'SvcResponseReferenceSourceSubjectQuery',
  SvcResponseSubjectQuery:                'SvcResponseSubjectQuery',
  SvcResponseSubjectSyndicationPath:      'SvcResponseSubjectSyndicationPath',
  SvcResponseSync:                        'SvcResponseSync',
  SvcResponseUpload2SIM:                  'SvcResponseUpload2SIM',
  QuerySIM:                                URLS.T + 'QuerySIM', // public API
  Upload2SIM:                              URLS.T + 'Upload2SIM', // public API

  //
  // Public API types
  Assertion:                URLS.T + 'Assertion', // public API
  AuditData:                URLS.T + 'AuditData',
  AuditLog:                 URLS.T + 'AuditLog',
  AuditLogRef:              URLS.T + 'AuditLogRef', // an audit log
  AuditMetadata:            URLS.T + 'AuditMetadata',
  AuditRecord:              URLS.T + 'AuditRecord',
  AuditRecordRef:           URLS.T + 'AuditRecordRef',
  CommandPolicy:            URLS.T + 'CommandPolicy',
  Dataset:                  URLS.T + 'Dataset', //public API the object is a dataset
  DatasetData:              URLS.T + 'DatasetData', //public API object is a datasetData - contains data to/from dataset.
  DatasetEntry:             URLS.T + 'DatasetEntry', // item is an entry from a sim.dataset - holds Dataset Entities
  DatasetEntity:            URLS.T + 'DatasetEntity', // an entity stored in a dataset - has an entityRef in api_p.md
  DatasetEntityMetadata:    URLS.T + 'DatasetEntityMetadata', // a dataset entity metadata node in api_p.md
  Entity:                   URLS.T + 'Entity', // represents something to do with an Entity - FIXME WHERE IS THIS USED? probably redundent now added query restriction
  EntityRef:                URLS.T + 'EntityRef',  // object is an entity ref;
  Error:                    URLS.T + 'Error',   // node is an error
  Job:                      URLS.T + 'Job', // object is a job
  Metadata:                 URLS.T + 'Metadata',
  ObfuscationCriteria:      URLS.T + 'ObfuscationCriteria', // public API part of privacy schema
  ObfuscationService:       URLS.T + 'ObfuscationService', // public API object represents an obfuscation service
  PrivacyNode:              URLS.T + 'PrivacyNode',
  PrivacyPipe:              URLS.T + 'PrivacyPipe', // public API
  PrivacyPolicy:            URLS.T + 'PrivacyPolicy', // a privacy policy,
  PrivacySchema:            URLS.T + 'PrivacySchema', // a privacy schema policy
  Policy:                   URLS.T + 'Policy', // public API the object is a policy
  Query:                    URLS.T + 'Query', // a query policy
  QueryRestriction:         URLS.T + 'QueryRestriction', // node that contains restrictions to apply to the query
  QueryAudit:               URLS.T + 'QueryAudit', // used only for looking up the url fragment
  SIM:                      URLS.T + 'SIM', // a SIM
  SIMMetadata:              URLS.T + 'SIMMetadata',  // public API the object is a SIM metadata object
  Syndicated:               URLS.T + 'Syndicated', // use in query job to indicate that want syndicared data
  SyndicatedEntity:         URLS.T + 'SyndicatedEntity', // a syndicated entity - returned by an is
  SubjectSyndication:       URLS.T + 'SubjectSyndication', // public API the object si related to a subject syndication
  SvcControl:               URLS.T + 'SvcControl',  // means in the control plane
  SvcPath:                  URLS.T + 'SvcPath', // public API the object is related to service path operations
  SvcRequest:               URLS.T + 'SvcRequest', // public API the object is a service request
  SvcResponse:              URLS.T + 'SvcResponse', // public API the object is a service response
  TrustCriteria:            URLS.T + 'TrustCriteria', // public API part of privacy policy
  TrustModel:               URLS.T + 'TrustModel', // public api
  PostResponse:             URLS.T + 'PostResponse', // public API the object is a synchronous post response.
  UploadResultItem:         URLS.T + 'UploadResultItem', // returned for each entity uploaded
  X509CN:                   URLS.T + 'x509CN', // used for an identity

  // Repo Types
  MongoDB:                  URLS.T + 'MongoDB', // repo is a mongo db repo

  // Public API types more specialized
  Create:                   URLS.T + 'Create', //public API the object is a Create

  // Public Obfuscation types
  //
  ClearText:              URLS.T + 'ClearText',
  Obfuscated:             URLS.T + 'Obfuscated', // the item is obfuscated
  OpaqueToken:            URLS.T + 'OpaqueToken', // the item is an opaque token

  //
  // Connector Service Types
  //
  ReferenceSource:       URLS.T + 'ReferenceSource', // identifies something is about an external reference source
  TokenService:          URLS.T + 'TokenService', // a token obfuscation service

  //
  // Management operation type
  //
  CreateDataset:     URLS.T + 'CreateDataset'

};

//
// Promise based utility that are specific to this data model and jsonld context
//
model = {};
model.promises = {};

// Find the object of the specified type(s) within the doc using the PNDataModel Context
// *doc the jsonld object
// *type the set of object types to look for
model.promises.findObjects = function findObjectsPromise(doc, type) {

  assert(type, 'PNDataModel.findObjects requires a type param');

  return contextUtils.promises.getContext(ID)
    .then(
      function (context) {
        return jsonldUtils.promises.findObjects(
                                    doc,
                                    type,
                                    new Map().set('@context', context))
          .then(
            function (result) {
              return result;
            }
          );
      }
    )
    .catch(function (err) {
      throw new Error(util.format('Error in findObject for PnDataModel:%s', err));
    }
  );
};

//
// Id utility routines
//
model.ids = {};

//
// Dataset Id has the following format
//  https://pn.id.webshield.io/datasets/<data model host name - reversed>
//
// @dataModelId is the @id of the format 'https://<hostname>.schema.webshield.io'
//
model.ids.createDatasetId = function createDatasetId(dataModelId) {

  var dsId = 'https://pn.id.webshield.io/datasets',
      url,
      hostnameParts, i;

  assert(dataModelId, 'PNDataModel.createDatasetId requires a type param');

  // extract host name from datamodel URL
  url = URL.parse(dataModelId);
  hostnameParts = url.hostname.split('.');

  for (i = hostnameParts.length - 1; i >= 0; i--) {
    dsId = dsId + '/' + hostnameParts[i];
  }

  return dsId;
};

//
// Create a request id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.websheild.io/requests/<hostname reversed>#id
//
model.ids.createRequestId = function createRequestId(hostname, id) {

  var rqId = 'https://pn.id.webshield.io/requests',
      hostnameParts, i;

  assert(hostname, 'PNDataModel.createRequestId requires a hostname param');
  assert(id, 'PNDataModel.createRequestId requires an id param');

  hostnameParts = hostname.split('.');

  for (i = hostnameParts.length - 1; i >= 0; i--) {
    rqId = rqId + '/' + hostnameParts[i];
  }

  rqId = rqId + '#' + id;

  return rqId;
};

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  TYPE:         TYPE,
  T_URL:        URLS.T,

  // allow others to access
  promises: model.promises,
  ids: model.ids
};
