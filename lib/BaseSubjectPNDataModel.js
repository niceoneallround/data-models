/*jslint node: true, vars: true */
'use strict';

const assert = require('assert');
const PNDataModel = require('../lib/PNDataModel');

/*

The connectors load and syndicate subject data. THis defines a base subject that
can be used as is or can be subclassed if need to add more properties.

It is based on https://schema.org and adds some PN specific properties such as sourceID.

The following are defined
- a globally unique data_model id
- the JSON_SCHEMA
- constants for the JSONLD expanded types and property names
*/

const ID = 'https://pn.id.webshield.io/data_model/io/webshield/base_subject_pn_data_model';

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
	"title": "http://pn.schema.webshield.io/type#Subject",
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
    "http://pn.schema.webshield.io/prop#taxID":     { "type": "string" },
		"http://pn.schema.webshield.io/prop#sourceID":  { "type": "string" },
		"http://schema.org/address": { "$ref": "#/definitions/https://schema.org/PostalAddress" }
  },
  "required": [ "@id", "@type", "http://pn.schema.webshield.io/prop#sourceID"]
}

*/

const JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id: 'http://subject.pn.schema.webshield.io',
  definitions: {
    'https://schema.org/PostalAddress': {
      type: 'object',
      title: 'http://schema.org/PostalAddress',
      properties: {
        '@type': { type: 'array' },
        'https://schema.org/addressCountry':     { type: 'string' },
        'https://schema.org/addressLocality':    { type: 'string' },
        'https://schema.org/addressRegion':      { type: 'string' },
        'https://schema.org/postalCode':         { type: 'string' },
        'https://schema.org/postOfficeBoxNumber': { type: 'string' },
        'https://schema.org/streetAddress':      { type: 'string' }
      },
      required: ['@type']
    }
  },
  title: 'http://pn.schema.webshield.io/type#Subject',
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
    'https://schema.org/taxID':                     { type: 'string' },
    'http://pn.schema.webshield.io/prop#taxID':     { type: 'string' },
    'http://pn.schema.webshield.io/prop#sourceID':  { type: 'string' },
    'http://schema.org/address': { $ref: '#/definitions/https://schema.org/PostalAddress' }
  },
  required: ['@id', '@type', 'http://pn.schema.webshield.io/prop#sourceID']
};

//
const JSONLD_CONTEXT = {

  id: '@id',
  type: '@type',

  PN_P:     'http://pn.schema.webshield.io/prop#',
  PN_T:     'http://pn.schema.webshield.io/type#',
  schema: 'https://schema.org/',

  address:              'schema:address',
  addressCountry:       'schema:addressCountry',
  addressLocality:      'schema:addressLocality',
  addressRegion:        'schema:addressRegion',
  additionalName:       'schema:additionalName',
  birthDate:            'schema:birthDate',
  deathDate:            'schema:deathDate',
  description:          'schema:description',
  email:                'schema:email',
  telephone:            'schema:telephone',
  gender:               'schema:gender',
  givenName:            'schema:givenName',
  familyName:           'schema:familyName',
  postalCode:           'schema:postalCode',
  postOfficeBoxNumber:  'schema:postOfficeBoxNumber',
  sourceID:             'PN_P:sourceID',
  taxID:                'schema:taxID',

  PostalAddress: 'schema:PostalAddress',
  Subject:       'PN_T:Subject',

};

const TYPE = {
  // If the attributes of this subject are enough then can use. Note the subjects
  // provenance comes from the JWT not from the model.
  Subject: 'http://pn.schema.webshield.io/type#Subject',

  // schema.org types
  Person: 'https://schema.org/Person',
  PostalAddress: 'https://schema.org/PostalAddress',
};

const PROPERTY = {
  // https://schema.org/Person
  deathDate: 'https://schema.org/deathDate',
  birthDate: 'https://schema.org/birthDate',
  email: 'https://schema.org/email',
  telephone: 'https://schema.org/telephone',
  gender: 'https://schema.org/gender',
  givenName: 'https://schema.org/givenName',
  familyName: 'https://schema.org/familyName',
  additionalName: 'https://schema.org/additionalName',
  taxID:   'https://schema.org/taxID',

  // https://schema.org/PostalAddress
  address: 'http://schema.org/address',
  addressCountry: 'https://schema.org/addressCountry',
  addressLocality: 'https://schema.org/addressLocality',
  addressRegion: 'https://schema.org/addressRegion',
  postalCode: 'https://schema.org/postalCode',
  postOfficeBoxNumber: 'https://schema.org/postOfficeBoxNumber',
  streetAddress:   'https://schema.org/streetAddress',

  // pn specfific
  sourceID: 'http://pn.schema.webshield.io/prop#sourceID',

};

// -----
// Utils
//------

function createAddressNodeId(props) {
  assert(props, 'createAddressNodeId: props param missing');
  assert(props.domainName, 'createAddressNodeId: props.domainName param missing');
  assert(props.idValue, 'createAddressNodeId: props.idValue param missing');
  return PNDataModel.ids.createExternalId(props.domainName, props.idValue, 'address');
}

const utils = {

  createAddressNode: function createAddressNode(props) {
    return {
      '@id': createAddressNodeId(props),
      '@type': [TYPE.PostalAddress], };
  }
};

//
// CANON DATA
//

let canons = {};

canons.data = {
  alice: {
    id:         'https://id.webshield.io/com/abc/alice_abc',
    givenName:  'alice',
    familyName: 'Smith',
    sourceID:   'alice_abc',
    taxID:      'alice_abc_ssn',
    address: {
      idValue: '1',
      postalCode: '94123'
    }
  },

  bob: {
    id:         'https://id.webshield.io/com/abc/bob_abc',
    givenName:  'bob',
    familyName: 'Adrvark',
    sourceID:   'bob_abc',
    taxID:      'bob_abc_ssn',
    address: {
      idValue: '2',
      postalCode: '94107'
    }
  }
};

function createCanonSubject(s, props) {
  let t = {};
  t['@id'] = s.id;
  t['@type'] = TYPE.Subject;
  t[PROPERTY.sourceID] = s.sourceID;
  t[PROPERTY.taxID] = s.taxID;

  t[PROPERTY.address] = utils.createAddressNode({
    domainName: props.domainName,
    idValue: s.address.idValue,
  });

  t[PROPERTY.address][PROPERTY.postalCode] = s.address.postalCode;

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
