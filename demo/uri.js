
// const catberryURI = require('catberry-uri');
//
// const URI = catberryURI.URI;
// const uri = new URI('http://user:pass@example.org:3000/some/path?some=value&some2=value&some2=value2&some3#fragment');
// console.log(uri);
const util=require('../src/util')
let path='/v1/regions/cn-north-1/instances/ /`!@#$%^&*()=+/0123456789/[]\\\\;\',<>?:\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~:GET'
console.log(util.uriEscapePath(path))

console.log('[',util.uriEscape("["))
