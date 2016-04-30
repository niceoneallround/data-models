/*jslint node: true, vars: true */
'use strict';

//
//  This file contains the canonical identity syndicate data model
//

var metaModel, model = {};

model.ID = 'http://is.pn.webshield.io.schema.webshield.io';
metaModel = require('./PNMetaModelFactory').create(model.ID);

model.URLS = {
  P:    model.ID + '/prop#',
  T:    model.ID + '/type#',
  SCHEMA_ORG:    'https//schema.org/'
};

model.PROPERTY = {
  givenName: model.URLS.SCHEMA_ORG + 'givenName'
};

model.TYPE = {
  Address:         model.URLS.SCHEMA_ORG + 'Address',
  Subject:         model.URLS.T + 'Subject'
};

module.exports = {
  ID: model.id,
  model: model,

  // MD about the properties and Types
  metaModel:    metaModel
};
