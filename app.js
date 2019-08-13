'use strict';

const path = require('path');
const express = require('express');
const config = require('./config');

const app = express();

// Customers API
app.use('/api/customers', require('./customers/customer-api'));

// Redirect root to /api/customers
app.get('/', (req, res) => {
  res.redirect('/api/customers');
});

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  const server = app.listen(config.get('PORT'), () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
