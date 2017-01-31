/*jslint node: true, vars: true */
'use strict';

const assert = require('assert');
const contextUtils = require('./jsonld-contexts/utils');
const jsonldUtils = require('jsonld-utils/lib/jldUtils');
const URL = require('url');
const util = require('util');
const _ = require('lodash');

//
//  This file contains the PN Public API datamodel JSON-LD types and properties
//

//
// Setup model structure
//
let model = {};
model.errors = {};
model.ids = {};
model.ids.paramUtils = {};
model.promises = {};
model.tags = {};
model.utils = {};

// the model ID - FIXME need to change to 'https://pn.schema.webshield.io'
const ID = 'http://api.webshield.io';
const ID2 = 'http://pn.schema.webshield.io'; // move to this slowly
const ID3 = 'https://pn.schema.webshield.io'; // did not make ID2 httpS to now add so new props will have - need to move

model.ID = ID; // support new format
model.ID2 = ID2;
model.ID3 = ID3;

const metaModel = require('./PNMetaModelFactory').create(model.ID);

// Register the JSONLD context with the context utils
contextUtils.register(model.ID, 'PNDataModel');

const URLS = {
  P:    ID + '/prop#',
  T:    ID + '/type#',

  P2:    ID2 + '/prop#',
  T2:    ID2 + '/type#',

  P3:    ID3 + '/prop#',
  T3:    ID3 + '/type#',
};

model.URLS = URLS; // support new format

