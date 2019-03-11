export declare class Context {
  constructor(host:string,path:string,method:string,headers:Map,serviceName:string='')
  buildNonce():void
  setNonce(nonce:string):void
  check():void
  buildQuery (queryParams:object):void
}

export declare interface Credentials
{
  accessKeyId:string
  secretAccessKey:string
}

export declare class Signer {
   constructor(request:Context,credentials:Credentials,logger:any=console.log)

   sign(date:Date):string
}

