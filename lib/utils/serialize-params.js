/* eslint no-restricted-syntax: 0 */
/* eslint no-prototype-builtins: 0 */

/*
  This function gets an js objects and returns the params in a
  urlencode string, for example:
    input:
      {
        key1: val1,
        key2: "",
        key3: val3
      }
    return:
      "?key1=val1&key3=val3"
*/

const serialize = function (obj) {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  }
  return str.length ? `?${str.join('&')}` : '';
};

module.exports = serialize;
