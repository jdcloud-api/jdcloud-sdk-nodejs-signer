const config = require('./config')
const util=require('../src/util')
const Signer=require('../src/signer/v2')
/* eslint-disable */
const expec = require('chai').expect
/* eslint-enable */
describe('JDCloud.CallStyle', function () {

  let request={regionId:'cn-north-1'}
  request.headers=new Map()
  request.path='/regions/{regionId}/quotas'
  request.method='POST'
  request.query=util.queryParamsToString({regionId:'cn-north-1'})

  let credentials= {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
  let signer=new Signer(request,'am')

  it('use Promise style', function () {
      signer.addAuthorization('oss-console.jdcloud.com',credentials,new Date())
      console.log(request.headers)
  })

})
