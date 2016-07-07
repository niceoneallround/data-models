/*jslint node: true, vars: true */
'use strict';

//
// Contains types, properties and utils for the Acceptto PN Data Model
//

var utils = {}, model = {};

// the model ID
model.ID = 'http://acceptto.schema.webshield.io';

model.URLS = {
  P:    model.ID + '/prop#',
  T:    model.ID + '/type#'
};

// JSON Schema representation - futures
// - add extenstions needed for PN
// - allow referencing just embedded types
// - look at id usage
// - always check with http://www.jsonschemavalidator.net/
//
model.JSON_SCHEMA = {
  $schema: 'http://acceptto.schema.webshield.io',
  'http//json-schema.org/title': 'http://acceptto.schema.webshield.io/type#Subject',
  'http://json-schema.org/type': 'object',
  'http://json-schema.org/properties': {
    '@id': { 'http://json-schema.org/type': 'string' },
    '@type': { 'http://json-schema.org/type': 'array' },
    'http://acceptto.schema.webshield.io/prop#process_id': { 'http://json-schema.org/type': 'string' },
    'http://acceptto.schema.webshield.io/prop#outbound_job_id': { 'http://json-schema.org/type': 'string' },
    'http://acceptto.schema.webshield.io/prop#inbound_job_id': { 'http://json-schema.org/type': 'string' },
  } // properties
};

model.TYPE = {
};

model.PROPERTY = {
  inboundJobId:           model.URLS.P + 'inbound_job_id',
  outboundJobId:          model.URLS.P + 'outbound_job_id',
  processId:              model.URLS.P + 'process_id'
};

//----------------------
// Utilities
//----------------------

module.exports = {
  model:        model,
  utils:        utils,

  // convenience routines
  ID:           model.ID,
  PROPERTY:     model.PROPERTY,
  TYPE:         model.TYPE

};
