---
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# 简介 #
  该项目实现京东云API网关签名的生成，适用于API网关产品，也可用于OpenAPI的签名生成。
# 环境准备 #
 1.京东云Node.js SDK适用于Node.js 8.6.0及以上，npm 5.6.0及以上。

 2.在开始调用京东云open API之前，需提前在京东云用户中心账户管理下的[AccessKey管理页面](https://uc.jdcloud.com/accesskey/index)申请accesskey和secretKey密钥对（简称AK/SK）。AK/SK信息请妥善保管，如果遗失可能会造成非法用户使用此信息操作您在云上的资源，给你造成数据和财产损失。

# SDK使用方法 #
建议使用npm安装京东云Node.js SDK，如下所示： 

npm install jdcloud-sdk-signer

 

您还可以下载sdk源代码自行使用。

 

SDK使用中的任何问题，欢迎您在Github SDK使用问题反馈页面交流。



注意：京东云并没有提供其他下载方式，请务必使用上述官方下载方式！ 



## 调用示例 ##
```javascript
const {Signer,Context}=require('../src')
let ctx=new Context('192.168.180.18','/v1/regions/cn-north-1/buckets','GET',null,'oss')  //可直接讲req.headers 传入
ctx.regionId='cn-north-1'
ctx.query=ctx.buildQuery({a:1})
ctx.headers.set('content-type','application/json')
ctx.buildNonce()

let credentials= {
    accessKeyId : 'accessKeyId',
    secretAccessKey: 'secretAccessKey'
}

let signer=new Signer(ctx,credentials)
signer.setSignableHeaders([
  'content-type',
  'host',
  'x-jdcloud-date',
  'x-jdcloud-nonce'
])
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

将生成的签名，传递到header里作为Authorization的值，即可进行调用。
## 注意事项 ##
1. 设置请求上下文Context(仅作请求签名的载体，不发请求)，如host,path,method,headers,serviceName(默认为'')，具体参见构造函数(ts 定义)。其中header必须包含：x-jdcloud-nonce、x-jdcloud-date(格式：20190101T010101Z)。
1. query需要调用buildQuery 方法处理
1. 初始化Signer，设置ak/sk和logger(默认为console),执行方法得到签名 


