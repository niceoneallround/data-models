/*jslint node: true, vars: true */
'use strict';

var AccepttoPnDataModel = require('./AccepttoPnDataModel'),
  ACCEPTTO_P = AccepttoPnDataModel.PROPERTY,
  PrivacyPNDataModel = require('./PrivacyPNDataModel'),
  CANON_DATA,
  utils = {};

CANON_DATA = {
  out: {
    jobId: 'out-job-id',
    processId:   'out-process-id'
  },

  in: {
    jobId: 'in-job-id',
    processId:   'in-process-id'
  },
};

// create an example outbound encrypt metadata
utils.createOutboundEncryptMetadata = function createOutboundEncryptMetadata() {
  var md, props;

  props = {
    mType: 'AES_256',
    mDomainName: 'ionic.com',
    domainName: 'aetna.com'
  };

  md = PrivacyPNDataModel.utils.createEncryptMetadata(props);

  md[ACCEPTTO_P.processId] = CANON_DATA.out.processId;
  md[ACCEPTTO_P.outboundJobId] = CANON_DATA.out.jobId;
  return md;
};

// create an example Inbound encrypt metadata
utils.createInboundEncryptMetadata = function createInboundEncryptMetadata() {
  var md, props;

  props = {
    mType: 'AES_256',
    mDomainName: 'ionic.com',
    domainName: 'experian.com'
  };

  md = PrivacyPNDataModel.utils.createEncryptMetadata(props);

  md[ACCEPTTO_P.processId] = CANON_DATA.in.processId;
  md[ACCEPTTO_P.inboundJobId] = CANON_DATA.in.jobId;
  return md;
};

module.exports = {
  CANON_DATA: CANON_DATA,
  utils: utils
};
