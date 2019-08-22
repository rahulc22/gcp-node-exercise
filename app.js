'use strict';

const path = require('path');
const express = require('express');
const app = express();

app.use('/api/customers', require('./customers/customer-api'));

// Redirect root to /api/customers
app.get('/', (req, res) => {
  res.redirect('/api/customers');
});

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Customer not Found');
});

// Basic Error handler
app.use((err, req, res) => {
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
    const server = app.listen(8080);
}

module.exports = app;