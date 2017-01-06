/*jslint node: true, vars: true */
/*

A syndicated subject is one that is created from more than one underlying subject graph.

A syndicated entity has the following properties
- an id unique to the necessary scope, usually a query request
-	type - syndicated entity
-	A pn data model id of the output subject graph produced from the underlying entities
-	An information model – how to create a syndicated entity from the source graphs
- job_id - the identity syndicate job id that produced the syndicated entity
-	Future can add linking information

Property, vertex, edge.

http://schema.org/name, https://id.webshield.io/com/aetna#23, https://schema.org/name
http://schema.org/address, https://id.webshield.io/com/atena#23, https://schema.org/address
https://experian.schema.webshield.io/firstName, https://id.webshield.io/com/aetna#23, https://aetna.schema.webshield.io/first_name

The information model has the instructions on how to create the subject of type
pn data model from the source subjects, it has information on properties and edges.

The syndicated entity information model maps the following
-	Properties – (syndEntityId, property) -> (vertex, property)
-	Edges – (syndEntityId, edge) - > (syndEntityId)

For example
(…synd#1, https://schema.org/familyName), (…aetna#23, https://schema.org/familyName)
(…synd#1, https://schema.org/taxID), (…experian#23, https://experian.schema…/taxID)
(…synd#1, https://schema.org/adddress, (address_synd#2)
(…address_synd#1, https://schema.org/postalCode),(aetna/addres#123, https://schema.org/postalAddress)

*/

const assert = require('assert');
const PNDataModel = require('./PNDataModel');
const PN_P = PNDataModel.PROPERTY;
const PN_T = PNDataModel.TYPE;
const util = require('util');

let utils = {};

utils.create = function create(id, props) {
  'use strict';
  assert(id, 'PNSyndicatedEntity - create - id param missing');
  assert(props, 'PNSyndicatedEntity - create - props param missing');
  assert(props.hostname, util.format('PNSyndicatedEntity - create - props.hostname param missing:%j', props));
  assert(props.pnDataModelId, util.format('PNSyndicatedEntity - create - props.dataModelId param missing:%j', props));
  assert(props.jobId, util.format('PNSyndicatedEntity - create - props.jobId param missing:%j', props));

  return {
    '@id': PNDataModel.ids.createSyndicatedEntityId(props.hostname, id),
    '@type': [PN_T.SyndicatedEntity],
    [PN_P.pnDataModel]: props.pnDataModelId,
    [PN_P.job]: props.jobId,
  };

};

module.exports = {
  create: utils.create
};
