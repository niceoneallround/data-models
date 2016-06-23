/*jslint node: true, vars: true */
'use strict';

//
// Contains types, properties and utils for the Experian PN Data Model
//

var utils = {}, model = {},
  jsonldUtils = require('jsonld-utils/lib/jldUtils');

// the model ID
model.ID = 'http://experian.schema.webshield.io';

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
  $schema: 'http://experian.schema.webshield.io',
  'http//json-schema.org/title': 'http://experian.schema.webshield.io/type#Subject',
  'http://json-schema.org/type': 'object',
  'http://json-schema.org/properties': {
    '@id': { 'http://json-schema.org/type': 'string' },
    '@type': { 'http://json-schema.org/type': 'array' },
    'http://experian.schema.webshield.io/prop#DOB': { 'http://json-schema.org/type': 'string' },
    'http://experian.schema.webshield.io/prop#ExperianTransactionID': { 'http://json-schema.org/type': 'string' },
    'http://experian.schema.webshield.io/prop#Gender': { 'http://json-schema.org/type': 'string' },
    'http://experian.schema.webshield.io/prop#SourceID': { 'http://json-schema.org/type': 'string' },
    'http://experian.schema.webshield.io/prop#SSN': { 'http://json-schema.org/type': 'string' },
    'http://experian.schema.webshield.io/prop#Name': {
      'http//json-schema.org/title': 'http://experian.schema.webshield.io/type#Name',
      'http://json-schema.org/type': 'object',
      'http://json-schema.org/properties': {
        '@id': { 'http://json-schema.org/type': 'string' },
        '@type': { 'http://json-schema.org/type': 'array' },
        'http://experian.schema.webshield.io/prop#First': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#Surname': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#Middle': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#Gen': { 'http://json-schema.org/type': 'string' }
      } // name properties
    }, // name
    'http://experian.schema.webshield.io/prop#CurrentAddress': {
      'http//json-schema.org/title': 'http://experian.schema.webshield.io/type#Address',
      'http://json-schema.org/type': 'object',
      'http://json-schema.org/properties': {
        '@id': { 'http://json-schema.org/type': 'string' },
        '@type': { 'http://json-schema.org/type': 'array' },
        'http://experian.schema.webshield.io/prop#Address': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#Address1': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#Address2': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#City': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#State': { 'http://json-schema.org/type': 'string' },
        'http://experian.schema.webshield.io/prop#ZipCode': { 'http://json-schema.org/type': 'string' }
      } // address properties
    }, // address
  } // properties
};

model.TYPE = {
  Address:    model.URLS.T + 'Address',
  Name:       model.URLS.T + 'Name',
  Subject:    model.URLS.T + 'Subject'
};

model.PROPERTY = {
  CurrentAddress:         model.URLS.P + 'CurrentAddress',
  DOB:                    model.URLS.P + 'DOB', // format dd/mm/yyyy
  ExperianTransactionID:  model.URLS.P + 'ExperianTransactionID',
  Gender:                 model.URLS.P + 'Gender',
  Name:                   model.URLS.P + 'Name',
  SourceID:               model.URLS.P + 'SourceID',
  SSN:                    model.URLS.P + 'SSN',

  // name node
  First:                  model.URLS.P + 'First',
  Surname:                model.URLS.P + 'Surname',
  Middle:                 model.URLS.P + 'Middle',
  Gen:                    model.URLS.P + 'Gen',

  // address
  //
  Address:                model.URLS.P + 'Address',
  Address1:               model.URLS.P + 'Address1',
  Address2:               model.URLS.P + 'Address2',
  City:                   model.URLS.P + 'City',
  State:                  model.URLS.P + 'State',
  ZipCode:                model.URLS.P + 'ZipCode'
};

//----------------------
// Utilities
//----------------------

// create an empty Name node
utils.createNameNode = function createNameNode() {
  return jsonldUtils.createBlankNode({ '@type': model.TYPE.Name });
};

// create an empty Address Node
utils.createAddressNode = function createAddressNode() {
  return jsonldUtils.createBlankNode({ '@type': model.TYPE.Address });
};

module.exports = {
  model:        model,
  utils:        utils,

  // convenience routines
  ID:           model.ID,
  PROPERTY:     model.PROPERTY,
  TYPE:         model.TYPE

};