//
// The following are taken from the IM directory in the product - see the API document and connector README.md for ones
// that are still used.
//
const PROPERTY = {
  aad:                      URLS.P2 + 'aad', // additional authentication data
  accessPolicy:             URLS.P + 'access_policy', // used in dataset, holds trust criteria
  action:                   URLS.P2 + 'action', // used to describe what to do, for example in privacy Step
  algorithm:                URLS.P2 + 'algorithm', // used to describe cryptographic algorithms
  assertions:               URLS.P + 'assertions', // public API
  auditLogRef:              URLS.P + 'audit_log_ref', // reference to an audit log
  auditRecord:              URLS.P + 'audit_record', // a object or array of audit records
  client:                   URLS.P + 'client',  // used in a privacy pipe to refer to client calling them
  context:                  URLS.P + 'context', // a general property that can be used to pass context around - connectors
  chainId:                  URLS.P + 'chain_id',  // public API
  creator:                  URLS.P + 'creator',  // public API
  creationTime:             URLS.P + 'creation_time',  // public API
  contentObfuscationAlgorithm: URLS.P2 + 'content_obfuscation_algorithm', // privacy action
  contentEncryptKeyMDJWT:   URLS.P2 + 'content_encrypt_key_md_jwt', //holds the content encrypt key md JWT used when passing info to external OS
  contentEncryptKeyMD:      URLS.P2 + 'content_encrypt_key_md', //holds the content encrypt key @id or the JSON object if passed to the exetrnal OS
  consumerClassConstraints: URLS.P + 'consumer_class_constraints', // used in trust criteria to control data consumers
  customProps:              URLS.P2 + 'custom_props', // holds a json object of custom props that can just copy acorss
  dataIds:                  URLS.P + 'data_ids', // points to data containers in the service message
  dataModel:                URLS.P + 'data_model', // data model either and @id or the whole object
  datasetRef:               URLS.P + 'dataset_ref', // reference to a dataset, contains simid and datasetid
  datasetId:                URLS.P + 'dataset_id',
  datasets:                 URLS.P + 'datasets', // public API
  datasetData:              URLS.P + 'dataset_data', // contains dataset_data
  dataConsumer:             URLS.P + 'data_consumer', // identity of a data consumer
  dataOwner:                URLS.P + 'data_owner', // identity of a data owner
  deobfuscateEndpoint:      URLS.P2 + 'deobfuscate_endpoint', // part of obfuscate service PN resource
  description:              URLS.P + 'description',  // public API
  destination:              URLS.P + 'destination', // used in privacy pipe policy and pnRequest
  destinationProvisionPipeURL: URLS.P2 + 'destination_provision_pipe_url', // used in the PB to override default behaviour of using the destination hostname as base
  destinationProvisionBasicAuthToken: URLS.P2 + 'destination_provision_basic_auth_token',
  directoryAuthority:       URLS.P + 'directory_authority', // public API of the form http://domain:port
  domain:                   URLS.P + 'domain', // domain either the @id or an object
  domainName:               URLS.P2 + 'domain_name', // contains organizations domain name
  entityType:               URLS.P + 'entity_type', // public API
  entityRef:                URLS.P + 'entity_ref', // contains a datasetRef and atleast and @id that is the internal id
  eventId:                  URLS.P + 'event_id', // used to record an eventId for example in Audit
  eventIdText:              URLS.P + 'event_id_text', // text version of the event id
  externalEncryptMd:        URLS.P2 + 'external_encrypt_md', // holds external encrypt metadata
  encryptMechanism:         URLS.P2 + 'encrypt_mechanism',
  encryptKey:               URLS.P2 + 'encrypt_key',
  encryptionMetadata:       URLS.P2 + 'encryption_metadata',
  defaults:                 URLS.P + 'defaults', // generic defaults
  dobPolicies:              URLS.P + 'dob_policies', // an array of deObfuscation policies
  domainData:               URLS.P + 'domain_data', // public API
  error:                    URLS.P + 'error', // property holds errors
  errorCode:                URLS.P + 'error_code',  // public API
  errorCode2:               URLS.P2 + 'error_code',  // Can probably move
  errorMessage:             URLS.P + 'error_message', // public API
  fetchResponseURL:         URLS.P + 'fetch_response_url', // public API
  graph:                    '@graph',
  basePath:                 'base_path',
  homeURL:                  URLS.P + 'homeURL', // used in policies when describig external connectors
  hostType:                 URLS.P + 'host_type', // public API part of service policy allows tagging of what service want in path
  httpStatus:               URLS.P + 'http_status', // public API
  id:                       '@id', // public API
  identity:                 URLS.P + 'identity', // used to hold the cname of external system
  issuer:                   URLS.P + 'issuer',  // public API
  issuer2:                  URLS.P2 + 'issuer',  // public API
  issueTime:                URLS.P + 'issue_time', // public API
  items:                    URLS.P + 'items', // generic uses to represent a set of items
  items2:                   URLS.P2 + 'items',
  identitySyndicationAlgorithm:    URLS.P2 + 'identity_syndication_algorithm',
  linkSubject:              URLS.P3 + 'link_subject', // holds jsonld node of reference source subject that was linked to
  lastUpdatedTime:          URLS.P + 'last_updated_time', // public API
  job:                      URLS.P2 + 'job', // holds the @id or the object
  jobID:                    URLS.P3 + 'jobID', // part of RS adapter interface holds the jobId
  jsonldContext:            URLS.P2 + 'jsonld_context', // used in data model
  jsonSchema:               URLS.P2 + 'json_schema', // used in data model
  jwt:                      URLS.P2 + 'jwt', // holds a jwt
  keyEncryptKeyMD:          URLS.P2 + 'key_encrypt_key_md', //privacy action
  kms:                      URLS.P2 + 'kms', // privacy action
  messageProtocol:          URLS.P2 + 'messageProtocol', //
  metadata:                 URLS.P2 + 'metadata', // holds metadata, for example inside a JWT
  md:                       URLS.P + 'md', // property holds metadata about an object
  n:                        URLS.P2 + 'n', // the nonce
  name:                     URLS.P + 'name', // public API
  next:                     URLS.P + 'next', // used in provisioning a privacy pipes where to send to next
  node:                     URLS.P2 + 'node', // holds a jsonld node
  nodeType:                 URLS.P2 + 'node_type', // used in a schema to identify a type - a the type URL
  obfuscateEndpoint:        URLS.P2 + 'obfuscate_endpoint',
  obfuscationContext:       URLS.P2 + 'obfuscation_context', // used in privacy pipe
  obfuscationCriteria:      URLS.P + 'obfuscation_criteria',
  obfuscationProvider:      URLS.P2 + 'obfuscation_provider', // public API used in provisioning of pipes
  obfuscationService:       URLS.P2 + 'obfuscation_service', // public API used in provisioning of pipes
  obPolicies:               URLS.P + 'ob_policies', // public API an array of obfuscation policies
  oValue:                   URLS.P + 'o_value', // obfuscated value in a privacy graph value
  orderNumber:              URLS.P2 + 'order_number', // used for ordering when needed, for example privacy algorithm.
  organization:             URLS.P2 + 'organization', // used in metadata to reference back to organizaiton, holds @id
  patag:                    URLS.P2 + 'patag', // set in privacy action, used to mark obfuscated typed values @type so can be de-crypt
  payload:                  'payload',
  pipeId:                   URLS.P + 'pipe_id',
  pnDataModel:              URLS.P3 + 'pndatamodel', // used in privacy agents
  port:                     'port',
  policies:                 URLS.P + 'policies', // public API
  postBackUrl:              URLS.P2 + 'post_back_url',
  postDataUrl:              URLS.P2 + 'post_data_url',
  previous:                 URLS.P + 'previous', // used in provisioning pipes -- FUTURE WHEN ADD PIPE
  privacyAction:            URLS.P2 + 'privacy_action', // privacy actions in a privacy step
  privacyActionInstance:    URLS.P2 + 'privacy_action_instance', // in a privacy step instance
  privacyActionInstance2Deobfuscate: URLS.P2 + 'privacy_action_instance_2_deobfuscate', // privacy action instance
  privacyAlgorithm:         URLS.P2 + 'privacy_algorithm',
  privacyAlgorithmInstance: URLS.P2 + 'privacy_algorithm_instance', // used in obfuscaiton context, privacy pipe
  privacyAlgorithmInstanceTemplate: URLS.P2 + 'privacy_algorithm_instance_template', // used in obfuscaiton context, privacy pipe
  privacyAlgorithms:        URLS.P + 'privacy_algorithms', // public API - an array of privacy pipe polices
  privacyAlgorithmId:       URLS.P + 'privacy_algorithm_id', // public API - privacy pipe id
  privacyAlgorithmIds:      URLS.P + 'privacy_algorithm_ids', // public API - an array of privacy pipe ids
  privacyContext:           URLS.P2 + 'privacy_context', // used when creating pipes
  privacyNode:              URLS.P + 'privacy_node', // privacy nodes within the privacy pipe
  privacyPipe:              URLS.P + 'privacy_pipe', // either the id or the object for a privacy pipe
  privacyPipe2Deobfuscate:  URLS.P2 + 'privacy_pipe_2_deobfuscate', // privacy action instance
  privacyPipePolicyId:      URLS.P + 'privacyPipePolicyId', // a generic privacy pipe policy id
  privacyPipePolicies:      URLS.P + 'privacy_pipe_policy', // public API used in privacy policy
  privacySchema:            URLS.P + 'privacy_schema', // public API used in privacy policy describes <type, property> relationship with truct and obfuscation criteria
  privacyStep:              URLS.P2 + 'privacy_step', // part of privacy algorithm
  privacyStepInstance:      URLS.P2 + 'privacy_step_instance', // part of privacy algorithm instance
  propName:                 URLS.P2 + 'prop_name', // used in a schema to identify 1-n properties - array of property URL
  propNameDescs:            URLS.P + 'prop_name_descs', // an array of prop name descriptors as a {@type='', @value=typename}, obfuscation.
  propId:                   URLS.P + 'prop_id', // the URL of a property
  ptype:                    URLS.P3 + 'ptype', // property type
  protocol:                 'protocol',
  projection:               URLS.P + 'projection', // public API
  provisionedMetadata:      URLS.P2 + 'provisioned_metadata', // provisioned some metadata to a node for execution
  provider:                 URLS.P2 + 'provider', // holds the URL of the provider in privacy algorithm et al metadata
  properties:               URLS.P3 + 'properties', // general property holder
  query:                    URLS.P + 'query', // v2 holds query object used in query provision
  queryProjection:          URLS.P + 'query_projection', // v2 hold props to project in query provision
  queryRestriction:         URLS.P + 'query_restriction', // node holds query restrictions used across types of queries
  rawEncryptKeyMD:          URLS.P2 + 'raw_encrypt_key_md', // v2 part of encrypt key metadata
  rawEncryptKeyMDType:      URLS.P2 + 'raw_encrypt_key_md_type', // v2 part of encrypt key metadata
  referenceSource:          URLS.P + 'reference_source', // points to either an array or a single reference source policy
  referenceSourceDomain:    URLS.P2 + 'reference_source_domain',
  referenceSourceSubjectQueryURL: URLS.P2 + 'reference_source_subject_query_url',
  result:                   URLS.P + 'result', // generic holder for results depending on object will be different.
  resultSubject:            URLS.P2 + 'result_subject', // holds the @id of the result subject query
  resultSubjectPrivacyPipe: URLS.P2 + 'result_subject_privacy_pipe', // the result_subject privacy pipe in a IS job
  respondingTo:             URLS.P + 'responding_to', // public API contains the id of the service request that generated this object
  respondingToPolicy:       URLS.P + 'responding_to_policy', // public API contains the id of the policy that generated this assertion.
  repoInfo:                 URLS.P + 'repoInfo', // an object that holds repo specific info such as the mongo db id.
  rspPathPolicy:            URLS.P + 'rsp_path_policy', // public API

  //
  // Reference Source Metadata Properties
  //
  provisionPipeURL:         URLS.P2 + 'provision_pipe_url',
  subjectQueryURL:          URLS.P2 + 'subject_query_url',

  serviceName:              URLS.P + 'service_name',
  serviceRequirements:      URLS.P + 'service_requirements',
  servicePathPolicy:        URLS.P + 'service_path_policy', // public API
  serviceRequest:           URLS.P + 'service_request', // public API
  schema:                   URLS.P + 'schema', // used in metadata
  schemaPrefix:             URLS.P2 + 'schema_prefix', // used in metadata
  simId:                    URLS.P + 'sim_id', // public API
  sims:                     URLS.P + 'sims', // public API
  skipOrchestration:        URLS.P2 + 'skip_orchestration', // privacy action
  source:                   URLS.P + 'source', // public API source of a privacy pipe
  sourceID:                 URLS.P2 + 'sourceID', // in subject data holds the unique id, did not _id to be congruent with schema.org
  sourceIdDesc:             URLS.P + 'source_id_desc', // v2 describes sourceId in provision - part of data model
  statusCode:               URLS.P + 'status_code',
  subject:                  URLS.P2 + 'subject',
  subjectPropName:          URLS.P3 + 'subject_prop_name',
  subjectPrivacyPipe:       URLS.P2 + 'subject_privacy_pipe', // the subject privacy pipe in a IS job
  subjectType:              URLS.P2 + 'subject_type', // used in identity syndication algorithm to what subject to syndicate
  subjectSchema:            URLS.P2 + 'subject_schema', // used to desctibe a subject schema
  subjectSyndicationRequest: URLS.P2 + 'subject_syndication_request', // part of IS job records what subject syndication request started job.
  subjectDatasetIds:        URLS.P + 'subject_dataset_ids', // public API
  subjectQuery:             URLS.P2 + 'subject_query', // holds either id or the query
  syndicatedEntity:         URLS.P2 + 'syndicated_entity', // holds syndicated entities
  syndicationSubject:       URLS.P + 'syndication_subject',  // public API
  syndicationProperties:    URLS.P + 'syndication_properties', // public API
  signature:                'signature',
  svcRequestId:             URLS.P + 'svc_request_id', // log and audit files want to record this so can link as necessary
  topology:                 URLS.P + 'topology', // may be an @id or object
  topologyId:               URLS.P + 'topology_id', // topology to use to load/query data - FIXME REPLACED WITH TOPOLOGY
  trustCriteria:            URLS.P2 + 'trust_criteria', //used t protect PN Data model
  type:                     '@type', // public API
  typeId:                   URLS.P  + 'type_id', // a type id URL
  typeDesc:                 URLS.P + 'type_desc', // used to describe a type as a {@type='', @value=typename}, obfuscation.
  updatedCount:             URLS.P + 'updated_count',
  userTag:                  URLS.P2 + 'user_tag', // used to hold an external tag on some data - usually clear text and meaningless
  v:                        URLS.P2 + 'v', // used in obfuscated values
  value:                    '@value',
  version:                  URLS.P2 + 'version'
};

