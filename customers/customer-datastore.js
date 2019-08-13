'use strict';

const {Datastore} = require('@google-cloud/datastore');

// Datastore config
const ds = new Datastore();
const kind = 'Customer';


// Datastore's entity format to format expected by the application.
function fromDatastore(obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

// Translates from the application's format to the datastore's entity format
function toDatastore(obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach(k => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
    });
  });
  return results;
}

// Lists all customers in the Datastore (no explicit limit)
function list(token, cb) {
  const q = ds
    .createQuery([kind])
    .start(token)
    .order('custid');
  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    const hasMore =
      nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
        ? nextQuery.endCursor
        : false;
    cb(null, entities.map(fromDatastore), hasMore);
  });
}


// Creates a new customer or updates an existing customer with new data.
function update(id, data, cb) {
  let key;
  if (id) {
    key = ds.key([kind, parseInt(id, 10)]);
  } else {
    key = ds.key(kind);
  }

  const entity = {
    key: key,
    data: toDatastore(data, ['description']),
  };

  ds.save(entity, err => {
    data.id = entity.key.id;
    cb(err, err ? null : data);
  });
}


function create(data, cb) {
  update(null, data, cb);
}

function read(id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);
  ds.get(key, (err, entity) => {
    if (!err && !entity) {
      err = {
        code: 404,
        message: 'Not found',
      };
    }
    if (err) {
      cb(err);
      return;
    }
    cb(null, fromDatastore(entity));
  });
}

function _delete(id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);
  ds.delete(key, cb);
}

module.exports = {
  create,
  read,
  update,
  delete: _delete,
  list,
};


/*
// Lists all customers in the Datastore (with explicit defined limit)
function list(limit, token, cb) {
  const q = ds
    .createQuery([kind])
    .limit(limit)
    .start(token)
    .order('custid');
  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    const hasMore =
      nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
        ? nextQuery.endCursor
        : false;
    cb(null, entities.map(fromDatastore), hasMore);
  });
}
*/
