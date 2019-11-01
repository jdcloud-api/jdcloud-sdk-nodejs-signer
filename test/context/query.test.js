const assert = require("assert");
const { ContextV1 } = require("../../src");

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

const datetimekey = "X-Jdcloud-Date";
const dateTime = new Date("2019-09-17T06:47:08Z");

const host = "http://apigw-internal-dev.cn-north-1.jcloudcs.com:8000";
let path = host + "/v1/regions/cn-north-1/instances";

describe("query", function() {
  it("查询参数包含空key", function() {
    let query = "?=a&a=a&c=c&=mock&b=b";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === "a=a&b=b&c=c");
  });

  it("从 ? 字符开始到 # 字符结束", function() {
    let query = "?=a&a=a&c=c&=mock&b=b#test?asdasd";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === "a=a&b=b&c=c");
  });

  it("查询参数包含空key和空value", function() {
    let query = "?=&a=a&b=&=c";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === "a=a&b=");
  });

  it("查询参数包含重复key和value", function() {
    let query =
      "?aa=aa&aa=aa=&aa=&aa=aaa&aaa=aaa&aaa=aa&aaa=a&ab=aa&ab=aa&cc=&cc=&bb=aa&bb=";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(
      ctx.query ===
        "aa=aa%2Caa%3D%2C%2Caaa&aaa=aaa%2Caa%2Ca&ab=aa%2Caa&bb=aa%2C&cc=%2C"
    );
  });

  it("key中存在+号", function() {
    let query = "?+=123&+asd=asd";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === "%20=123&%20asd=asd");
  });

  it("value中存在+号", function() {
    let query = "?a=+&c=cc+&b=bb+bb&d=+dd";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === "a=%20&b=bb%20bb&c=cc%20&d=%20dd");
  });

  it("查询参数的key包含特殊字符，value包含特殊字符(不含=、&)", function() {
    let query =
      "?special key=/ /`!@#$%^*()+/0123456789/[]\\\\\\\\\\\\\\\\;',<>?:\\\\\\\\\\\\\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~&/ /`!@#$%^*()+/0123456789/[]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\;',<>?:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"{}|/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/-_.~=special value";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === 'special%20key=%2F%20%2F%60%21%40')
  });

  it("查询参数部分编码部分未编码，且包含+，且涉及编码字符及未编码字符排序", function() {
    let query = "? =blank&%20=blank&+= 2&%2b= 1&blank= &blank=+&blank=%20";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(ctx.query === "%20=%201&blank=%20%2C%20%2C%20");
  });

  it("查询参数包含中文", function() {
    let query = "?中文参数=中文参数值";
    let url = path + query;
    let ctx = new ContextV1(url, method, header, service, regionId);
    assert.ok(
      ctx.query ===
        "%E4%B8%AD%E6%96%87%E5%8F%82%E6%95%B0=%E4%B8%AD%E6%96%87%E5%8F%82%E6%95%B0%E5%80%BC"
    );
  });
});