model.PROPERTY = PROPERTY; // support new format

const TYPE = {
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
  DePrivatize:                            'DePrivatize',
  Privatize:                              'Privatize',
  ProvisionPrivacyNode:                    URLS.T + 'ProvisionPrivacyNode',
  ReturnPath:                             'ReturnPath',
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
  Base64UrlEncodedJSONObject: URLS.T2 + 'Base64UrlEncodedJSONObject', // used in encrypt key md
  CommandPolicy:            URLS.T + 'CommandPolicy',
  Connector:                URLS.T2 + 'Connector',
  Dataset:                  URLS.T + 'Dataset', //public API the object is a dataset
  DatasetData:              URLS.T + 'DatasetData', //public API object is a datasetData - contains data to/from dataset.
  DatasetEntry:             URLS.T + 'DatasetEntry', // item is an entry from a sim.dataset - holds Dataset Entities
  DatasetEntity:            URLS.T + 'DatasetEntity', // an entity stored in a dataset - has an entityRef in api_p.md
  DatasetEntityMetadata:    URLS.T + 'DatasetEntityMetadata', // a dataset entity metadata node in api_p.md
  DecryptRequest:           URLS.T2 + 'DecryptRequest',
  Deobfuscate:              URLS.T2 + 'Deobfuscate', // used in privacy pipe
  Domain:                   URLS.T2 + 'Domain', // a domain node
  Entity:                   URLS.T + 'Entity', // represents something to do with an Entity - FIXME WHERE IS THIS USED? probably redundent now added query restriction
  EntityRef:                URLS.T + 'EntityRef',  // object is an entity ref;
  Error:                    URLS.T + 'Error',   // node is an error
  External:                 URLS.T2 + 'External', // the privacy action runs inside the node
  EncryptKeyMetadata:       URLS.T2 + 'EncryptKeyMetadata', // v2
  EncryptRequest:           URLS.T2 + 'EncryptRequest',
  EncryptMetadata:          URLS.T2 + 'EncryptMetadata',
  EncryptObfuscationServiceProtocolV1: URLS.T2 + 'EncryptObfuscationServiceProtocolV1', // uses in OS PN Resource
  EncryptObfuscationServiceProtocolV2: URLS.T2 + 'EncryptObfuscationServiceProtocolV2',
  ExternalEncryptMetadata:  URLS.T2 + 'ExternalEncryptMetadata', // used to capture external encryption metadata
  IdentitySyndicationAlgorithm: URLS.T2 + 'IdentitySyndicationAlgorithm',
  IdentitySyndicationJob:   URLS.T2 + 'IdentitySyndicationJob',
  Internal:                 URLS.T2 + 'Internal',
  Job:                      URLS.T + 'Job', // object is a job
  KeyReference:             URLS.T2 + 'KeyReference', // used in encrypy key metadata
  KMS:                      URLS.T2 + 'KMS', // Key Management Service Resource
  Metadata:                 URLS.T + 'Metadata',
  Obfuscate:                URLS.T2 + 'Obfuscate', // used in privacy pipe
  ObfuscationContext:       URLS.T2 + 'ObfuscationContext', // used in privacy pipe
  ObfuscationCriteria:      URLS.T + 'ObfuscationCriteria', // public API part of privacy schema
  PrivacyAction:            URLS.T2 + 'PrivacyAction',
  PrivacyActionInstance:    URLS.T2 + 'PrivacyActionInstance',
  PrivacyAlgorithm:         URLS.T + 'PrivacyAlgorithm',
  PrivacyAlgorithmInstance: URLS.T2 + 'PrivacyAlgorithmInstance',
  PrivacyContext:           URLS.T2 + 'PrivacyContext',
  PrivacyGraph:             URLS.T2 + 'PrivacyGraph',
  PrivacyNode:              URLS.T + 'PrivacyNode',
  PrivacyPipe:              URLS.T + 'PrivacyPipe', // public API
  PrivacyPolicy:            URLS.T + 'PrivacyPolicy', // a privacy policy,
  PrivacyStep:              URLS.T2 + 'PrivacyStep', // part of PA
  PrivacyStepInstance:      URLS.T2 + 'PrivacyStepInstance', // part of PA
  PrivacyNodePrivacyStep:   URLS.T2 + 'PrivacyNodePrivacyStep', // describes a privacy step for a privacy node
  ReferenceSourcePrivacyStep:  URLS.T2 + 'PrivacyNodePrivacyStep', // described a privact step for a reference source
  PrivacySchema:            URLS.T + 'PrivacySchema', // a privacy schema policy _ NOT USED ANYMORE
  Policy:                   URLS.T + 'Policy', // public API the object is a policy
  Query:                    URLS.T + 'Query', // a query policy
  QueryResult:              URLS.T + 'QueryResult', // a query result from a provisioned query V2
  QueryRestriction:         URLS.T + 'QueryRestriction', // node that contains restrictions to apply to the query
  QueryAudit:               URLS.T + 'QueryAudit', // used only for looking up the url fragment
  RSAQuery:                 URLS.T3 + 'RSAQuery', // used between RSPA and RSA
  RSAQueryResult:           URLS.T3 + 'RSAQueryResult', // used between RSPA and RSA
  RSPSubjectQuery:          URLS.T2 + 'RSPSubjectQuery', // used between is and rsp
  RSPSubjectQueryResult:    URLS.T2 + 'RSPSubjectQueryResult', // used between is and rsp
  RSSubjectQuery:           URLS.T2 + 'RSSubjectQuery', // the node is a reference source subject query between rsp and rs
  RSSubjectQueryResult:     URLS.T2 + 'RSSubjectQueryResult', // the node is a reference source subject query between rsp and rs
  SubjectQueryResult:       URLS.T2 + 'SubjectQueryResult', // response
  SubjectQueryRestriction:  URLS.T3 + 'SubjectQueryRestriction', // the node represents the restriction subject in the query
  SchemaItem:               URLS.T2 + 'SchemaItem', // schema item as a prop_type and prop_name, example use is privacy algorithm
  SIM:                      URLS.T + 'SIM', // a SIM
  SIMMetadata:              URLS.T + 'SIMMetadata',  // public API the object is a SIM metadata object
  Syndicated:               URLS.T + 'Syndicated', // use in query job to indicate that want syndicared data
  SyndicatedEntity:         URLS.T2 + 'SyndicatedEntity', // a syndicated entity - returned by an is
  SubjectSyndication:       URLS.T + 'SubjectSyndication', // public API the object si related to a subject syndication
  SubjectSyndicationRequest: URLS.T2 + 'SubjectSyndicationRequest', // public API the object si related to a subject syndication
  SvcControl:               URLS.T + 'SvcControl',  // means in the control plane
  SvcPath:                  URLS.T + 'SvcPath', // public API the object is related to service path operations
  SvcRequest:               URLS.T + 'SvcRequest', // public API the object is a service request
  SvcResponse:              URLS.T + 'SvcResponse', // public API the object is a service response
  TrustCriteria:            URLS.T + 'TrustCriteria', // public API part of privacy policy
  TrustModel:               URLS.T + 'TrustModel', // public api
  PostResponse:             URLS.T + 'PostResponse', // public API the object is a synchronous post response.
  UploadResultItem:         URLS.T + 'UploadResultItem', // returned for each entity uploaded
  URL:                      URLS.T + 'URL', // used for typed values to indicate @value is a URL
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
  CreateDataset:     URLS.T + 'CreateDataset',

  //-----------------------------
  // Control Operation types
  //-----------------------------

  // privacy store
  CreateProvisionQuery:   URLS.T + 'CreateProvisionQuery',
  ProvisionedQuery:         URLS.T + 'ProvisionedQuery',
  CreateProvisionStore:   URLS.T + 'CreateProvisionStore',
  ProvisionedStore:         URLS.T + 'ProvisionedStore',

  // Provision - used to provision metadata into the data plane.
  Provision:                URLS.T2 + 'Provision',

  // Errors
  TypeError:            URLS.T2 + 'TypeError',  // a format error with the passed in object

  //
  // PN Resource Types
  //
  IngestPrivacyAgent:         URLS.T2 + 'IngestPrivacyAgent', // ingest privacy agent
  Resource:                   URLS.T2 + 'Resource', // the base resource
  OrgResource:                URLS.T2 + 'OrgResource', // represents an organization as a cname
  Organization:               URLS.T2 + 'Organizaton', // Organization Resource
  PNDataModel:                URLS.T2 + 'PNDataModel',
  ObfuscationService:         URLS.T2 + 'ObfuscationService', // a private or shared obfuscation service
  ReferenceSourceResource:    URLS.T2 + 'ReferenceSourceResource', // represents a reference source resource

  //
  // Subject Credentials
  //
  SubjectLinkCredential:      URLS.T3 + 'SubjectLinkCredential',

};

