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

const header = {
  "X-Jdcloud-Date": "20190917T064708Z",
  "X-Jdcloud-Nonce": "X-Jdcloud-Nonce",
  "Content-Type": "application/json"
};
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
        let ctx = new ContextV1(url, method, header,body, service, regionId);
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
       let ctx = new ContextV1(url, method, header,body, service, regionId);
       let signer = new Signer(ctx, credentials);
       let token=signer.sign(dateTime)
       assert.ok(token===item[Authorization_Key]);
     })
   }
})

// describe(cateHeader, function() {
//   let path = host + "/v1/regions/cn-north-1/instances";
//   for(let key in utList[cateHeader])
//   {
//     it(key,function () {
//       let item=utList[cateHeader][key]
//       let headerString=item['默认header']
//
//       let header =JSON.parse(headerString)
//
//       let url = path
//       let ctx = new ContextV1(url, method, header,body, service, regionId);
//       let signer = new Signer(ctx, credentials);
//       let token=signer.sign(dateTime)
//       assert.ok(token===item[Authorization_Key]);
//     })
//   }
// })

  describe("header", function() {
    let path = host + "/v1/regions/cn-north-1/instances";
    it("header的value包含前后一个空格，中间包含一个空格", function() {
      let header = {
        "X-Jdcloud-Date": "20190917T064708Z",
        "X-Jdcloud-Nonce": " X-Jdcloud- -Nonce ",
        "Content-Type": "application/json"
      };
      let url = path;
     let ctx = new ContextV1(url, method, header,body, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=5d955d1de475eac2b4378473ca0adce8fddd13f45d2be53bc2ffb6eee6450ba4"
      );
    });

    it("header的value包含前后多个空格，中间包含多个空格", function() {
      let header = {
        "X-Jdcloud-Date": "20190917T064708Z",
        "X-Jdcloud-Nonce": "  X-Jdcloud-  -Nonce  ",
        "Content-Type": "application/json"
      };
      let url = path;
     let ctx = new ContextV1(url, method, header,body, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=a03bb8d755cb93e4d8846fe5fcad180f319fa50356f63e8afdc749bd1a95695f"
      );
    });

    /* 2019/11/1 这个用例暂时不管，未确定
    it("header的value包含多个值", function() {
      let header = {
        "X-Jdcloud-Date": "20190917T064708Z",
        "X-Jdcloud-Nonce": [
          "aaa",
          "a",
          "",
          " one blank ",
          "  two  blanks  ",
          "   three   blanks   ",
          "aa"
        ],
        "Content-Type": "application/json"
      };
      let url = path;
     let ctx = new ContextV1(url, method, header,body, service, regionId);
      let signer = new Signer(ctx, credentials);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=12ed9fbf2f8ebe6afcdd23853c9e58f37642f8a0361765557d2e4915f1e995e4"
      );
    });
    */
    it("header的value包含特殊字符", function() {

      let header = {
        "X-Jdcloud-Date":"20190917T064708Z",
        "X-Jdcloud-Nonce":"/`!@#$%^&*()=+/0123456789/[]\\;',<>?:\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~",
        "Content-Type":"application/json"
      }

      let url = path;
     let ctx = new ContextV1(url, method, header,body, service, regionId);
      let signer = new Signer(ctx, credentials);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=9046b11889b993a808fccf1322f7f04e7e5a7e0cc22d8b65e9986a8aab986ad7"
      );
    });

    it("header的value包含换行符（\\r、\\n）、空格", function() {
      let header = {
        "X-Jdcloud-Date": "20190917T064708Z",
        "X-Jdcloud-Nonce": " \n  as\r\n \r df\r\n   ",
        "Content-Type": "application/json"
      };
      let url = path;
     let ctx = new ContextV1(url, method, header,body, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=42966031633e0c237018d42eb1e56b94a266528cc8d274b5bbebe92bed13d4d8"
      );
    });

    /*
    新增的用例，结果还未给出
    it("x-jdcloud-content-sha256", function() {
      let header = {
        "X-Jdcloud-Date":"20190917T064708Z",
        "X-Jdcloud-Nonce":" \n  as\r\n \r df\r\n   ",
        "Content-Type":"application/json",
      "x-jdcloud-content-sha256":"xxx"
      };
      let url = path;
     let ctx = new ContextV1(url, method, header,body, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      // assert.ok(
      //   signer.sign(dateTime) ===
      //     "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=42966031633e0c237018d42eb1e56b94a266528cc8d274b5bbebe92bed13d4d8"
      // );
    }); */

  });

