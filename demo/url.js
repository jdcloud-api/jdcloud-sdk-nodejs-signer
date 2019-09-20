const url=require('url')
const util=require('../src/util')
const crypto=require('crypto')
let result= url.parse('http://test.jdcloud-api.com/v1/resource:action?p1=p1&p0=p0&o=%&u=u',false)
console.log(result)
result=url.parse('http://test.jdcloud-api.com/v1/resource:action?p1=+d&p0=p0&o=%&u=u',true)
console.log(result)
result=url.parse('http://test.jdcloud-api.com?p1=+d&p0=p0&o=%&u=u',true)
console.log(result)
let uri='http://test.jdcloud-api.com////v1/regions/cn-north-1/instances//// //`!@#$%^&*()=+/0123456789/[]\\\\;\',<>?:\\"{}|/////abcdefghijklmnopqrstuvwxyz//ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~:GET/'

uri= uri.replace(/(\/{2,})/g,'/')
result=url.parse(uri)
console.log(decodeURI(result.pathname))
console.log(result)

result=url.parse(decodeURI('http://www.w3school.com.cn/My%20first/'))
console.log(result)
console.log(decodeURI('My%20first/'))
console.log(decodeURIComponent('My%20first/'))
console.log(util.uriEscapePath('My%20first/'))
uri='http://www.w3school.com.cn/My%20first/?=blank&%20=blank&+= 2&%2b= 1&blank= &blank=+&blank=%20'
console.log(decodeURI(uri))
result=url.parse(uri,true)
console.log(result)
// let hamc= crypto.createHash('sha256')
// hamc.update()
// hamc.digest('hex')

let path='/v1/regions/cn-north-1/instances/%20/%60%21%40%23%24%25%5E%26%2A%28%29%3D%2B/0123456789/%5B%5D%5C%5C%3B%27%2C%3C%3E%3F%3A%5C%22%7B%7D%7C/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~%3AGET'
console.log(decodeURIComponent(path))