model.TYPE = TYPE; // support new format

//-----------------
// Add Enums
//-----------------
model.ENUMS = {
  SyndicationJobStatusEnum: {
    FinishedError: { status: 400, code: 'FinishedError', friendly: 'Syndication Completed with an error' },
    FinishedOK: { status: 200, code: 'FinishedOK', friendly: 'Syndication Completed - match' },
    FinishedNotFound: { status: 404, code: 'FinishedNotFound', friendly: 'Syndication Completed - no match found' },
    New: { code: 'New', status: 202, friendly: 'New Syndication Job' },
    Mock: { code: 'Mock', status: 202, friendly: 'Mock for testing does nothing' },
    Processing: { status: 202, code: 'Processing', friendly: 'Processing' },
    StoppedError: { status: 400, code: 'StoppedError', friendly: 'Stopped due to some error' },
    WaitingForRS: { status: 202, code: 'WaitingForRS', friendly: 'Waiting for RS to return subject query results' },
    ErrorSendingToRS: { status: 500, code: 'ErrorSendingToRS', friendly: 'Error sending the query to the Reference Source' }
  }
};

//
// Return true if finished - checks the enum
//
model.utils.isSyndicationJobFinished = function isSyndicationJobFinished(isJobEnum) {
  if ((isJobEnum) && (isJobEnum.status) && (isJobEnum.status !== 202)) {
    return true;
  } else {
    return false;
  }
};

