---
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# 京东云Node SDK
欢迎使用京东云API网关开发者Node工具套件（Nodejs Signature SDK）。使用京东云API网关Node Signature SDK，您无需复杂编程就可以访问京东云API网关API提供者提供的各种服务。
为了方便您理解SDK中的一些概念和参数的含义，使用SDK前建议您先查看京东云API网关使用入门。
### 安装
`npm install @jdcloud/sdksigner`

### 使用说明
1. 安装后，引入 const {Signer,Context}=require('@jdcloud/sdksigner')
2. 设置请求上下文Context，如host,path,method,headers,serviceName(默认为'')。具体参见构造函数，
3. 初始化Signer，设置ak/sk和logger(默认为console),执行方法得到签名并放到header中


###例子如下：
```javascript
const {Signer,Context}=require('../src')
let ctx=new Context('192.168.180.18','/v1/regions/cn-north-1/buckets','GET',null,'oss')
ctx.regionId='cn-north-1'
ctx.query=ctx.buildQuery({a:1})
ctx.headers.set('content-type','application/json')
ctx.buildNonce()

let credentials= {
    accessKeyId : '0449DD5411F3EAED92335DC5EDAFEAFF',
    secretAccessKey: '7989C15CB8705962B860A2BB5BA3FC40'
}

let signer=new Signer(ctx,credentials)
let auth= signer.sign(new Date())
ctx.headers.set('Authorization',auth)
console.log("GET签名为：",auth)

console.log('------------------------')

ctx.query=null
ctx.body=JSON.stringify({a:1,b:2})
ctx.method='POST'
signer=new Signer(ctx,credentials)
auth= signer.sign(new Date())
console.log("POST签名为：",auth)
```
