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

describe('签名比对', function () {

  let credentials= {
    accessKeyId: 'TESTAK',
    secretAccessKey: 'TESTSK'
  }

  let ctx=new Context('test.jdcloud-api.com','/v1/resource:action','POST',null,'test')
  ctx.regionId='cn-north-1'
  ctx.query=ctx.buildQuery({p1:'p1',u:'u',o:'%',p0:'p0'})
  ctx.headers.set('content-type','application/json')
  ctx.headers.set('x-my-header','test  ')
  ctx.headers.set('x-my-header_blank','  blank')
  ctx.setNonce('testnonce')
  ctx.body='body data'

  it('简单签名', function () {
    let signer=new Signer(ctx,credentials)
    signer.setSignableHeaders(['x-jdcloud-date','x-jdcloud-nonce','x-my-header','x-my-header_blank'])
    signer.addAuthorization(new Date('2019-02-14T10:45:14Z'))
    expec(ctx.headers.get('Authorization')).to.be.ok
  })

})
