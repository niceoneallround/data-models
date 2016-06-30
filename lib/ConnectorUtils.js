/*jslint node: true, vars: true */

var assert = require('assert'),
    jsonldUtils = require('jsonld-utils/lib/jldUtils'),
    moment = require('moment'),
    PNDataModel = require('./PNDataModel'),
    PN_T = PNDataModel.TYPE,
    PrivacyPNDataModel = require('./PrivacyPNDataModel'),
    util = require('util'),
    utils = {};

//-----------------------------
// Connector helpers that are used across services
//----------------------------

//-------------------------
// Provision helpers
//-------------------------

//
// Verify Provision
//
utils.verifyProvision = function verifyProvision(rq, hostname) {
  'use strict';

  if (!rq) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR no %s passed in request', PN_T.Provision)
    });
  }

  if (!rq['@id']) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR @id missing from:%j', rq)
    });
  }

  if (!((jsonldUtils.isType(rq, PN_T.Provision)))) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR type is not [%s] missing in:%j', PN_T.Provision, rq)
    });
  }

  return null;
};

//
// Create a Provision that is associaed with a pipe
// request. See the README.md for properties.
//
utils.createProvision = function createProvision(serviceCtx, pvRq) {
  'use strict';
  assert(serviceCtx.config, 'serviceCtx.config param missing');
  assert(serviceCtx.config.getHostname(), util.format('hostname is not in config:%j', serviceCtx.config));

  return PrivacyPNDataModel.utils.createProvision(serviceCtx.config.getHostname(), pvRq);
};

module.exports = {
  utils: utils
};
