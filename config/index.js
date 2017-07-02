"use strict";

var dotenv = require('dotenv').load();

module.exports = {
  // Service settings
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',

  clientAuthKey: process.env.CLIENT_AUTH_KEY || 'testkey',

  coinbaseApiKey: process.env.COINBASE_API_KEY,
  coinbaseApiSecret: process.env.COINBASE_API_SECRET
};
