'use strict';


var numbarFormat = function (value, minimumFractionDigits, maximumFractionDigits) {
  var minimumFractionDigits = typeof minimumFractionDigits !== 'undefined' ?  minimumFractionDigits : 2;
  var maximumFractionDigits = typeof maximumFractionDigits !== 'undefined' ?  maximumFractionDigits : 2;

  return parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits
  });
};


module.exports = {
  numbarFormat: numbarFormat
};