//
// Promise based utility that are specific to this data model and jsonld context
//

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

//------------------------------------
// Id creation utility routines
//-----------------------------------

function appendReversedHostname(base, hostname) {
  var hostnameParts, i;

  hostnameParts = hostname.split('.');

  for (i = hostnameParts.length - 1; i >= 0; i--) {
    base = base + '/' + hostnameParts[i];
  }

  return base;
}

//
// Create a user data PN data model id
//  https://id.webshield.io/acme/com#value
//
model.ids.createUserDataId = function createUsertDataId(hostname, value) {
  var type = 'https://id.webshield.io';
  return helperCreateId(type, hostname, value);
};

//
// Dataset Id has the following format
//  https://pn.id.webshield.io/datasets/<data model host name - reversed>
//
// @dataModelId is the @id of the format 'https://<hostname>.schema.webshield.io'
//
model.ids.createDatasetId = function createDatasetId(dataModelId) {

  var dsId = 'https://pn.id.webshield.io/datasets',
      url;

  assert(dataModelId, 'PNDataModel.createDatasetId requires a type param');
  url = URL.parse(dataModelId);
  return appendReversedHostname(dsId, url.hostname);
};

//
// Return a dataModelId of the form
//  https://<hostname>.schema.webshield.io
//
model.ids.createDataModelId = function createDataModelId(hostname) {
  assert(hostname, 'no hostname param');

  return 'https://' + hostname + '.schema.webshield.io';
};

//
// Helper for creating pn ids
// *type the prefix to start with
// *hostname the name
// *id the id
//
function helperCreateId(type, hostname, id) {
  assert(hostname, 'PNDataModel.helperCreateId requires a hostname param');
  assert(id, 'PNDataModel.helperCreateId requires an id param');

  let pnId;

  let isUrl = false;
  if (_.isString(id)) {
    let parsedURL = URL.parse(id);
    if (parsedURL.protocol) {
      // if id is already a URL then nothing to do so just return the input
      // otherwise create a new URL to reprsent
      //
      isUrl = true;
      pnId = id;
    }
  }

  if (!isUrl) {
    pnId = type;
    pnId = appendReversedHostname(pnId, hostname);
    pnId = pnId + '#' + id;
  }

  return pnId;
}

