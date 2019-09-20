const config = require('./config')
const util=require('../src/util')
const {Signer,Context,ContextV1}=require('../src')
const url=require('url')
const urlParse=url
const uuid=require('uuid')
/* eslint-disable */
const expec = require('chai').expect
const assert=require('assert')
/* eslint-enable */
describe('signer', function () {

    let credentials= {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
    let urlInfo=url.parse('http://test.jdcloud-api.com/v1/resource:action?p1=p1&p0=p0&o=%&u=u',false)

    let ctx=new Context(urlInfo.hostname,urlInfo.pathname,'POST',null,'test')
    ctx.regionId='cn-north-1'
    ctx.query= urlInfo.query
    ctx.headers.set('x-my-header','test')
    ctx.headers.set('x-my-header_blank','  blank')
    ctx.headers.set('x-jdcloud-nonce','testnonce')


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
      let signer=new Signer(ctx,credentials)
        signer.addAuthorization(new Date('2019-03-08T10:49:29Z'))
        expec(ctx.headers.get('Authorization')).to.be.ok
    })
})
describe('contextV1', function () {

  let url='http://test.jdcloud-api.com/v1/resource:action?p1=p1&p0=p0&o=%&u=u'
  let ctx=new ContextV1(url,'POST',null,'test')
  ctx.regionId='cn-north-1'
  ctx.headers.set('x-my-header','test')
  ctx.headers.set('x-my-header_blank','  blank')
  ctx.headers.set('x-jdcloud-nonce','testnonce')

  let credentials= {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  }
  it('简单签名', function () {
    let signer=new Signer(ctx,credentials)
    signer.addAuthorization(new Date('2019-03-08T10:49:29Z'))
    assert.ok(ctx.headers.get('Authorization'))
  })

  it('without serviceName',function () {
    let signer=new Signer(ctx,credentials)
    signer.addAuthorization(new Date('2019-03-08T10:49:29Z'))
    assert.ok(ctx.headers.get('Authorization'))
  })

  it('without region',function () {
    ctx.regionId=''
    let signer=new Signer(ctx,credentials)
    assert.throws(()=>signer.addAuthorization(new Date('2019-03-08T10:49:29Z')),new Error("regionId is required"))
  })



  it('query',function () {
    let url='http://www.w3school.com.cn/My%20first/?=blank&%20=blank&+= 2&%2b= 1&blank= &blank=+&blank=%20'
    let ctx=new ContextV1(url,'POST',null,'test')

    assert.ok(ctx.query==='=blank&%20=%202&%20=blank&%2B=%201&blank=%20&blank=%20&blank=%20')
  })
  it('cn query',function () {
    let query='中文参数=中文参数值'
    let url='http://www.w3school.com.cn/te?'+query
    let ctx=new ContextV1(url,'POST',null,'test')
    assert.ok(decodeURI(ctx.query) ===query)
  })

  it('not encode query',function () {
    let query='=blank&%20=blank&+= 2&%2b= 1&blank= &blank=+&blank=%20'
    let url='http://www.w3school.com.cn/te?'+query
    console.log(decodeURI(url))
    let ctx=new ContextV1(url,'POST',null,'test')
    assert.ok(decodeURI(ctx.query) !=query)
  })

  it('query repeat key',function () {
    let query='aa=aa&aa=aa=&aa=&aa=aaa&aaa=aaa&aaa=aa&aaa=a&ab=aa&ab=aa&cc=&cc=&bb=aa&bb='
    let url='http://www.w3school.com.cn/te?'+query
    let ctx=new ContextV1(url,'POST',null,'test')
    assert.ok(decodeURI(ctx.query) !=query)
  })



  it('object query',function () {
    let q={
      'nullValue':'',
      '':'nullKey',
      'specialValue':'&&==&==&&=&=',
      '&&==&==&&=&=': 'specialKey'
    }
    let query= ctx.buildQuery(q)
    let uri='http://www.w3school.com.cn/test?'+query
    let urlResult= urlParse.parse(uri,true)
    assert.deepEqual(urlResult.query,q)
  })

})




