/*jslint node: true, vars: true */
'use strict';

//
//
// Factory for creating the MetaModel container for PN Data Models.
//
// The MetaModel contains metadaya about the JSON-LD PN Data Model
// types and properties. The key is the PROPERTY.xyz URL or the
// TYPE.xyz URL and a descriptor for that property or type is returned.
//
// Thoughts
// - there is overlap with JSONLD @context but have not yet resolved,
// maybe generate from @context.
// - this can be converted to RDF/OWL later stage
//
// For a property record the following information
// - if contains an Object or a Value
//
//
// DESIGN NOTE - playing around with classes - the state seems interesting
//
var PROPERTY, TYPE, URLS, ID;

ID = 'http://metamodel.pn.schema.webshield.io';

URLS = {
  P:    ID + '/prop#',
  T:    ID + '/type#'
};

PROPERTY = {
  propertyType:             URLS.P + 'property_type'
};

TYPE = {
  PropertyMetadata:         URLS.T + 'PropertyMetadata',
  TypeMetadata:             URLS.T + 'PropertyType',

  ValuePropertyMetadata:    '1',
  ObjectPropertyMetadata:   '2'
};

class MetaModel {

  constructor(id) {
    this.dataModelId = id;
    this.map = new Map();
  }

  getDataModelId() {
    return this.dataModelId;
  }

  // *id is the PROPERTY.xyz URL
  addObjectPropertyDescriptor(id) {
    var md = {};
    md['@id'] = id;
    md['@type'] = TYPE.PropertyMD;
    md[PROPERTY.propertyType] = TYPE.ObjectPropertyMetadata;
    md.isType = function () { return false; };

    md.isObjectProperty = function () { return true; };

    md.isValueProperty = function () { return false; };

    this.map.set(id, md);
    return md;
  }

  // *id is the PROPERTY.xyz URL
  addValuePropertyDescriptor(id) {
    var md = {};
    md['@id'] = id;
    md['@type'] = TYPE.PropertyMD;
    md[PROPERTY.propertyType] = TYPE.ValuePropertyMetadata;
    md.isType = function () { return false; };

    md.isObjectProperty = function () { return false; };

    md.isValueProperty = function () { return true; };

    this.map.set(id, md);
    return md;
  }

  // *id is the TYPE.xyz URL
  addTypeDescriptor(id) {
    var md = {};
    md['@id'] = id;
    md['@type'] = TYPE.TypeMD;

    md.isType = function () { return true; };

    md.isObjectProperty = function () { return false; };

    md.isValueProperty = function () { return false; };

    this.map.set(id, md);
    return md;
  }

  getMd(id) {
    return this.map.get(id);
  }
}

function createMetaModel(id) {
  return new MetaModel(id);
}

module.exports = {
  create: createMetaModel
};