//
// Create a non PN generated id that has the format
//
// The format is https://id.webshield.io/<hostname reversed>/type#id
//
// Create an id of a known format of the passed in type - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
// *type - optional type to append
//
model.ids.createExternalId = function createExternalId(hostname, idValue, type) {
  let id = 'https://id.webshield.io';
  id = appendReversedHostname(id, hostname);

  if (type) {
    id = id + '/' + type;
  }

  id = id + '#' + idValue;

  return id;
};

//
// Create a message id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.websheild.io/message/<hostname reversed>#id
//
model.ids.createMessageId = function createMessageId(hostname, id) {
  let type = 'https://pn.id.webshield.io/message';
  return helperCreateId(type, hostname, id);
};

//
// Create a request id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.websheild.io/requests/<hostname reversed>#id
//
model.ids.createRequestId = function createRequestId(hostname, id) {
  var type = 'https://pn.id.webshield.io/requests';
  return helperCreateId(type, hostname, id);
};

//
// Create a syndication request id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://id.webshield.io/syndication_request/<hostname reversed>#id
//
model.ids.createSyndicationRequestId = function createSyndicationRequestId(hostname, id) {
  var type = 'https://pn.id.webshield.io/syndication_request';
  return helperCreateId(type, hostname, id);
};

//
// Create a syndicated entity  id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://id.webshield.io/syndicated_entity/<hostname reversed>#id
//
model.ids.createSyndicatedEntityId = function createSyndicationRequestId(hostname, id) {
  var type = 'https://pn.id.webshield.io/syndicated_entity';
  return helperCreateId(type, hostname, id);
};

//
// Create a subject link id  - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://id.webshield.io/subject_link/<hostname reversed>#id
//
model.ids.createSubjectLinkId = function createSubjectLinkId(hostname, id) {
  var type = 'https://pn.id.webshield.io/subject_link';
  return helperCreateId(type, hostname, id);
};

