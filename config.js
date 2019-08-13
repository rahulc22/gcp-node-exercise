'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = (module.exports = require('nconf'));
const path = require('path');

nconf
  // Command-line arguments
  .argv()
  // Environment variables
  .env(['NODE_ENV', 'PORT'])
  // Config file
  .file({file: path.join(__dirname, 'config.json')})
  // Defaults
  .defaults({
    PORT: 8080,
  });
