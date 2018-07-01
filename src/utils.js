/**
 * utils.js
 * 
 * Common helpers
 *  
 * @author Steven Oderayi <oderayi@gmail.com>
 */
const Utils = {};

Utils.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

Utils.formatCurrencyLocal = (value, symbol) => {
  symbol = symbol || '&#8358;';

  return `${symbol} ${(Number(value)).toLocaleString()}`;
};

Utils.formatDateTime = function (dateTimeString) {
  return new Date(dateTimeString).toLocaleString();
};

Utils.formatDate = function (dateTimeString) {
  return new Date(dateTimeString).toLocaleDateString();
};

Utils.toHashMap = function( arr, key ){
  return new Map(arr.map(i => [i[key], i]));
}

Utils.isElementInViewport = function(elem) {
  if (!elem) {
    console.error("Element is empty");
    return false;
  }
  const docViewTop = $(window).scrollTop();
  const docViewBottom = docViewTop + $(window).height();

  const elemTop = elem.offset().top;
  const elemBottom = elemTop + elem.height();

  return elemBottom <= docViewBottom && elemTop >= docViewTop;
};

module.exports = Utils;
