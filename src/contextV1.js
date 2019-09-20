const RequestContext=require('./requestContext')
const urlParser=require('url')

class Context extends RequestContext{
   constructor(url,method,headers,serviceName='',regionId='')
   {
     let urlResult=urlParser.parse(url,true)
     let host=urlResult.host
     let path=urlResult.pathname
     super(host,path,method,headers,serviceName,regionId)
     this.query=super.buildQuery(urlResult.query)
   }
}

module.exports=Context
