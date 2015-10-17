/*jslint node: true, vars: true */
'use strict';

//
//  This file contains the PN Public API datamodel JSON-LD types and properties
//

var PROPERTY, TYPE, URLS, ID;

// the model ID
ID = 'http://api.webshield.io';

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
  datasetRef:               URLS.P + 'dataset_ref', // reference to a dataset, contains simid and datasetid
  datasetId:                URLS.P + 'dataset_id',
  datasets:                 URLS.P + 'datasets', // public API
  datasetData:              URLS.P + 'dataset_data', // contains dataset_data
  dataConsumer:             URLS.P + 'data_consumer', // identity of a data consumer
  dataOwner:                URLS.P + 'data_owner', // identity of a data owner
  description:              URLS.P + 'description',  // public API
  destination:              URLS.P + 'destination', // used in privacy pipe policy and pnRequest
  directoryAuthority:       URLS.P + 'directory_authority', // public API of the form http://domain:port
  entityType:               URLS.P + 'entity_type', // public API
  entityRef:                URLS.P + 'entity_ref', // contains a datasetRef and atleast and @id that is the internal id
  eventId:                  URLS.P + 'event_id', // used to record an eventId for example in Audit
  eventIdText:              URLS.P + 'event_id_text', // text version of the event id
  defaults:                 URLS.P + 'defaults', // generic defaults
  dobPolicies:              URLS.P + 'dob_policies', // an array of deObfuscation policies
  domain:                   'domain',
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
  topologyId:               URLS.P + 'topology_id', // topology to use to load/query data
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
  DA:           URLS.API_T + 'DA',
  PB:           URLS.API_T + 'PB',
  PP:           URLS.API_T + 'PP',
  PNODE:        URLS.API_T + 'PNODE',
  PRELOADER:    URLS.API_T + 'PRELOADER',
  RSP:          URLS.API_T + 'RSP',
  UP:           URLS.API_T + 'UP',

  //
  // PnService Functions that are used to build a path
  //
  PnServiceFunction:                      'PnServiceFunction',
  ManageSIM:                               URLS.API_T + 'ManageSIM', // public API
  CreatePath:                             'CreatePath',
  CreateSIM:                               URLS.API_T + 'CreateSIM', // public API
  DeObfuscate:                             URLS.API_T + 'DeObfuscate', // part of privacy node
  FetchSvcResponse:                        URLS.API_T + 'FetchSvcResponse', // public API
  FetchSvcResponseGenerated:               URLS.API_T + 'FetchSvcResponseGenerated', // public API
  Obfuscate:                               URLS.API_T + 'Obfuscate', // part of privacy node
  DePrivatize:                            'DePrivatize',
  Privatize:                              'Privatize',
  ProvisionPrivacyNode:                    URLS.API_T + 'ProvisionPrivacyNode',
  ReturnPath:                             'ReturnPath',
  ReferenceSourceSubjectQuery:            'ReferenceSourceSubjectQuery',
  SubjectQuery:                            URLS.API_T + 'SubjectQuery', // public API
  SvcResponseCreateSIM:                   'SvcResponseCreateSIM',
  SvcResponseManageSIM:                   'SvcResponseManageSIM',
  SvcResponseReferenceSourceSubjectQuery: 'SvcResponseReferenceSourceSubjectQuery',
  SvcResponseSubjectQuery:                'SvcResponseSubjectQuery',
  SvcResponseSubjectSyndicationPath:      'SvcResponseSubjectSyndicationPath',
  SvcResponseSync:                        'SvcResponseSync',
  SvcResponseUpload2SIM:                  'SvcResponseUpload2SIM',
  QuerySIM:                                URLS.API_T + 'QuerySIM', // public API
  Upload2SIM:                              URLS.API_T + 'Upload2SIM', // public API

  //
  // Public API types
  Assertion:                URLS.API_T + 'Assertion', // public API
  AuditData:                URLS.API_T + 'AuditData',
  AuditLog:                 URLS.API_T + 'AuditLog',
  AuditLogRef:              URLS.API_T + 'AuditLogRef', // an audit log
  AuditMetadata:            URLS.API_T + 'AuditMetadata',
  AuditRecord:              URLS.API_T + 'AuditRecord',
  AuditRecordRef:           URLS.API_T + 'AuditRecordRef',
  CreateDataset:            URLS.API_T + 'CreateDataset', // used in policy that creates a dataset
  CommandPolicy:            URLS.API_T + 'CommandPolicy',
  Dataset:                  URLS.API_T + 'Dataset', //public API the object is a dataset
  DatasetData:              URLS.API_T + 'DatasetData', //public API object is a datasetData - contains data to/from dataset.
  DatasetEntry:             URLS.API_T + 'DatasetEntry', // item is an entry from a sim.dataset - holds Dataset Entities
  DatasetEntity:            URLS.API_T + 'DatasetEntity', // an entity stored in a dataset - has an entityRef in api_p.md
  DatasetEntityMetadata:    URLS.API_T + 'DatasetEntityMetadata', // a dataset entity metadata node in api_p.md
  Entity:                   URLS.API_T + 'Entity', // represents something to do with an Entity - FIXME WHERE IS THIS USED? probably redundent now added query restriction
  EntityRef:                URLS.API_T + 'EntityRef',  // object is an entity ref;
  Error:                    URLS.API_T + 'Error',   // node is an error
  Job:                      URLS.API_T + 'Job', // object is a job
  Metadata:                 URLS.API_T + 'Metadata',
  ObfuscationCriteria:      URLS.API_T + 'ObfuscationCriteria', // public API part of privacy schema
  ObfuscationService:       URLS.API_T + 'ObfuscationService', // public API object represents an obfuscation service
  PrivacyNode:              URLS.API_T + 'PrivacyNode',
  PrivacyPipe:              URLS.API_T + 'PrivacyPipe', // public API
  PrivacyPolicy:            URLS.API_T + 'PrivacyPolicy', // a privacy policy,
  PrivacySchema:            URLS.API_T + 'PrivacySchema', // a privacy schema policy
  Policy:                   URLS.API_T + 'Policy', // public API the object is a policy
  Query:                    URLS.API_T + 'Query', // a query policy
  QueryRestriction:         URLS.API_T + 'QueryRestriction', // node that contains restrictions to apply to the query
  QueryAudit:               URLS.API_T + 'QueryAudit', // used only for looking up the url fragment
  SIM:                      URLS.API_T + 'SIM', // a SIM
  SIMMetadata:              URLS.API_T + 'SIMMetadata',  // public API the object is a SIM metadata object
  Syndicated:               URLS.API_T + 'Syndicated', // use in query job to indicate that want syndicared data
  SyndicatedEntity:         URLS.API_T + 'SyndicatedEntity', // a syndicated entity - returned by an is
  SubjectSyndication:       URLS.API_T + 'SubjectSyndication', // public API the object si related to a subject syndication
  SvcControl:               URLS.API_T + 'SvcControl',  // means in the control plane
  SvcPath:                  URLS.API_T + 'SvcPath', // public API the object is related to service path operations
  SvcRequest:               URLS.API_T + 'SvcRequest', // public API the object is a service request
  SvcResponse:              URLS.API_T + 'SvcResponse', // public API the object is a service response
  TrustCriteria:            URLS.API_T + 'TrustCriteria', // public API part of privacy policy
  TrustModel:               URLS.API_T + 'TrustModel', // public api
  PostResponse:             URLS.API_T + 'PostResponse', // public API the object is a synchronous post response.
  UploadResultItem:         URLS.API_T + 'UploadResultItem', // returned for each entity uploaded
  X509CN:                   URLS.API_T + 'x509CN', // used for an identity

  // Repo Types
  MongoDB:                  URLS.API_T + 'MongoDB', // repo is a mongo db repo

  // Public API types more specialized
  Create:                   URLS.API_T + 'Create', //public API the object is a Create

  // Public Obfuscation types
  //
  ClearText:              URLS.API_T + 'ClearText',
  Obfuscated:             URLS.API_T + 'Obfuscated', // the item is obfuscated
  OpaqueToken:            URLS.API_T + 'OpaqueToken', // the item is an opaque token

  //
  // Connector Service Types
  //
  ReferenceSource:       URLS.API_T + 'ReferenceSource', // identifies something is about an external reference source
  TokenService:          URLS.API_T + 'TokenService' // a token obfuscation service
};

module.exports = {
  ID:           ID,
  PROPERTY:     PROPERTY,
  P_URL:        URLS.P,
  TYPE:         TYPE,
  T_URL:        URLS.T
};
