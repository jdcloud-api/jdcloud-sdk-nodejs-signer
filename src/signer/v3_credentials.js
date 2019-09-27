var cachedSecret = {}
var cacheQueue = []
var maxCacheEntries = 50
var IDENTIFIER = 'jdcloud3_request'
const {VERSION}=require('./const')
const util = require('../util')
const debug = require('debug')('signer')

module.exports = {
  /**
   * @api private
   *
   * @param date [String]
   * @param region [String]
   * @param serviceName [String]
   * @return [String]
   */
  createScope: function createScope (date, region, serviceName) {
    return [date.substr(0, 8), region, serviceName, IDENTIFIER].join('/')
  },

  /**
   * @api private
   *
   * @param credentials [Credentials]
   * @param date [String]
   * @param region [String]
   * @param service [String]
   * @param shouldCache [Boolean]
   * @return [String]
   */
  getSigningKey: function getSigningKey (
    credentials,
    date,
    region,
    service,
    shouldCache
  ) {
    var credsIdentifier = util.crypto.hmac(
      credentials.secretAccessKey,
      credentials.accessKeyId,
      'base64'
    )
    var cacheKey = [credsIdentifier, date, region, service].join('_')
    shouldCache = shouldCache !== false
    if (shouldCache && cacheKey in cachedSecret) {
      return cachedSecret[cacheKey]
    }
    let digest='buffer'
   // digest=null
    var kDate = util.crypto.hmac(
      VERSION + credentials.secretAccessKey,
      date,digest
    )
    var kRegion = util.crypto.hmac(kDate, region,digest)
    var kService = util.crypto.hmac(kRegion, service,digest)
    var signingKey = util.crypto.hmac(kService, IDENTIFIER,digest)
    if (shouldCache) {
      cachedSecret[cacheKey] = signingKey
      cacheQueue.push(cacheKey)
      if (cacheQueue.length > maxCacheEntries) {
        // remove the oldest entry (not the least recently used)
        delete cachedSecret[cacheQueue.shift()]
      }
    }
    debug('date',date)
    debug('key', VERSION + credentials.secretAccessKey)
    debug('kDate',kDate.toString('hex'))
    debug('kRegion',kRegion.toString('hex'))
    debug('kService',kService.toString('hex'))
    debug('kSigning',signingKey.toString('hex'))
    return signingKey
  },

  /**
   * @api private
   *
   * Empties the derived signing key cache. Made available for testing purposes
   * only.
   */
  emptyCache: function emptyCache () {
    cachedSecret = {}
    cacheQueue = []
  }
}
