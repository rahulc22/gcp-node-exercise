'use strict';

const {Datastore} = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';

/**
 * Datastore's entity format 
 */
function fromDatastore(obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

/**
 * Lists all customers
 */
function list(cb) {
  const q = ds
    .createQuery([kind])
    .order('custid');
    ds.runQuery(q, (err, entities) => {
    err ? cb('500') : cb(null, entities.map(fromDatastore));
  });
}

/**
 * Lists customer for given id
 */
function read(id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);
  ds.get(key, (err, entity) => {
    (!err && !entity) ? cb(404) : cb(null, fromDatastore(entity));
  });
}

module.exports = {
  read,
  list
};