const util = require('util');

console.log(util.types.isStringObject('foo'));  // Returns false
console.log(util.types.isStringObject(new String('foo')));   // Returns true

console.log(util.types.isArrayBuffer(new ArrayBuffer()));  // Returns true
console.log(util.types.isArrayBuffer(new SharedArrayBuffer()));  // Returns false

console.log(util.types.isAnyArrayBuffer(new ArrayBuffer()));  // Returns true
console.log(util.types.isAnyArrayBuffer(new SharedArrayBuffer()));  // Returns true

console.log(util.types.isBooleanObject(false));  // Returns false
console.log(util.types.isBooleanObject(true));   // Returns false
console.log(util.types.isBooleanObject(new Boolean(false)));   // Returns true
console.log(util.types.isBooleanObject(new Boolean(true)));    // Returns true
console.log(util.types.isBooleanObject(Boolean(false))); // Returns false
console.log(util.types.isBooleanObject(Boolean(true))); // Returns false

const map = new Map();
console.log(util.types.isMap(map));  // Returns true
console.log(util.types.isMapIterator(map.keys()));  // Returns true
console.log(util.types.isMapIterator(map.values()));  // Returns true
console.log(util.types.isMapIterator(map.entries()));  // Returns true
console.log(util.types.isMapIterator(map[Symbol.iterator]()));  // Returns true

const set = new Set();
console.log(util.types.isMap(set));  // Returns true
console.log(util.types.isSetIterator(set.keys()));  // Returns true
console.log(util.types.isSetIterator(set.values()));  // Returns true
console.log(util.types.isSetIterator(set.entries()));  // Returns true
console.log(util.types.isSetIterator(set[Symbol.iterator]()));  // Returns true

function util_types_arguments() {
    console.log(util.types.isArgumentsObject(arguments));  // Returns true
}
util_types_arguments();