describe('header',function () {
  let credentials= {
    accessKeyId: 'TESTAK',
    secretAccessKey: 'TESTSK'
  }

  let urlInfo=url.parse('http://test.jdcloud-api.com/v1/resource:action?p1=p1&p0=p0&o=%&u=u',true)

  let ctx=new Context(urlInfo.hostname,urlInfo.pathname,'POST',null,'test')
  ctx.regionId='cn-north-1'
  ctx.query=ctx.buildQuery(urlInfo.query)
  ctx.headers.set('content-type','application/json')
  ctx.headers.set('X-Jdcloud-Date',"20190917T064708Z")
  let signer=new Signer(ctx,credentials)
  it('包含空格,中间空格不缩减',function () {
    ctx.headers.set('X-Jdcloud-Nonce',"  X-Jdcloud-   -Nonce  ")
    let canonicalHeaders=signer.canonicalHeaders()
    assert.ok(canonicalHeaders==='content-type:application/json\n' +
      'x-jdcloud-date:20190917T064708Z\n' +
      'x-jdcloud-nonce:X-Jdcloud-   -Nonce')
  })

  it('包含多个值',function () {

    ctx.headers.set('X-Jdcloud-Nonce',["aaa", "a", "", " one blank ", "  two  blanks  ", "   three   blanks   ", "aa"])
    let canonicalHeaders=signer.canonicalHeaders()
    assert(canonicalHeaders==="content-type:application/json\nx-jdcloud-date:20190917T064708Z\nx-jdcloud-nonce:aaa,a,, one blank ,  two  blanks  ,   three   blanks   ,aa")
  })

  it('包含特殊字符',function () {

    ctx.headers.set('X-Jdcloud-Nonce',"/`!@#$%^&*()=+/0123456789/[]\\\\;',<>?:\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~",)
    let canonicalHeaders=signer.canonicalHeaders()
    assert(canonicalHeaders==="content-type:application/json\nx-jdcloud-date:20190917T064708Z\nx-jdcloud-nonce:/`!@#$%^&*()=+/0123456789/[]\\\\;',<>?:\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~")
  })

  it('包含换行和空格',function () {
    let val=" \n  as\r\n \r df\r\n   "
    ctx.headers.set('X-Jdcloud-Nonce',val)
    console.log(val.toString())
    let canonicalHeaders=signer.canonicalHeaders()
    console.log(canonicalHeaders)
    assert(canonicalHeaders==="content-type:application/json\nx-jdcloud-date:20190917T064708Z\nx-jdcloud-nonce:as\r\n \r df")
  })
})

describe('签名比对', function () {

  let credentials= {
    accessKeyId: 'TESTAK',
    secretAccessKey: 'TESTSK'
  }

  let urlInfo=url.parse('http://test.jdcloud-api.com/v1/resource:action?p1=p1&p0=p0&o=%&u=u',true)

  let ctx=new Context(urlInfo.hostname,urlInfo.pathname,'POST',null,'test')
  ctx.regionId='cn-north-1'
  ctx.query=ctx.buildQuery(urlInfo.query)
  ctx.headers.set('content-type','application/json')
  ctx.headers.set('x-my-header','test  ')
  ctx.headers.set('x-my-header_blank','  blank')
  ctx.setNonce('testnonce')
  ctx.body='body data'
  let dateTime='20190214T104514Z'
  let signer=new Signer(ctx,credentials)
  signer.setSignableHeaders(['x-jdcloud-date','x-jdcloud-nonce','x-my-header','x-my-header_blank'])
  signer.addAuthorization(new Date('2019-02-14T10:45:14Z'))
  it('step one---canonicalString',function () {
    let canonicalString=signer.canonicalString()
    expec(canonicalString).to.equal(`POST
/v1/resource%3Aaction
o=%25&p0=p0&p1=p1&u=u
x-jdcloud-date:20190214T104514Z
x-jdcloud-nonce:testnonce
x-my-header:test
x-my-header_blank:blank

x-jdcloud-date;x-jdcloud-nonce;x-my-header;x-my-header_blank
e51832a118eeff7ad976d635b7d04538e362e4c21bd0f6253580b0a83a209074`)
  })
  it('step two---StringToSign',function () {

    expec(signer.stringToSign(dateTime)).to.be
      .equal(`JDCLOUD3-HMAC-SHA256
20190214T104514Z
20190214/cn-north-1/test/jdcloud3_request
fb2e317056269590681d091f8eb22272967c0b922b2deda887312215ea4eed4c`)
  })

  it('step three---signature',function () {

    assert(signer.signature(signer.credentials,dateTime)===`327e3b9d88e2122dbb7e146e5582aaba1a85eba9d4361928f40b24957cc9449c`)

  })

  it('简单签名', function () {
    assert(ctx.headers.get('Authorization')==='JDCLOUD3-HMAC-SHA256 Credential=TESTAK/20190214/cn-north-1/test/jdcloud3_request, SignedHeaders=x-jdcloud-date;x-jdcloud-nonce;x-my-header;x-my-header_blank, Signature=327e3b9d88e2122dbb7e146e5582aaba1a85eba9d4361928f40b24957cc9449c')
  })

})
