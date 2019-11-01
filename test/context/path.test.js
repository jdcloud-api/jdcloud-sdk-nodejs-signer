const assert = require("assert");
const { Signer, Context, ContextV1 } = require("../../src");

describe("Context类", function() {
  describe("path", function() {
    it("pathName 包含多个/，需被替换为一个正斜杠 / ", function() {
      let url =
        "http://test.jdcloud-api.com////v1/regions////cn-north-1//instances/";
      let ctx = new ContextV1(url, "POST", null, "test");

      assert(ctx.pathName === "/v1/regions/cn-north-1/instances/");
    });

    it("路径为/，则直接使用正斜杠", function() {
      let url = "http://test.jdcloud-api.com/";
      let ctx = new ContextV1(url, "POST", null, "test");

      assert(ctx.pathName === "/");
    });

    it("路径为空，则直接使用正斜杠", function() {
      let url = "http://test.jdcloud-api.com";
      let ctx = new ContextV1(url, "POST", null, "test");

      assert(ctx.pathName === "/");
    });

    /*
    it('包含错误的百分比编码',function () {
      let path='/v1/%2/%f/%2b%2f'
      let url='http://www.w3school.com.cn'+path
      let ctx=new ContextV1(url,'POST',null,'test')
      // ctx.pathName:  /v1/%2/%f/+/
      assert.throws(()=>ctx.pathName,new URIError('URI malformed'))
    })
    */

    it("路径部分编码部分未编码,且含有空格、+、斜杠编码，且含有未编码的空格、+、斜杠", function() {
      let path =
        "/v1%2Fregions/cn-north-1%2F%2F%2Finstances/ + /%2B%20%2B%2F%2F";
      let url = "http://www.w3school.com.cn" + path;
      let ctx = new ContextV1(url, "POST", null, "test");
      // assert(ctx.pathName ==='/v1/regions/cn-north-1/instances/ + /+ +/')
      assert(ctx.pathName === "/v1/regions/cn-north-1/instances/   /+ +/");
    });

    it("路径部分编码部分未编码", function() {
      let path = "/v1%2Fregions/cn-north-1%2F%2F%2Finstances";
      let url = "http://www.w3school.com.cn" + path;
      let ctx = new ContextV1(url, "POST", null, "test");
      assert(ctx.pathName === "/v1/regions/cn-north-1/instances");
    });

    it("路径结尾有斜杠", function() {
      let path = "/v1/";
      let url = "http://www.w3school.com.cn" + path;
      let ctx = new ContextV1(url, "POST", null, "test");
      assert(ctx.pathName === "/v1/");
    });

    it("路径已经编码", function() {
      let path =
        "/v1/regions/cn-north-1/instances/%20/%60%21%40%23%24%25%5E%26%2A%28%29%3D%2B/0123456789/%5B%5D%5C%5C%3B%27%2C%3C%3E%3F%3A%5C%22%7B%7D%7C/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~%3AGET";
      let url = "http://www.w3school.com.cn" + path;
      let ctx = new ContextV1(url, "POST", null, "test");
      assert(
        ctx.pathName ===
          "/v1/regions/cn-north-1/instances/ /`!@#$%^&*()=+/0123456789/[]\\\\;',<>?:\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~:GET"
      );
    });
  });
});
