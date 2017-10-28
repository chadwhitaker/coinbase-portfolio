var config = require('./config');
var express = require('express');
var basicAuth = require('basic-auth');
var bodyParser = require('body-parser');
var coinbase = require('./helpers/coinbase.js');
var logger = require('morgan');
var request = require('request-promise');
var util = require('./helpers/util.js');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);
  if (!user || !user.name) {
    return unauthorized(res);
  };

  if (user.name === config.clientAuthKey && !user.pass) {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.get('/', function(req, res, next) {
  res.redirect('/portfolio');
});

app.get('/portfolio', auth, function(req, res, next) {
  var accounts = [];
  var menubar = [];
  var dropdown = [];
  var portfolio = {
    total: 0,
    currencies: [],
    prices: []
  };

  // TODO: Order wallets by balance after currency

  var prices = config.settings.currencyOrder.map(function (currency) {
    if (config.settings.currencyPair === currency) return false;

    return new Promise(function (resolve, reject) {
      coinbase.getSpotPrice({ currencyPair: currency + '-' + config.settings.currencyPair}).then(function (price) {
        portfolio.prices[currency] = price.data.amount;
        resolve();
      }).catch(function (error) {
        portfolio.prices[currency] = null;
        console.log(currency + ' price error:', error);
        resolve();
      });
    });
  });

  Promise.all(prices).then(function () {
    // Show pricing list in menubar
    config.settings.currencyMenubar.forEach(function (currency) {
      menubar.push((portfolio.prices[currency]) ? util.numbarFormat(portfolio.prices[currency], 0, 0) : '--');
    });
    menubar = menubar.join(' | ');

    return coinbase.getAccounts();
  }).then(function (_accounts) {
    accounts = _accounts;

    // Insert manually entered accounts
    if (config.settings.manualAccounts)
      accounts = accounts.concat(JSON.parse(config.settings.manualAccounts));

    // Process Blockchain based account
    if (config.settings.blockchainAccounts) {
      blockchainAccounts = JSON.parse(config.settings.blockchainAccounts).map(function (account) {
        return new Promise(function (resolve, reject) {
          var balance = 0;

          request({
            method: 'GET',
            url: 'https://blockchain.info/balance?active=' + account.wallets.join('|'),
            json: true
          }).then(function (blockchain) {
            for(var wallet in blockchain)
              balance += blockchain[wallet].final_balance;

            accounts.push({
              name: account.name,
              currency: account.currency,
              balance: {
                amount: balance / 100000000,
                currency: account.currency
              }
            });
            resolve();
          }).catch(function (error) {
            console.log(error);
            accounts.push({
              name: account.name,
              currency: account.currency,
              balance: {
                amount: null,
                currency: account.currency
              }
            });
            resolve();
          });
        });
      });

      return Promise.all(blockchainAccounts);
    }
  }).then(function () {
    var sortedAccounts = [];

    // Sort by `settings.currencyOrder`
    config.settings.currencyOrder.forEach(function (key) {
      accounts = accounts.filter(function (account) {
        if (account.currency == key) {
          sortedAccounts.push(account);
          return false;
        } else
          return true;
      });
    });

    // Concat any unlisted `settings.currencyOrder` currencies
    sortedAccounts = sortedAccounts.concat(accounts);

    sortedAccounts.forEach(function (account) {
      // Calculate native_balance for manually entered accounts
      if ((!account.native_balance || !account.native_balance.amount) && account.balance.amount) {
        account.native_balance = {
          amount: parseFloat(account.balance.amount) * portfolio.prices[account.currency]
        }
      }

      if (account.balance.amount > 0) {
        dropdown.push({
          title: account.name,
          value: '$' + util.numbarFormat(account.native_balance.amount)
        });

        portfolio.total += parseFloat(account.native_balance.amount);
      }
      else if (account.balance.amount == null) {
        dropdown.push({
          title: account.name,
          value: '--'
        });
      }

      // Create list of currencies for pricing list
      if (portfolio.currencies.indexOf(account.currency) <= -1) {
        portfolio.currencies.push(account.currency);
      }
    });

    // Display portfolio total at top of dropdown
    dropdown.unshift({
      title: 'Portfolio Total',
      value: '$' + util.numbarFormat(portfolio.total)
    });

    // List prices excluding prices already listed in menubar
    portfolio.currencies.forEach(function (currency) {
      if (!portfolio.prices[currency] || (config.settings.currencyMenubar.indexOf(currency) > -1)) return false;

      dropdown.push({
        title: currency + ' Price',
        value: (portfolio.prices[currency]) ? '$' + util.numbarFormat(portfolio.prices[currency]) : '--'
      });
    });

    res.json({
      menubar: menubar,
      title: 'Coinbase',
      dropdown: dropdown
    });
  }).catch(function (error) {
    console.log(error);
    res.sendStatus(500);
  });
});


if (!module.parent) {
  server = app.listen(config.port, config.host, function () {
    var port = server.address().port;
    var host = server.address().address;
    console.log('App listening at http://%s:%s', host, port);
  });
} else {
  module.exports = app;
}
