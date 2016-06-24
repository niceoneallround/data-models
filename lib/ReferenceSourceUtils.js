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
utils.verifyRSSubjectQuery = function verifyRSSubjectQuery(query, hostname) {
  'use strict';

  var rq = null, subject = null;

  if ((query) && (query.subjectQuery)) {
    rq = query.subjectQuery;
  }

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

  if (!rq[PN_P.job]) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR %s missing from:%j', PN_P.job, rq)
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

  if ((query) && (query.subject)) {
    subject = query.subject;
  }

  if (!subject) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR no subject in the graph missing the query is:%j', PN_P.subject, rq)
    });
  }

  if (subject['@id'] !== rq[PN_P.subject]) {
    return PNDataModel.errors.createTypeError({
      id: PNDataModel.ids.createErrorId(hostname, moment().unix()),
      errMsg: util.format('ERROR the subject with @id<%s> in the query does not match the one in the subject:<%s>',
                rq[PN_P.subject], subject['@id'])
    });
  }

  return null;
};

//-----------------------
// RS Subject Query Result
//-----------------------
utils.createRSSubjectQueryResult = function createRSSubjectQueryResult(subjectQuery, hostname, resultSubject) {
  'use strict';
  assert(subjectQuery, 'createRSSubjectQueryResult - subjectQuery param is nissing');
  assert(hostname, 'createRSSubjectQueryResult - hostname param is missing');

  var rsq = {}, result = [];
  rsq['@id'] = PNDataModel.ids.createMessageId(hostname, moment().unix());
  rsq['@type'] = PN_T.RSSubjectQueryResult;
  rsq[PN_P.job] = subjectQuery[PN_P.job];
  result.push(rsq);

  // if there was a match then then result subject is passed in otherwise none
  if (resultSubject) {
    rsq[PN_P.subject] = resultSubject['@id'];
    result.push(resultSubject);
  }

  return result;
};

module.exports = {
  utils: utils
};
