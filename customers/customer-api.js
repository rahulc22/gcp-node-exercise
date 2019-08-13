'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./customer-datastore');

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());


/**
 * GET /api/customers
 * Retrieves 'all' customers.
 */
router.get('/', (req, res, next) => {
  model.list(req.query, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: entities,
    });
  });
});


/**
 * POST /api/customers
 * Create a new customer.
 */
router.post('/', (req, res, next) => {
  model.create(req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});


/**
 * GET /api/customers/:id
 * Retrieves a given customer.
 */
router.get('/:customers', (req, res, next) => {
  model.read(req.params.customers, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * PUT /api/customers/:id
 * Updates a given customer.
 */
router.put('/:customers', (req, res, next) => {
  model.update(req.params.customers, req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * DELETE /api/customers/:id
 * Deletes a given customer.
 */
router.delete('/:customers', (req, res, next) => {
  model.delete(req.params.customers, err => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).send('OK');
  });
});

/**
 * Errors on "/api/customers /*" routes.
 */
router.use((err, req, res, next) => {
  err.response = {
    message: err.message,
    internalCode: err.code,
  };
  next(err);
});

module.exports = router;

/**
 * GET /api/customers
 * Retrieves 'all' customers with explicit limit for a page.
 */
// router.get('/', (req, res, next) => {
//   model.list(10, req.query.pageToken, (err, entities, cursor) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.json({
//       items: entities,
//       nextPageToken: cursor,
//     });
//   });
// });