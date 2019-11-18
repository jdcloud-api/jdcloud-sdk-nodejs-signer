const util = require('./util')
const uuid=require('uuid')
const type=require('type-detect')
const NOUNCEHEADER='x-jdcloud-nonce'

class Context {
    constructor(host,path,method,headers,serviceName='',regionId='')
    {
        if(!host)
            throw new Error("host is required")
        if(!path)
            throw new Error("path is required")
        if(!method)
            throw new Error("method is required")

        if(!path.startsWith('/'))
          path='/'+path
        this.host=host
        this.headers=headers||new Map()
        this.method=method.toUpperCase()
        this.path=path
        this.serviceName=serviceName
        this.regionId=regionId
    }

    get pathName()
    {
        let path=this.path.replace(/\+/g," ")
        path=unescape(path)
        return path.replace(/(\/{2,})/g,'/')
    }

    buildNonce()
    {
      this.headers.set(NOUNCEHEADER,uuid.v4())
    }

    setNonce(nonce)
    {
      this.headers.set(NOUNCEHEADER,nonce)
    }

    check()
    {
      if(![...this.headers.keys()].find(d=>d.toLowerCase()===NOUNCEHEADER))
          throw new Error("header['x-jdcloud-nonce'] is required")
        if(!this.regionId)
            throw new Error("regionId is required")
    }

    buildQuery (queryParams) {
        var queryParamsWithoutEmptyItem = {}
        var keys = Object.keys(queryParams)
        for (let key of keys) {
            if (key !== undefined&&key!=='') {
                queryParamsWithoutEmptyItem[key] = queryParams[key]
            }
        }
        return util.queryParamsToString(queryParamsWithoutEmptyItem)
    }
}


module.exports=Context
