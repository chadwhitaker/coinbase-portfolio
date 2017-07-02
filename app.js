var config = require('./config');
var coinbase = require('./helpers/coinbase');
var basicAuth = require('basic-auth');
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({verify:function(req,res,buf){req.rawBody=buf}}));
app.use(bodyParser.urlencoded({ extended: false }));


var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'portfolio' && user.pass === config.clientAuthKey) {
    return next();
  } else {
    return unauthorized(res);
  };
};

var numbarFormat = function (value, minimumFractionDigits, maximumFractionDigits) {
  var minimumFractionDigits = typeof minimumFractionDigits !== 'undefined' ?  minimumFractionDigits : 2;
  var maximumFractionDigits = typeof maximumFractionDigits !== 'undefined' ?  maximumFractionDigits : 2;

  return value.toLocaleString('en-US', {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits
  });
};


app.get('/', function(req, res, next) {
  res.redirect('/portfolio');
});


app.get('/portfolio', auth, function(req, res, next) {
  var coinfolio = {
    coinbaseBalance: 0,
    coinbaseChange: {}
  };

  coinbase.getAccounts().then(function (accounts) {
    return accounts.forEach(function (account) {
      if (account.currency === 'BTC') {
        coinfolio.coinbaseBalance += parseFloat(account.balance.amount);
      }
    });
  }).then(function () {
    return coinbase.getSpotPrice({ 'qty': 1, 'currency': 'USD' }).then(function (price) {
      coinfolio.btcSpotPrice = price.amount;
      coinfolio.btcExit = (coinfolio.btcSpotPrice * coinfolio.coinbaseBalance);
    }).catch(function (error) {
      opbeat.captureError(new Error('Coinbase: ' + error));
    });
  }).then(function () {
    return coinbase.getHistoricPrices({ 'hours': 1, 'currency': 'USD' }).then(function (historic) {
      var price = coinfolio.btcSpotPrice - historic.prices.slice(-1)[0].price;
      if (price < 0) {
        coinfolio.coinbaseChange.hour = '$' + numbarFormat(price * -1) + ' ↓';
      } else  {
        coinfolio.coinbaseChange.hour = '$' + numbarFormat(price) + ' ↑';
      }
    });
  }).then(function () {
    return coinbase.getHistoricPrices({ 'hours': 25, 'currency': 'USD' }).then(function (historic) {
      var price = coinfolio.btcSpotPrice - historic.prices.slice(-1)[0].price;
      if (price < 0) {
        coinfolio.coinbaseChange.day = '$' + numbarFormat(price * -1) + ' ↓';
      } else  {
        coinfolio.coinbaseChange.day = '$' + numbarFormat(price) + ' ↑';
      }
    });
  }).then(function () {
    return coinbase.getHistoricPrices({ 'days': 7, 'currency': 'USD' }).then(function (historic) {
      var price = (coinfolio.btcSpotPrice - historic.prices.slice(-1)[0].price);
      if (price < 0) {
        coinfolio.coinbaseChange.week = '$' + numbarFormat(price * -1) + ' ↓';
      } else  {
        coinfolio.coinbaseChange.week = '$' + numbarFormat(price) + ' ↑';
      }
    });
  }).then(function () {
    return coinbase.getHistoricPrices({ 'days': 30, 'currency': 'USD' }).then(function (historic) {
      var price = (coinfolio.btcSpotPrice - historic.prices.slice(-1)[0].price);
      if (price < 0) {
        coinfolio.coinbaseChange.month = '$' + numbarFormat(price * -1) + ' ↓';
      } else  {
        coinfolio.coinbaseChange.month = '$' + numbarFormat(price) + ' ↑';
      }
    });
  }).then(function () {
    var output = {
      primary: numbarFormat(coinfolio.btcSpotPrice) + ' (' + coinfolio.coinbaseChange.hour + ')',
      title: 'Coinbase Portfolio',
      secondary: [
        {
          title: 'BTC Value',
          value: '$' + numbarFormat(coinfolio.btcExit)
        },
        {
          title: 'BTC Balance',
          value: numbarFormat(coinfolio.coinbaseBalance, 4, 4)
        },
        {
          title: 'Day Change',
          value: coinfolio.coinbaseChange.day
        },
        {
          title: 'Week Change',
          value: coinfolio.coinbaseChange.week
        },
        {
          title: 'Month Change',
          value: coinfolio.coinbaseChange.month
        }
      ]
    };

    res.json(output);
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
