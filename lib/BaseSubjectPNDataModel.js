/*jslint node: true, vars: true */
'use strict';

const jsonldUtils = require('jsonld-utils/lib/jldUtils');

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

const JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id: 'http://subject.pn.schema.webshield.io',
  'http//json-schema.org/title': 'http://pn.schema.webshield.io/type#Subject',
  'http://json-schema.org/type': 'object',
  'http://json-schema.org/properties': {
    '@id': { 'http://json-schema.org/type': 'string' },
    '@type': { 'http://json-schema.org/type': 'array' },
    'https://schema.org/deathDate': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/birthDate': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/email': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/telephone': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/gender': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/givenName': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/familyName': { 'http://json-schema.org/type': 'string' },
    'https://schema.org/additionalName': { 'http://json-schema.org/type': 'string' },
    'http://schema.org/address': {
      'http//json-schema.org/title': 'http://schema.org/PostalAddress',
      'http://json-schema.org/type': 'object',
      'http://json-schema.org/properties': {
        '@type': { 'http://json-schema.org/type': 'array' },
        'https://schema.org/addressCountry': { 'http://json-schema.org/type': 'string' },
        'https://schema.org/addressLocality': { 'http://json-schema.org/type': 'string' },
        'https://schema.org/addressRegion': { 'http://json-schema.org/type': 'string' },
        'https://schema.org/postalCode': { 'http://json-schema.org/type': 'string' },
        'https://schema.org/postOfficeBoxNumber': { 'http://json-schema.org/type': 'string' },
        'https://schema.org/streetAddress': { 'http://json-schema.org/type': 'string' }
      } // address properties
    }, // address
    'https://schema.org/taxID': { 'http://json-schema.org/type': 'string' },
    'http://pn.schema.webshield.io/prop#sourceID': { 'http://json-schema.org/type': 'string' },
  } // properties
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

const utils = {

  createAddressNode: function createAddressNode() {
    return jsonldUtils.createBlankNode({ '@type': TYPE.PostalAddress });
  },

};

module.exports = {
  model:        model,
  utils:        utils,

  PROPERTY:     model.PROPERTY,
  TYPE:         model.TYPE
};
