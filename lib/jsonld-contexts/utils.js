/*jslint node: true, vars: true */

//
// Provide access to the json-ld contexts by datamodel id.
//
// Caches them
//

var assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  PnDataModelID = require('../PNDataModel').ID,
  contexts = new Map(),
  file;

//
// Create a map from the DataModel ID to a structue that has the filename that holds the context and if
// loaded the actual context
//
file = path.join(__dirname, './PNDataModelContext.json');
contexts.set(PnDataModelID, { filename: file, context: null });

//
// Return the jsonld context for the dataModelId
//
// *dataModelId to read context for
// *callback
//  **err
//  **jsonld context object
function getContext(dataModelId, callback) {
  'use strict';
  var item;

  assert(dataModelId, 'no dataModelId passed in');
  assert(callback, 'no callback passed in');

  item = contexts.get(dataModelId);
  assert(item, util.format('Unknown dataModelId:%s', dataModelId));

  if (!item.context) {
    loadContext(file, function (err, context) {
      assert(!err, util.format('error reading file:%j - error:%j', item, err));
      assert(context, util.format('no context read for item:%j', item));
      item.context = context;
      return callback(err, context);
    });
  } else {
    return callback(null, item.context);
  }
}

//
// Load a context from a file
// *file - that path/filename
// *callback
//  **err
//  **context - the context as a json object
//
function loadContext(file, callback) {
  'use strict';

  //console.log('jsonLDFile: %s', file);
  fs.readFile(file, function (err, data) {
    var json = null;

    if (err) {
      return callback(err, null); // will not here barf as not sure how this happened.
    } else {
      try {
        json = JSON.parse(data);
        return callback(null, json);
      } catch (error) {
        return callback(error, null);
      }
    }
  });
}

module.exports = {
  getContext: getContext
};
