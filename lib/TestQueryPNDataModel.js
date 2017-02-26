/*jslint node: true, vars: true */
'use strict';

/*

The PN Data Model used to test queries

It extends the base subject data model as follows
1. The subject is the pn_t.SubjectQueryRestriction
2. Adds some properties that can used as query parameters

*/

const BaseSubjectPNDataModel = require('./BaseSubjectPNDataModel');

// ID is used in the PN resource
const ID = 'https://md.pn.id.webshield.io/pndatamodel/io/webshield/test#query';

// Used to prefix types and props that are specific to this schema
const SCHEMA_PREFIX = 'https://query.test.webshield.io.schema.webshield.io';

/*

CAN BE PASTED INTO A ONLINE VALIDATOR - the properties that can be used in query
params or request props

{
	"$schema": "http://json-schema.org/draft-04/schema#",
	"id": "http://query.test.schema.webshield.io",
  "definitions": {
   "https://schema.org/PostalAddress": {
     "type": "object",
     "title": "http://schema.org/PostalAddress",
     "properties": {
        "@type": { "type": "array"},
       "https://schema.org/addressCountry":     { "type": "string" },
       "https://schema.org/addressLocality":    { "type": "string" },
       "https://schema.org/addressRegion":      { "type": "string" },
       "https://schema.org/postalCode":         { "type": "string" },
       "https://schema.org/postOfficeBoxNumber":{ "type": "string" },
       "https://schema.org/streetAddress":      { "type": "string" }
     },
     "required": ["@type"]
   }
 },
	"title": "https://query.test.webshield.io.schema.webshield.io/type#Subject",
	"type": "object",
	"properties": {
		"@id":        { "type": "string" },
		"@type":      { "type": "array" },
		"https://schema.org/deathDate":                  { "type": "string" },
		"https://schema.org/birthDate":                 { "type": "string" },
		"https://schema.org/email":                     { "type": "string" },
		"https://schema.org/telephone":                 { "type": "string" },
		"https://schema.org/gender":                    { "type": "string" },
		"https://schema.org/givenName":                 { "type": "string" },
		"https://schema.org/familyName":                { "type": "string" },
		"https://schema.org/additionalName":            { "type": "string" },
    "https://schema.org/taxID":                     { "type": "string" },
		"http://pn.schema.webshield.io/prop#sourceID":  { "type": "string" },
		"http://schema.org/address": { "$ref": "#/definitions/https://schema.org/PostalAddress" }
  },
  "required": [ "@id", "@type"]
}

*/

const JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id: ID,
  definitions: {
    'https://schema.org/PostalAddress': {
      type: 'object',
      title: 'https://schema.org/PostalAddress',
      properties: {
        '@id':        { type: 'string' },
        '@type': { type: 'array' },
        'https://schema.org/addressCountry':     { type: 'string' },
        'https://schema.org/addressLocality':    { type: 'string' },
        'https://schema.org/addressRegion':      { type: 'string' },
        'https://schema.org/postalCode':         { type: 'string' },
        'https://schema.org/postOfficeBoxNumber': { type: 'string' },
        'https://schema.org/streetAddress':      { type: 'string' }
      },
      required: ['@id', '@type']
    }
  },
  title: 'https://query.test.webshield.io.schema.webshield.io/type#Subject',
  type: 'object',
  properties: {
    '@id':        { type: 'string' },
    '@type':      { type: 'array' },
    'https://schema.org/deathDate':                 { type: 'string' },
    'https://schema.org/birthDate':                 { type: 'string' },
    'https://schema.org/email':                     { type: 'string' },
    'https://schema.org/telephone':                 { type: 'string' },
    'https://schema.org/gender':                    { type: 'string' },
    'https://schema.org/givenName':                 { type: 'string' },
    'https://schema.org/familyName':                { type: 'string' },
    'https://schema.org/additionalName':            { type: 'string' },
    'http://pn.schema.webshield.io/prop#sourceID':  { type: 'string' },
    'http://pn.schema.webshield.io/prop#subjectID': { type: 'string' },
    'https://schema.org/taxID':                     { type: 'string' },
    'https://schema.org/address': { $ref: '#/definitions/https://schema.org/PostalAddress' }
  },
  required: ['@id', '@type']
};

//
// Set the JSONLD_CONTEXT
// Copy the Base Subject Context and then add the necessary properties
//
let context = Object.assign({}, BaseSubjectPNDataModel.model.JSONLD_CONTEXT);
context.Subject = 'https://query.test.webshield.io.schema.webshield.io/type#Subject';
context.subjectID = 'https://pn.schema.webshield.io/prop#subjectID';
const JSONLD_CONTEXT = context;

//
// Create the TYPE and PROPERTY
//

// only add new types
const TYPE = {
  Subject: 'https://query.test.webshield.io.schema.webshield.io/type#Subject',
};

// only add new properties
const PROPERTY = {
  subjectID: 'https://pn.schema.webshield.io/prop#subjectID',
};

// -----
// Utils
//------

const utils = {

  createAddressNode: function createAddressNode(props) {
    return BaseSubjectPNDataModel.utils.createAddressNode(props);
  }
};

//---------
// make public
//-------------

const model = {
  ID: ID,
  VERSION: '0.1.0',
  JSON_SCHEMA: JSON_SCHEMA,
  JSONLD_CONTEXT: JSONLD_CONTEXT,
  PROPERTY: PROPERTY,
  TYPE: TYPE,
  SCHEMA_PREFIX: SCHEMA_PREFIX,
};

// -----
// Utils
//------

module.exports = {
  model:        model,
  utils:        utils,

  PROPERTY:     model.PROPERTY,
  TYPE:         model.TYPE
};
