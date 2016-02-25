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

//called = 0;

//
// Create a map from the DataModel ID to a structue that has the filename that holds the context and if
// loaded the actual context
//
file = path.join(__dirname, './PNDataModelContext.json');
contexts.set(PnDataModelID, { filename: file, context: null });

// return a promise then will return the jsonld context
// *dataModelId to read context for
function getContextPromise(dataModelId) {
  'use strict';
  assert(dataModelId, 'no dataModelId passed in');

  return new Promise(function (resolve) {
    var item = contexts.get(dataModelId);
    assert(item, util.format('Unknown dataModelId:%s', dataModelId));

    if (!item.context) {
      //console.log('-----calling loadContext: called:%s', called);
      loadContext(item.filename, function (err, context) {
        /*console.log('-----increasing call by 1 from:%s', called);
        called = called + 1;
        console.log('-----increased call by 1 to:%s', called);
        console.log('-----called:%s, err:%j', called, err);
        console.log('-----called:%s, context:%j', called, context);
        console.log('-----called:%s, context:%s', called, (context !== null));
        console.log('-----called:%s, asserting on err', called);*/
        assert(!err, util.format('error:%j reading file:%s', err, item.filename));
        assert(context, util.format('no context:%j for item:%j', context. item));
        item.context = context;

        //console.log('-----called:%s, callin resolve', called);
        resolve(item.context);
      });
    } else {
      resolve(item.context);
    }
  });
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
  getContextPromise: getContextPromise
};
