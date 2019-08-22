'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./customer-datastore');
const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * GET /api/customers
 */
router.get('/', (req, res) => {

  model.list((err, entities) => {
    err ? res.sendStatus(err) : res.json({
      items: entities,
    });
  });
});

/**
 * GET /api/customers/:id
 */
router.get('/:id', (req, res) => {
  model.read(req.params.id, (err, entity) => {
    err ? res.sendStatus(err) : res.json(entity);
  });
});

module.exports = router;