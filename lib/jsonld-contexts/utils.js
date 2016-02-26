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
  contexts = new Map(),
  promises = {};

//called = 0;

//
// Create a map from the DataModel ID to a structue that has the filename that holds the context and if
// loaded the actual context
//
// Register the model id with a JSONLD Context
// *id the model id
// *name the Model Name, for example PNDataModel
function register(id, name) {
  'use strict';
  var file;

  assert(id, 'datamodel id param missing');
  assert(name, 'datamodel name param missing');

  file = path.join(__dirname, './' + name + 'Context.json');
  contexts.set(id, { filename: file, context: null });
}

// return a promise then will return the jsonld context
// *dataModelId to read context for
promises.getContext = function getContextPromise(dataModelId) {
  'use strict';
  assert(dataModelId, 'no dataModelId passed in');

  return new Promise(function (resolve, reject) {
    var item = contexts.get(dataModelId);

    if (!item) {
      return reject(new Error(util.format('Unknown dataModelId:%s in contexts:%s', dataModelId, contexts.size)));
    }

    if (!item.context) {
      loadContext(item.filename, function (err, context) {
        if (err) {
          return reject(new Error(util.format('error:%s reading file:%s', err, item.filename)));
        }

        if (!context) {
          return reject(new Error(util.format('no context:%j for item:%j', context, item)));
        }

        item.context = context;
        return resolve(item.context);
      });
    } else {
      return resolve(item.context);
    }
  });
};

//
// Load a context from a file
// *file - that path/filename
// *callback
//  **err
//  **context - the context as a json object
//
function loadContext(file, callback) {
  'use strict';

  //console.log('-----called:%s, loadContext-jsonLDFile: %s', called, file);
  fs.readFile(file, function (err, data) {
    var json = null;

    if (err) {
      //console.log('-----called:%s, loadContext-err:%j', called, err);
      return callback(err, null); // will not here barf as not sure how this happened.
    } else {
      try {
        json = JSON.parse(data);

        //console.log('-----called:%s, loadContext-jsonLDFile-passed-ok', called);
        return callback(null, json);
      } catch (error) {
        return callback(error, null);
      }
    }
  });
}

module.exports = {
  register: register,
  promises: promises
};
