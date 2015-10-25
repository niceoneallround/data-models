/*jslint node: true, vars: true */
'use strict';

var CANON_DATA;

CANON_DATA = {
  // alice general
  aliceBirthDate:     '09/29/1986',
  aliceDOD:           '09/29/2089',
  aliceGender:        'F',
  aliceSSN:           'alice_SSN',

  // alice name data
  aliceGivenName:     'Alice',
  aliceFamilyName:    'Ardvark',

  // alice address data
  aliceAddressLine1:    '645 Battery Street',
  aliceAddressLine2:    '2nd floor',
  aliceCity:            'Las Vegas',
  aliceState:           'NV',
  aliceZip5:            '80092',

  // bob general
  bobBirthDate:       '01/29/1971',
  bobDeathDate:       '01/29/2015',
  bobGender:          'M',
  bobSSN:             'bob_SSN',

  // bob name data
  bobGivenName:       'Bob',
  bobFamilyName:      'Smith',

  // bob address data
  bobAddressLine1:    '645 Harrison Street',
  bobAddressLine2:    '2nd floor',
  bobCity:            'San Francisco',
  bobState:           'CA',
  bobZip5:            '94123'
};

module.exports = {
  CANON_DATA: CANON_DATA
};
