const config = require('./config')
const util=require('../src/util')
const {Signer,Context}=require('../src')
const uuid=require('uuid')
/* eslint-disable */
const expec = require('chai').expect
/* eslint-enable */
describe('signer', function () {

    let credentials= {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }

    let ctx=new Context('192.168.180.18','/v1/regions/cn-north-1/buckets','GET',null,'oss')
    ctx.regionId='cn-north-1'
    ctx.query=''
    ctx.headers.set('content-type','application/json')
    ctx.setNonce('c92d3c14-b574-4c9e-a8d4-71ae04c1a5e4')


  it('简单签名', function () {
      let signer=new Signer(ctx,credentials)
      signer.addAuthorization(new Date('2019-03-08T10:49:29Z'))
      expec(ctx.headers.get('Authorization')).to.be.ok
  })

  it('without serviceName',function () {
      let signer=new Signer(ctx,credentials)
      signer.addAuthorization(new Date('2019-03-08T10:49:29Z'))
      expec(ctx.headers.get('Authorization')).to.be.ok
  })

    it('without region',function () {
        ctx.regionId=''
      let signer=new Signer(ctx,credentials)
        signer.addAuthorization(new Date('2019-03-08T10:49:29Z'))
        expec(ctx.headers.get('Authorization')).to.be.ok
    })
})
