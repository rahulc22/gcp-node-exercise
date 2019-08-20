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
