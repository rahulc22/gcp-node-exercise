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

module.exports = {
  read,
  list
};
