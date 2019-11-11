// Copyright 2018 JDCLOUD.COM
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License
// This signer is modified from AWS V4 signer algorithm.

var util = require('../util')
var v3Credentials = require('./v3_credentials')
const {VERSION,HEADERDATE,HEADERNOUNCE,HEADERHOST,BLACKLIST}=require('./const')
const debug = require('debug')('signer')
module.exports = class Signer  {
    constructor (request,credentials,logger=console.log) {

        this.signatureCache = true
        this.algorithm = `${VERSION}-HMAC-SHA256`
        //todo resetHeader
        this.signableHeaders = [
            'content-type',
            HEADERHOST,
            HEADERDATE,
            HEADERNOUNCE
        ]

        this.request=request
        this.headers=request.headers
        this.mapHeaders=util.objToStrMap(this.headers)
        this.serviceName =request.serviceName
        this.logger=logger
        this.credentials=credentials
    }

    setSignableHeaders(signableHeaders)
    {
      let headers=[HEADERNOUNCE]
      let securityToken='x-jdcloud-security-token'
      let sessionToken ='x-jdcloud-session-token'
      if(this.headers[securityToken])
        headers.push(securityToken)
      if(this.headers[sessionToken])
        headers.push(sessionToken)
      for(let header of signableHeaders)
      {
        if(!BLACKLIST.find(d=>d===header))
        {
          headers.push(header)
        }
      }
      this.signableHeaders=[...new Set(headers)]
    }
    addAuthorization (date) {

        this.request.check()
        var datetime = util.date.iso8601(date).replace(/[:-]|\.\d{3}/g, '')
        this.addHeaders(this.credentials, datetime)

        if (!this.headers['x-jdcloud-oauth2-token']) {
            this.headers['Authorization']= this.authorization(this.credentials, datetime)
        }
    }

    sign(date)
    {
        this.request.check()
        var datetime = util.date.iso8601(date).replace(/[:-]|\.\d{3}/g, '')

        this.addHeaders(this.credentials, datetime)


        return this.authorization(this.credentials, datetime)
    }

    addHeaders (credentials, datetime) {
        if(!this.mapHeaders.has(HEADERDATE))
        {
          this.headers[HEADERDATE]=datetime
        }
        if(!this.mapHeaders.has(HEADERHOST))
        {
          this.headers[HEADERHOST]=this.request.host
        }

    }

    signedHeaders () {
        var keys = new Set()
      Object.keys(this.headers).forEach(key=>{
        key = key.toLowerCase()
        if (this.isSignableHeader(key)) {
          keys.add(key)
        }
      })
        return [...keys].sort().join(';')
    }

    credentialString (datetime) {
        return v3Credentials.createScope(
            datetime.substr(0, 8),
            this.request.regionId,
            this.serviceName
        )
    }

    signature (credentials, datetime) {
        var signingKey = v3Credentials.getSigningKey(
            credentials,
            datetime.substr(0, 8),
            this.request.regionId,
            this.serviceName,
            this.signatureCache
        )
        let signResult= util.crypto.hmac(signingKey, this.stringToSign(datetime), 'hex')
        debug('signResult',signResult)
        return signResult
    }

    stringToSign (datetime) {
        var parts = []
        parts.push(this.algorithm)
        parts.push(datetime)
        parts.push(this.credentialString(datetime))
        parts.push(this.hexEncodedHash(this.canonicalString()))

        this.log('StringToSign',parts)

        return parts.join('\n')
    }



    // 构建标准签名字符串
    canonicalString () {
        var parts = []
        let pathname =util.uriEscapePath(this.request.pathName)
        parts.push(this.request.method)
        parts.push(pathname)
        parts.push(this.request.query||'')
        parts.push(this.canonicalHeaders() + '\n')
        parts.push(this.signedHeaders())
        parts.push(this.hexEncodedBodyHash())
        this.log('canonicalString',parts)
        return parts.join('\n')
    }
    log(title,parts)
    {
      this.logger(`-----------${title}------------`)
      for(let item of parts)
      {
        this.logger(item)
      }
      this.logger('--------------------------------')
    }
    canonicalHeaders () {
        var headers = []

        for(let key in this.headers)
        {
          headers.push([key,this.headers[key]])
        }
        headers.sort(function (a, b) {
            return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1
        })
        var parts = []
        util.arrayEach.call(this, headers, function (item) {
            var key = item[0].toLowerCase()
            if (this.isSignableHeader(key)) {
                var value = item[1]
                if (
                    typeof value === 'undefined' ||
                    value === null ||
                    typeof value.toString !== 'function'
                ) {
                     let error=new Error('Header ' + key + ' contains invalid value')
                     error.code='InvalidHeader'
                     throw error
                }
                parts.push(key + ':' + this.canonicalHeaderValues(value.toString()))
            }
        })
        return parts.join('\n')
    }

    canonicalHeaderValues (values) {
        return values.replace(/^\s+|\s+$/g, '')
    }

    authorization (credentials, datetime) {
        var parts = []
        var credString = this.credentialString(datetime)
        parts.push(
            this.algorithm +
            ' Credential=' +
            credentials.accessKeyId +
            '/' +
            credString
        )
        parts.push('SignedHeaders=' + this.signedHeaders())
        parts.push('Signature=' + this.signature(credentials, datetime))
        this.log('Signature',parts)
        return parts.join(', ')
    }

    hexEncodedHash (string) {
        return util.crypto.sha256(string, 'hex')
    }

    hexEncodedBodyHash () {
        return (
            this.headers['x-jdcloud-content-sha256'] ||
            this.hexEncodedHash(this.request.body || '')
        )
    }

    isSignableHeader (key) {
        return this.signableHeaders.includes(key.toLowerCase())
    }
}
