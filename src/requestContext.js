const util = require('./util')
const uuid=require('uuid')

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
        this.host=host
        this.headers=headers||new Map()
        this.method=method
        this.path=util.uriEscapePath(path)
        this.serviceName=serviceName
        this.regionId=regionId
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
        if(!this.headers.get(NOUNCEHEADER))
            throw new Error("header['x-jdcloud-nonce'] is required")
        if(!this.regionId)
            throw new Error("regionId is required")
    }

    buildQuery (queryParams) {
        var queryParamsWithoutEmptyItem = {}
        var keys = Object.keys(queryParams)
        for (let key of keys) {
            if (queryParams[key] !== undefined) {
                queryParamsWithoutEmptyItem[key] = queryParams[key]
            }
        }
        return util.queryParamsToString(queryParamsWithoutEmptyItem)
    }
}

module.exports=Context
