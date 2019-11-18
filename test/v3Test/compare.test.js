const assert = require("assert");
const querystring=require('querystring')
const { Signer, Context, ContextV1 } = require("../../src");
const util = require("../../src/util");

const credentials = {
  accessKeyId: "ak",
  secretAccessKey: "sk"
};
const method = "GET";
const service = "apigatewaytestproductline";
const regionId = "cn-north-1";

const body=''
// const datetimekey = "X-Jdcloud-Date";
const dateTime = new Date("2019-09-17T06:47:08Z");
const host = "http://apigw-internal-dev.cn-north-1.jcloudcs.com:8000";
const noop = undefined
const Authorization_Key='Authorization'

let info=require('./utIlist')
let utList={}
function normalize(info)
{
  let key='测试用例'
  let list=info[key]
  const cateKey='分类'
  let cate=''
  for(let item of list)
  {
    if(item[cateKey])
      cate=item[cateKey]
    item.cate=cate
    utList[cate]= utList[cate] ||{}
    utList[cate][item[key]]=item
  }
}
normalize(info)

const catePath='路径'
const cateQuery='查询参数'
const cateHeader='header'
const headerKey='默认header'
function objectToMap(data)
{
  let map=new Map()
  for(let key in data)
  {
    map.set(key.toLowerCase(),data[key])
  }
  return map
}
describe(catePath, function() {
    let pathUts=utList[catePath]

    for(let key in pathUts)
    {
      it(key,function () {
        let item=pathUts[key]
        let path =item.path
        //需要对path中特殊字符处理
        if(path)
          path = path.replace(/[#?\\]/g, escape);
        else
          path=''
        if(!path.startsWith('/'))
          path='/'+path
        let url = host + path;
        let header=JSON.parse(item[headerKey])
        let ctx = new ContextV1(url, method, objectToMap(header),body, service, regionId);
        let signer = new Signer(ctx, credentials);
        let token=signer.sign(dateTime)
        assert.ok(token===item[Authorization_Key]);
      })
    }
  });

describe(cateQuery, function() {
   let path = host + "/v1/regions/cn-north-1/instances";
   for(let key in utList[cateQuery])
   {
     it(key,function () {
       let item=utList[cateQuery][key]
       let query =item.query
       if(query.toLowerCase().includes('maps'))
       {
         let queryMap={
           'nullValue':'',
           '':'nullKey',
           'specialValue':'&&==&==&&=&=',
           '&&==&==&&=&=':'specialKey'
         }
         query=`?${querystring.stringify(queryMap)}` ;
       }
       query = query.replace(/[#\\]/g, escape);
       let url = path + query;
       let header=JSON.parse(item[headerKey])
       let ctx = new ContextV1(url, method, objectToMap(header),body, service, regionId);
       let signer = new Signer(ctx, credentials);
       let token=signer.sign(dateTime)
       assert.ok(token===item[Authorization_Key]);
     })
   }
})

describe(cateHeader, function() {
  let path = host + "/v1/regions/cn-north-1/instances";
  for(let key in utList[cateHeader])
  {
    it(key,function () {
      let item=utList[cateHeader][key]
      let headerString=item['默认header']

      let header =JSON.parse(headerString)

      let url = path
      let ctx = new ContextV1(url, method, objectToMap(header),body, service, regionId);
      let signer = new Signer(ctx, credentials);
      let token=signer.sign(dateTime)
      assert.ok(token===item[Authorization_Key]);
    })
  }
})


