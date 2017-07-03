'use strict';

var config = require('../config');
var coinbaseApi = require('coinbase').Client;
var coinbase = new coinbaseApi({'apiKey': config.coinbaseApiKey, 'apiSecret': config.coinbaseApiSecret});


var getAccounts = function (params) {
  params = (params) ? params : {};
  return new Promise(function(resolve, reject) {
    coinbase.getAccounts(params, function(error, result) {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

var getSpotPrice = function(params) {
  return new Promise(function(resolve, reject) {
    coinbase.getSpotPrice(params, function(error, result) {
      if (error) reject(error);
      else resolve(result);
    });
  });
};


module.exports = {
  getAccounts: getAccounts,
  getSpotPrice: getSpotPrice
};
