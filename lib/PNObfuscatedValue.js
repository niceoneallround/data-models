/*

PN Obfuscated Values are used by the PN to capture both (1) the output from an Obfuscation Service,
and (2) the metadata needed to de-obfuscate the data. A Privacy Graph contains keys whose values are
Obfuscated Values.

Inside an PN Obfuscated Value often the data is represented as byte[], as this can be stored in a database or
transmitted across a wire, to avoid corruption it is encoded as base64.

A PN Obfuscated Value contains the following information
1.	Metadata need to decrypt
   a.	The @id of the privacy action instance that was used to obfuscate the data.
      This contains information needed to decrypt.
   b.	Any field level information that needs to be tracked by the PN to enable decryption.
      Often this is automatically tracked by the Obfuscation service output, for example the AWS Encryption output
      contain this information and the PN is not needed to track. But if the PN is required to track the
      following values can be tracked by the PN by passing them in the obfuscation result.
      i. A nonce that captures any randomness added to the obfuscation for example a field specific IV or salt.
      ii. Additional Authentication Data, if the algorithm is needs it.
2.	The obfuscated value, for example the output AWS Encryption, Ionic, token, etc

The data representation of PN Obfuscated Value is as follows
•	@type – the @id of the PAI used to encrypt – note has information on value format
•	@value – contains the output from the obfuscation service.
   - Byte[] outputs are represented as follows
     - base64(byte[]v)  - if no nonce or iv is being tracked by the PN
     - base64(byte[]nonce).base64(byte[]aad).base64(byte[]v)
     - base64(byte[]nonce)..base64(byte[]v) – no aad
     - .base64(byte[]aad).base64(byte[]v) – no nonce
  - string outputs are represented as a string

Examples
A property with one obfuscated value, no nonce or aad
{ https://schema.org/taxID: {
    @type: https://md.pn.id.webshield.io/paction_instance/com/acme#8828822,
    @value: “ABDBJKWHWJSK” },
 }

*/

const assert = require('assert');
const util = require('util');

let utils = {};

//
// create a PN Obfuscated value representation of encrypted data - see above for format
//
// pai: the pai instance @id
// v: the base64(byte[])
// props.n: [optional] nonce in base64(byte[])
// props.v: [optional] aad in base64(byte[])
//
utils.pack = function pack(pai, v, props) {
  'use strict';
  assert(pai, 'packOV: pai param missing');
  assert(v, 'packOV: v param missing');
  let ov = {};
  ov['@type'] = pai;

  if (!props) {
    ov['@value'] = v;
  } else {
    if (props.n) {
      if (props.aad) {
        ov['@value'] = props.n + '.' + props.aad + '.' + v;
      } else {
        ov['@value'] = props.n + '..' + v;
      }
    } else {
      if (props.aad) {
        ov['@value'] = '.' + props.aad + '.' + v;
      } else {
        assert(false, util.format('makeOV had unexpected props value:%j', props));
      }
    }
  }

  return ov;
};

//
// Break down a Obfuscated Value into
// type
// v: base64(byte[]) - a string
// n: base64(byte[]) - a string
// aad: base64(byte[]) - a string
//
//
utils.unpack = function unpack(ov) {
  'use strict';

  assert(ov, 'unpackOV: ov param missing');

  let result = {};
  result.type = ov['@type'];

  let t;
  if (util.isString(ov['@value'])) {
    t = ov['@value'].split('.');
  } else {
    assert(false, util.format('ov[@value] is not a string cannot process:%j', ov['@value']));
  }

  switch (t.length) {
    case 1: {
      result.v = t[0];
      break;
    }

    case 3: {
      if (t[0] !== '') {
        result.n = t[0];
      }

      if (t[1] !== '') {
        result.aad = t[1];
      }

      result.v = t[2];
      break;
    }

    default: {
      assert(false, util.format('ov[@value] has unexpected value cannot unpack:%s', ov['@value']));
    }
  }

  return result;
};

module.exports = {
  utils: utils
};