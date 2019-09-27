const {Signer,Context}=require('../src')
let ctx=new Context('192.168.180.18','/v1/regions/cn-north-1/buckets','GET',null,'oss')

ctx.regionId='cn-north-1'
ctx.query=ctx.buildQuery({a:1})

ctx.headers['content-type']='application/json'
ctx.buildNonce()

let credentials= {
    accessKeyId : '0449DD5411F3EAED92335DC5EDAFEAFF',
    secretAccessKey: '7989C15CB8705962B860A2BB5BA3FC40'
}

let signer=new Signer(ctx,credentials)
signer.setSignableHeaders([
  'content-type',
  'host',
  'x-jdcloud-date',
  'x-jdcloud-nonce'
])
console.log(signer.canonicalHeaders())
let auth= signer.sign(new Date())

ctx.headers['Authorization']=auth
console.log("GET签名为：",auth)

console.log('------------------------')

ctx.query=null
ctx.body=JSON.stringify({a:1,b:2})
ctx.method='POST'
signer=new Signer(ctx,credentials)
auth= signer.sign(new Date())
console.log("POST签名为：",auth)
