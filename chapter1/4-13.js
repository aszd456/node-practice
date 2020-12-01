/* url parse */
const url = require('url');
const myURL = url.parse('https://www.google.com/?q=node.js');
console.log(myURL);

/* WHATWG URL API */
const {URL} = require('url');
const myWHATWGURL = new URL('https://www.google.com/?q=node.js');
console.log(myWHATWGURL);