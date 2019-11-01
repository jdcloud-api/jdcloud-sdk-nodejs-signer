const assert = require("assert");
const { Signer, Context, ContextV1 } = require("../src");
const util = require("../src/util");

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
// const datetimekey = "X-Jdcloud-Date";
const dateTime = new Date("2019-09-17T06:47:08Z");
const host = "http://apigw-internal-dev.cn-north-1.jcloudcs.com:8000";
const noop = () => {};

describe("V3 签名测试用例", function() {
  describe("path", function() {
    // it("路径含有特殊字符", function() {
    //   let path = "/v1/regions/cn-north-1/instances/ /`!@#$%^&*()=+/0123456789/[]\;',<>?:\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~:GET"
    //   //需要对path中特殊字符处理
    //   // path = path.replace(/[#?]/g, escape);
    //   let url = host + path;
    //   let ctx = new ContextV1(url, method, header, service, regionId);
    //   let signer = new Signer(ctx, credentials);

    //   assert.ok(
    //     signer.sign(dateTime) ===
    //       "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=925b9455228ef23ee7ec2dd3e33f7e645bcbcb3f4732894c17e4a0cf1d41d1e6"
    //   );
    // });

    it("路径含有中文", function() {
      let path = "/v1/regions/cn-north-1/instances/中文:GET";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=936ed2dcb6fb4271ad640e0f46f1fe61763a0bad8bb4f4eb1224261f969612fa"
      );
    });

    it("路径为空", function() {
      let path = "";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=44c5ec30b6185516986ae171d8276552bc0f37f6a536a44e4f578958fc1c12be"
      );
    });

    it("路径无斜杠", function() {
      let path = "/v1";
      let url = host + path;
      let ctxV1 = new ContextV1(url, method, header, service, regionId);
      let ctx = new Context(
        ctxV1.host,
        path,
        method,
        header,
        service,
        regionId
      );

      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=92cd3ed582c13af58b4c81ddad150c350e656c6cc9e78ec154d7385e499b91b6"
      );
    });

    it("路径结尾有斜杠", function() {
      let path = "/v1/";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=035689ae2ce6a3603928ac3d60a6d2fbfb550d33c5da983342a6356419ccd914"
      );
    });

    // it('路径含有多个连续斜杠 Context',function () {
    //   let path = "///v1/regions/cn-north-1/instances//// //`!@#$%^&*()=+/0123456789/[]\;',<>?:\"{}|/////abcdefghijklmnopqrstuvwxyz//ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~:GET/"
    //   //需要对path中特殊字符处理
    //   path=path.replace(/[#?]/g,escape)
    //   let url=host+path
    //   let ctx=new ContextV1(url,method,header,service,regionId)
    //   let signer=new Signer(ctx,credentials)
    //   assert.ok(signer.sign(dateTime)==='JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=92e4897d2a74a899399f5443615ddf110978363b9097932e522e079e6eb5f65b')
    // })

    it("路径已经编码", function() {
      let path =
        "/v1/regions/cn-north-1/instances/%20/%60%21%40%23%24%25%5E%26%2A%28%29%3D%2B/0123456789/%5B%5D%5C%5C%3B%27%2C%3C%3E%3F%3A%5C%22%7B%7D%7C/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~%3AGET";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=027b5bbd35956b84b8773eb450c0405cb4e424eab13f64828926ee41838c48d0"
      );
    });

    it("路径已经编码，且含有斜杠编码", function() {
      let path = "%2Fv1%2Fregions%2F%2F%2Fcn-north-1%2Finstances";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=33df199719f9edc6de860e6b53c61d4824e1f389e6030fd37ddc977fda29e467"
      );
    });

    it("路径部分编码、部分未编码", function() {
      let path = "%2Fv1%2Fregions%2F%2F%2Fcn-north-1%2Finstances";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=33df199719f9edc6de860e6b53c61d4824e1f389e6030fd37ddc977fda29e467"
      );
    });

    it("路径部分编码部分未编码，且含有空格、+、斜杠编码，且含有未编码的空格、+、斜杠", function() {
      let path =
        "/v1%2Fregions/cn-north-1%2F%2F%2Finstances/ + /%2B%20%2B%2F%2F";
      let url = host + path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=cb25fd3cafb330b4d80058fe0706f59f14692158a839282f46ce8fce1fad693a"
      );
    });
  });

  describe("query", function() {
    let path = host + "/v1/regions/cn-north-1/instances";
    it("查询参数包含空key", function() {
      let query = "?=a&a=a";
      let url = path + query;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=43efb5fb00e86faf35d8bf0bed3b72e84cfc98ee4754065e29c3caa7bcaa12cb"
      );
    });

    it("查询参数包含空key和空value", function() {
      let query = "?=&a=a";
      let url = path + query;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=43efb5fb00e86faf35d8bf0bed3b72e84cfc98ee4754065e29c3caa7bcaa12cb"
      );
    });

    // it("查询参数包含重复key和value", function() {
    //   let query =
    //     "?aa=aa&aa=aa=&aa=&aa=aaa&aaa=aaa&aaa=aa&aaa=a&ab=aa&ab=aa&cc=&cc=&bb=aa&bb=";
    //   let url = path + query;
    //   let ctx = new ContextV1(url, method, header, service, regionId);
    //   let signer = new Signer(ctx, credentials, noop);
    //   assert.ok(
    //     signer.sign(dateTime) ===
    //       "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=fc5e04fcd9f1fdf0e69d957e70d862efaeebbd6b1e4af6c7d7b7de95884cd0d4"
    //   );
    // });

    // it("查询参数的key包含特殊字符，value包含特殊字符(不含=、&)", function() {
    //   let query =
    //     "?special key=/ /`!@#$%^*()+/0123456789/[]\\\\\\\\\\\\\\\\;',<>?:\\\\\\\\\\\\\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~&/ /`!@#$%^*()+/0123456789/[]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\;',<>?:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~=special value";
    //   let url = path + query;
    //   let ctx = new ContextV1(url, method, header, service, regionId);
    //   let signer = new Signer(ctx, credentials, noop);
    //   assert.ok(
    //     signer.sign(dateTime) ===
    //       "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=1d3b5faa92a7624aee20083a688670d490568c64cb4a85f6bbf851ceaa0d2e01"
    //   );
    // });

    // it("查询参数部分编码部分未编码，且包含+，且涉及编码字符及未编码字符排序", function() {
    //   let query = "? =blank&%20=blank&+= 2&%2b= 1&blank= &blank=+&blank=%20";
    //   let url = path + query;
    //   let ctx = new ContextV1(url, method, header, service, regionId);
    //   let signer = new Signer(ctx, credentials, noop);
    //   assert.ok(
    //     signer.sign(dateTime) ===
    //       "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=78c0a4db84050d773533c78c1a0f73bf974faf5df881e39b18c3e0de8110324e"
    //   );
    // });

    it("查询参数包含中文", function() {
      let query = "?中文参数=中文参数值";
      let url = path + query;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=7e3094d23adde49fcc99b7d0de911d7ecaa7767590edd57769d7bdbaca919276"
      );
    });
  });

  describe("header", function() {
    let path = host + "/v1/regions/cn-north-1/instances";
    it("header的value包含前后一个空格，中间包含一个空格", function() {
      let header = {
        "X-Jdcloud-Date": "20190917T064708Z",
        "X-Jdcloud-Nonce": " X-Jdcloud- -Nonce ",
        "Content-Type": "application/json"
      };
      let url = path;
      let ctx = new ContextV1(url, method, header, service, regionId);
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
      let ctx = new ContextV1(url, method, header, service, regionId);
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
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=12ed9fbf2f8ebe6afcdd23853c9e58f37642f8a0361765557d2e4915f1e995e4"
      );
    });
    */

    // it("header的value包含特殊字符", function() {
    //   let header = {
    //     "X-Jdcloud-Date":"20190917T064708Z",
    //     "X-Jdcloud-Nonce":"/`!@#$%^&*()=+/0123456789/[]\;',<>?:\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~",
    //     "Content-Type":"application/json"
    //   }
    //   let url = path;
    //   let ctx = new ContextV1(url, method, header, service, regionId);
    //   let signer = new Signer(ctx, credentials, noop);
    //   assert.ok(
    //     signer.sign(dateTime) ===
    //       "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=9046b11889b993a808fccf1322f7f04e7e5a7e0cc22d8b65e9986a8aab986ad7"
    //   );
    // });

    it("header的value包含换行符（\\r、\\n）、空格", function() {
      let header = {
        "X-Jdcloud-Date": "20190917T064708Z",
        "X-Jdcloud-Nonce": " \n  as\r\n \r df\r\n   ",
        "Content-Type": "application/json"
      };
      let url = path;
      let ctx = new ContextV1(url, method, header, service, regionId);
      let signer = new Signer(ctx, credentials, noop);
      assert.ok(
        signer.sign(dateTime) ===
          "JDCLOUD3-HMAC-SHA256 Credential=ak/20190917/cn-north-1/apigatewaytestproductline/jdcloud3_request, SignedHeaders=content-type;host;x-jdcloud-date;x-jdcloud-nonce, Signature=42966031633e0c237018d42eb1e56b94a266528cc8d274b5bbebe92bed13d4d8"
      );
    });
  });
});