//
// Create a provision id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.webshield.io/provision/<hostname reversed>#id
//
model.ids.createProvisionId = function createProvisionId(hostname, id) {
  var type = 'https://pn.id.webshield.io/provisions';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy context id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.webshield.io/privacy_context/<hostname reversed>#id
//
model.ids.createPrivacyContextId = function createPrivacyContextId(hostname, id) {
  var type = 'https://pn.id.webshield.io/privacy_context';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy pipe id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.webshield.io/privacy_pipe/<hostname reversed>#id
//
//
/* COMMENT OUT AS DECLARED TWICE SO REMOVE THIS WRONG ONE
model.ids.createPrivacyPipeId = function createPrivacyPipeId(hostname, id) {
  var type = 'https://pn.id.webshield.io/privacy_pipe';
  return helperCreateId(type, hostname, id);
}; */

//
// Create a query id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.webshield.io/query_result/<hostname reversed>#id
//
model.ids.createQueryId = function createQueryId(hostname, id) {
  var type = 'https://pn.id.webshield.io/query';
  return helperCreateId(type, hostname, id);
};

//
// Create a query result id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.webshield.io/query_result/<hostname reversed>#id
//
model.ids.createQueryResultId = function createQueryResultId(hostname, id) {
  var type = 'https://pn.id.webshield.io/query_result';
  return helperCreateId(type, hostname, id);
};

//
// Create an error id that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://pn.id.webshield.io/error/<hostname reversed>#id
//
model.ids.createErrorId = function createErrorId(hostname, id) {
  var type = 'https://pn.id.webshield.io/error';
  return helperCreateId(type, hostname, id);
};

//--------------------
//
// metadata ids
//
//--------------------
var MD_ID_PREFIX = 'https://md.pn.id.webshield.io';

model.ids.getMdIdPrefix = function getMdIdPrefix() {
  return MD_ID_PREFIX;
};

//
// Create a encrypt key metadata id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/encrypt_key_md/<hostnname reversed>#id
//
model.ids.createEncryptKeyMetadataId = function createEncryptKeyMetadataId(hostname, id) {
  var type = MD_ID_PREFIX + '/encrypt_key_md';
  return helperCreateId(type, hostname, id);
};

//
// Create a ingest privacy agent of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/ingest_privacy_agent/<hostname reversed>#id
//
model.ids.createIngestPrivacyAgentId = function createIngestPrivacyAgentId(hostname, id) {
  var type = MD_ID_PREFIX + '/ingest_privacy_agent';
  return helperCreateId(type, hostname, id);
};

//
// Create a identity syndication algorithm id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/identity_syndication_algorithm/<hostname reversed>#id
//
model.ids.createIdentitySyndicationAlgorithmId = function createIdentitySyndicationAlgorithmId(hostname, id) {
  var type = MD_ID_PREFIX + '/identity_syndication_algorithm';
  return helperCreateId(type, hostname, id);
};

//
// Create a identity syndication job id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/identity_syndication_job/<hostname reversed>#id
//
model.ids.createIdentitySyndicationJobId = function createIdentitySyndicationJobId(hostname, id) {
  var type = MD_ID_PREFIX + '/identity_syndication_job';
  return helperCreateId(type, hostname, id);
};

//
// Create a KMS metadata id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/kms/<hostnname reversed>#id
//
model.ids.createKMSId = function createKMSId(hostname, id) {
  var type = MD_ID_PREFIX + '/kms';
  return helperCreateId(type, hostname, id);
};

//
// Create a Organization metadata id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/organization/<hostnname reversed>#id
//
model.ids.createOrganizationId = function createOrganizationId(hostname, id) {
  var type = MD_ID_PREFIX + '/organization';
  return helperCreateId(type, hostname, id);
};

//
// Create a Obfuscation Service metadata id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/obfuscation_service/<hostnname reversed>#id
//
model.ids.createObfuscationServiceId = function createObfuscationServiceId(hostname, id) {
  var type = MD_ID_PREFIX + '/obfuscation_service';
  return helperCreateId(type, hostname, id);
};

//
// Create a reference source metadata id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/reference_source/<hostnname reversed>#id
//
// FIXME FIXME is this used as now reference source is a resource
//
model.ids.createReferenceSourceId = function createReferenceSourceId(hostname, id) {
  var type = MD_ID_PREFIX + '/reference_source';
  return helperCreateId(type, hostname, id);
};

//
// Create a PN Data Model id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/pn_data_model/<hostnname reversed>#id
//
// FIXME FIXME is this used as now reference source is a resource
//
model.ids.createPNDataModelId = function createPNDataModelId(hostname, id) {
  var type = MD_ID_PREFIX + '/pndatamodel';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy action id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/privacy_action/<hostname reversed>#id
//
model.ids.createPrivacyActionId = function createPrivacyActionId(hostname, id) {
  var type = MD_ID_PREFIX + '/privacy_action';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy action instance id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/paction_instance/<hostname reversed>#id
//
model.ids.createPrivacyActionInstanceId = function createPrivacyActionInstanceId(hostname, id) {
  var type = MD_ID_PREFIX + '/paction_instance';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy algorithm id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/privacy_algorithm/<hostname reversed>#id
//
model.ids.createPrivacyAlgorithmId = function createPrivacyAlgorithmId(hostname, id) {
  var type = MD_ID_PREFIX + '/privacy_algorithm'; // note is a resource but naming it feel is wrong
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy algorithm instance of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/palgorithm_instance/<hostname reversed>#id
//
model.ids.createPrivacyAlgorithmInstanceId = function createPrivacyAlgorithmInstanceId(hostname, id) {
  var type = MD_ID_PREFIX + '/palgorithm_instance'; // note not a resource
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy step id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/privacy_step/<hostname reversed>#id
//
model.ids.createPrivacyStepId = function createPrivacyStepId(hostname, id) {
  var type = MD_ID_PREFIX + '/privacy_step';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy step instance id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/pstep_instance/<hostname reversed>#id
//
model.ids.createPrivacyStepInstanceId = function createPrivacyStepInstanceId(hostname, id) {
  var type = MD_ID_PREFIX + '/pstep_instance';
  return helperCreateId(type, hostname, id);
};

//
// Create a privacy pipe id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/privacy_pipe/<hostname reversed>#id
//
model.ids.createPrivacyPipeId = function createPrivacyPipeId(hostname, id) {
  var type = 'https://md.pn.id.webshield.io/privacy_pipe';
  return helperCreateId(type, hostname, id);
};

//
// Create a resource id
// *domainName - the domain of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/resource/<domain reversed>#id
//
model.ids.createResourceId = function createResourceId(domainName, id) {
  var type = 'https://md.pn.id.webshield.io/resource';
  return helperCreateId(type, domainName, id);
};

//
// Create a encryption metadata id of a known format - that will be unique for log files
// *hostname - the hostname of called for example acme.com
// *id - an id to be added to end
//
// The format is https://md.pn.id.webshield.io/encryption_metadata/<hostname reversed>#id
//
model.ids.createEncryptMetadataId = function createEncryptMetadataId(hostname, id) {
  var type = 'https://md.pn.id.webshield.io/encrypt_metadata';
  return helperCreateId(type, hostname, id);
};

//
// Create a encryption mechansim id of a known format
// *domainName - the domain name of the mechanism provider - for example Ionic.com
// *id- the id of mechanism - for example AES_256, SHA2_256
//
// The format is https://md.pn.id.webshield.io/encryption_metadata/<hostname reversed>#id
//
model.ids.createEncryptMechanismId = function createEncryptMechanismId(domainName, id) {
  var type = 'https://md.pn.id.webshield.io/encrypt_mechanism';
  return helperCreateId(type, domainName, id);
};

//-------
// helpers to convert ids to params that can be placed in urls
//-----------

//
// A md Id needs to be part of a URL to do this the following occurs
// - The prefix before (md-class) is removed
// - all '/' before the # are turned into ___
// - the '#' is turned into a '--'
// - all data after the '--' is left untouched
//
// LOL would have been mich easier to just base64 encode
//
model.ids.paramUtils.createMdParamFromMdId = function createMdParamFromMdId(id) {
  assert(id, 'missing id param');
  var start, fragment, tmp;

  start = model.ids.getMdIdPrefix().length + 1; // remove the / before the class name
  fragment = id.substring(start, id.length);

  // replaces slashes with three ___
  tmp = fragment.replace(/[/]/g, '___');

  // replaces # with --
  tmp = tmp.replace(/[#]/g, '--');

  /*console.log('id:%s', id);
  console.log('fragment:%s', fragment);
  console.log('fragment after replace:%s', tmp);*/

  return tmp;
};

//
// Create a md @id from a md param
// - The prefix before (md-class) is removed
// - all '___' before the # are turned into /
// - the '--' is turned into a '#'
// - all data after the '--' is left untouched
//
// The reverse of the createMdParamFromMdId routine
//
model.ids.paramUtils.createMdIdFromParam = function createMdIdFromParam(param) {
  assert(param, 'param param is missing');
  var partAfterHash, part2Replace;

  //console.log('id:%s', id);

  // extract the part between the md prefix and the double dash as want to replace any '@' with '/'
  part2Replace = param.substring(
                    0,
                    param.indexOf('--'));

  //console.log('part2Replace:%s', part2Replace);

  // extract the part after the #
  partAfterHash = param.substring(
                    param.indexOf('--') + 2,
                    param.length);

  //console.log('partAfterHash:%s', partAfterHash);

  return model.ids.getMdIdPrefix() + '/' + part2Replace.replace(/_{3}/g, '/') + '#' + partAfterHash;

  //return model.ids.getMdIdPrefix() + '/' + part2Replace.replace(/['___']/g, '/') + '#' + partAfterHash;
};

//
// Replaces any '.' with '-'. Note the name not the id which would include http(s)
//
model.ids.paramUtils.createParamFromDomain = function createParamFromDomain(domainName) {
  return domainName.replace(/[.]/g, '-');
};

//---------
// Tag utils
//----------

//
// Create a tag in a known format - that will be unique for log files
// *tagType - the type of tag
// *hostname - the hostname of called for example acme.com
// *id - the tag - often a JWT containing metadata, but can be anything
//
// The format is https://pn.tag.webshield.io/(tagType)/<hostname reversed>#id
//
model.tags.createTag = function createTag(tagType, hostname, id) {
  assert(tagType, 'type parameter missing');
  var type = 'https://pn.tag.webshield.io/' + tagType;
  return helperCreateId(type, hostname, id);
};

//-----------------------
// Set of utils
//------------------

//
// create typed value containing a X509 common name
//
model.utils.createCNameValue = function createCNameValue(cname) {
  return {
    '@type': TYPE.X509CN,
    '@value': cname
  };
};

//
// create typed value containing a URL
//
model.utils.createURLValue = function createURLValue(url) {
  return {
    '@type': TYPE.URL,
    '@value': url
  };
};

//---------------------------
// DOMAIN helpers
//---------------------------

// create a createDomain request
// props.name - the domain name as a cname
// props.datamodel - the data model associated with the domain
model.utils.createDomainRequest = function createDomainRequest(props) {
  assert(props.name, 'props.name is missing');
  assert(props.datamodel, 'props.datamodel is missing needs the @id of datamodel for this domain');
  var dmRq = {};
  dmRq['@id'] = 'https://' + props.name;
  dmRq['@type'] = [model.TYPE.Domain];
  dmRq[model.PROPERTY.dataModel] = props.datamodel;
  return dmRq;
};

//------------------
// ERROR helpers
//------------------

//
// create an error object
// props.err is a typed value
//
model.errors.createError = function createError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id error id missing:%j', props));
  assert(props.httpStatus, util.format('props.httpStatus is missing:%j', props));
  assert(props.error, util.format('props.error is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error };
  err[PROPERTY.httpStatus] = props.httpStatus;
  err[PROPERTY.error] = props.error;
  return err;
};

// if a problem with an input object
model.errors.createTypeError = function createTypeError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id error id missing:%j', props));
  assert(props.errMsg, util.format('props.errMsg is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error };
  err[PROPERTY.httpStatus] = '400'; // invalid
  err[PROPERTY.error] = jsonldUtils.createV({ type: TYPE.TypeError, value: props.errMsg });

  return err;
};

model.errors.createUnauthorizedError = function createUnauthorizedError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id error id missing:%j', props));
  assert(props.errMsg, util.format('props.errMsg is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error };
  err[PROPERTY.httpStatus] = '401'; // Forbidden access
  err[PROPERTY.error] = jsonldUtils.createV({ type: TYPE.TypeError, value: props.errMsg });

  return err;
};

// Cannot access URL
model.errors.createForbiddenError = function createForbiddenError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id error id missing:%j', props));
  assert(props.errMsg, util.format('props.errMsg is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error };
  err[PROPERTY.httpStatus] = '403'; // Forbidden access
  err[PROPERTY.error] = jsonldUtils.createV({ type: TYPE.TypeError, value: props.errMsg });

  return err;
};

// the object could not be found
model.errors.createNotFoundError = function createNotFoundError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id is missing:%j', props));
  assert(props.errMsg, util.format('props.errMsg is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error };
  err[PROPERTY.httpStatus] = '404'; // not found
  err[PROPERTY.error] = jsonldUtils.createV({ type: TYPE.TypeError, value: props.errMsg });

  return err;
};

// the JWT failed verification
model.errors.createInvalidJWTError = function createInvalidJWTError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id is missing:%j', props));
  assert(props.jwtError, util.format('props.jwtError is missing:%j', props));
  assert(props.type, util.format('props.type is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error },
      errMsg = util.format('Error JWT for %s is malformed with error:%j', props.type, props.jwtError);

  err[PROPERTY.httpStatus] = '400'; // bad request
  err[PROPERTY.error] = jsonldUtils.createV({ type: TYPE.TypeError, value: errMsg });

  return err;
};

// the object could not be found
model.errors.createInternalError = function createInternalError(props) {
  assert(props, 'props param missing');
  assert(props.id, util.format('props.id is missing:%j', props));
  assert(props.errMsg, util.format('props.errMsg is missing:%j', props));

  var err = { '@id': props.id, '@type': TYPE.Error };
  err[PROPERTY.httpStatus] = '500'; // internal error
  err[PROPERTY.error] = jsonldUtils.createV({ type: TYPE.TypeError, value: props.errMsg });

  return err;
};

model.errors.isError = function isError(object) {
  if (!object) {
    return false;
  }

  if (Array.isArray(object)) {
    return false;
  }

  if ((jsonldUtils.isType(object, TYPE.TypeError)) ||
       (jsonldUtils.isType(object, TYPE.Error))) {
    return true;
  }
};

//---------------
// HTTP header fields
//------------------

const httpHeaders = {
  PostBackURL: 'x-pn-webshield-io-async-post-back-url'
};

module.exports = {
  ID:           model.ID,
  PROPERTY:     model.PROPERTY,
  TYPE:         model.TYPE,
  P_URL:        model.URLS.P,
  T_URL:        model.URLS.T,

  // MD about the properties and Types
  metaModel:    metaModel,
  model: model,

  // allow others to access
  promises: model.promises,
  errors: model.errors,
  ids: model.ids,
  tags: model.tags,
  utils: model.utils,

  // http stuff
  httpHeaders: httpHeaders
};
