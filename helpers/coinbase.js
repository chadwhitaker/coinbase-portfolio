'use strict';

var config = require('../config');
var promise = require('bluebird');
var coinbaseApi = require('coinbase').Client;
var coinbase = new coinbaseApi({'apiKey': config.coinbaseApiKey, 'apiSecret': config.coinbaseApiSecret});


function getAccounts(params) {
  params = (params) ? params : {};
  return new promise(function(resolve, reject) {
    coinbase.getAccounts(params, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

function getSpotPrice(params) {
  params = (params) ? params : { currency : 'USD' };
  return new promise(function(resolve, reject) {
    coinbase.getSpotPrice(params, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.data);
      }
    });
  });
};

function getHistoricPrices(params) {
  params = (params) ? params : { currency : 'USD' };
  return new promise(function(resolve, reject) {
    coinbase.getHistoricPrices(params, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.data);
      }
    });
  });
};


module.exports = {
  getAccounts: getAccounts,
  getSpotPrice: getSpotPrice,
  getHistoricPrices: getHistoricPrices
};
