/*jslint node: true, vars: true */
'use strict';

/*

The PN Data Model used by the Test Reference Source to exercise the mapping.

It extends the base subject data model as follows
1. Adds its own Subject Type
2. Adds a custom property transactionID
3. Its @id and sourceID are already globally unique so does not use the PN id.webshield.io/com/... pattern

FUTURE
  - add the TaxIDValidEnum

*/

const BaseSubjectPNDataModel = require('./BaseSubjectPNDataModel');
const BASE_P = BaseSubjectPNDataModel.PROPERTY;

// ID is used in the PN resource
const ID = 'https://md.pn.id.webshield.io/pndatamodel/io/webshield/test/rs#subject_records';

// Used to prefix types and props that are specific to this schema
const SCHEMA_PREFIX = 'https://rs.test.webshield.io.schema.webshield.io';

/*

CAN BE PASTED INTO A ONLINE VALIDATOR

{
	"$schema": "http://json-schema.org/draft-04/schema#",
	"id": "http://subject.pn.schema.webshield.io",
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
	"title": "https://rs.test.webshield.io.schema.webshield.io/type#Subject",
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
    "https://rs.test.webshield.io.schema.webshield.io/prop#transactionID": { "type": "string" },
		"http://pn.schema.webshield.io/prop#sourceID":  { "type": "string" },
		"http://schema.org/address": { "$ref": "#/definitions/https://schema.org/PostalAddress" }
  },
  "required": [ "@id", "@type", "http://pn.schema.webshield.io/prop#sourceID"]
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
  title: 'https://rs.test.webshield.io.schema.webshield.io/type#Subject',
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
    'https://schema.org/taxID':                     { type: 'string' },
    'https://rs.test.webshield.io.schema.webshield.io/prop#transactionID':  { type: 'string' },
    'https://schema.org/address': { $ref: '#/definitions/https://schema.org/PostalAddress' }
  },
  required: ['@id', '@type', 'http://pn.schema.webshield.io/prop#sourceID']
};

//
// Set the JSONLD_CONTEXT
// Copy the Base Subject Context and then add the necessary properties
//
let context = Object.assign({}, BaseSubjectPNDataModel.model.JSONLD_CONTEXT);
context.Subject = 'https://rs.test.webshield.io.schema.webshield.io/type#Subject';
context.transactionID = 'https://rs.test.webshield.io.schema.webshield.io/prop#transactionID';
const JSONLD_CONTEXT = context;

//
// Create the TYPE and PROPERTY
//

// only add new types
const TYPE = {
  Subject: 'https://rs.test.webshield.io.schema.webshield.io/type#Subject',
};

// only add new properties
const PROPERTY = {
  transactionID: 'https://rs.test.webshield.io.schema.webshield.io/prop#transactionID',
};

// -----
// Utils
//------

const utils = {

  createAddressNode: function createAddressNode(props) {
    return BaseSubjectPNDataModel.utils.createAddressNode(props);
  }
};

//
// CANON DATA
//

let canons = {};

// Notes
// - The @id is already globally unique so no need to use the PN pattern
// - the sourceID actually holds the @id which is legal, if was not a URL then the code would make the @id a PN globally unique pattern
canons.data = {
  alice: {
    id:         'https://test.rs.webshield.io/memberId/alice_abc',
    givenName:  'alice',
    familyName: 'Smith',
    sourceID:   'https://test.rs.webshield.io/memberId/alice_abc',
    taxID:      'alice_abc_ssn',
    transactionID: 'alice_transactionId',
    address: {
      idValue: '1',
      postalCode: '94123'
    }
  },

  bob: {
    id:         'https://test.rs.webshield.io/memberId/bob_abc',
    givenName:  'bob',
    familyName: 'Adrvark',
    sourceID:   'https://test.rs.webshield.io/memberId/bob_abc',
    taxID:      'bob_abc_ssn',
    transactionID: 'bob_transactionId',
    address: {
      idValue: '2',
      postalCode: '94107'
    }
  }
};

//
// The props needs to contain following information used by address
// props.domainName - used when creating address @id
// props.idValue - used when creating addrees @id
//
function createCanonSubject(s, props) {
  let t = {};
  t['@id'] = s.id;
  t['@type'] = TYPE.Subject;
  t[BASE_P.givenName] = s.givenName;
  t[BASE_P.familyName] = s.familyName;
  t[BASE_P.sourceID] = s.sourceID;
  t[BASE_P.taxID] = s.taxID;
  t[PROPERTY.transactionID] = s.transactionID;

  t[BASE_P.address] = utils.createAddressNode({
    domainName: props.domainName,
    idValue: s.address.idValue,
  });

  t[BASE_P.address][BASE_P.postalCode] = s.address.postalCode;

  return t;
}

canons.createAlice = function createAlice(props) {
  return createCanonSubject(canons.data.alice, props);
};

canons.createBob = function createBob(props) {
  return createCanonSubject(canons.data.bob, props);
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
  canons:       canons,
  model:        model,
  utils:        utils,

  PROPERTY:     model.PROPERTY,
  TYPE:         model.TYPE
};
