/*jslint node: true, vars: true */

var assert = require('assert'),
    jsonldUtils = require('jsonld-utils/lib/jldUtils'),
    moment = require('moment'),
    PNDataModel = require('./PNDataModel'),
    PN_P = PNDataModel.PROPERTY,
    PN_T = PNDataModel.TYPE,
    util = require('util'),
    utils = {};

//-----------------------------
// Reference Source helpers
//----------------------------
utils.verifyRSSubjectQuery = function verifyRSSubjectQuery(rq, hostname) {
  'use strict';

  if (!rq) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('No rs subject query %s in input:%j', PN_T.RSSubjectQuery, rq)
    });
  }

  if (!rq['@id']) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR @id missing from:%j', rq)
    });
  }

  if (!((jsonldUtils.isType(rq, PN_T.RSSubjectQuery)))) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR type is not [%s] missing in:%j', PN_T.RSSubjectQuery, rq)
    });
  }

  if (!rq[PN_P.postBackUrl]) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR %s missing from:%j', PN_P.postBackUrl, rq)
    });
  }

  if (!rq[PN_P.subject]) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR %s missing from:%j', PN_P.subject, rq)
    });
  }

  return null;
};

//-----------------------
// RS Subject Query Result
//-----------------------
utils.createRSSubjectQueryResult = function createRSSubjectQueryResult(subjectQuery, hostname, resultSubjects) {
  'use strict';
  assert(subjectQuery, 'createRSSubjectQueryResult - subjectQuery param is nissing');
  assert(hostname, 'createRSSubjectQueryResult - hostname param is missing');

  var rsq = {}, result = [], i;

  // create subject query result node and add to set of nodes to send back
  rsq['@id'] = PNDataModel.ids.createMessageId(hostname, moment().unix());
  rsq['@type'] = PN_T.RSSubjectQueryResult;
  rsq[PN_P.respondingTo] = subjectQuery['@id'];
  result.push(rsq);

  // add the subject data to the results
  if (Array.isArray(resultSubjects)) {
    for (i = 0; i < resultSubjects.length; i++) {
      result.push(resultSubjects[i]);
    }
  } else if (resultSubjects) {
    result.push(resultSubjects);
  }

  return result;
};

module.exports = {
  utils: utils
};
