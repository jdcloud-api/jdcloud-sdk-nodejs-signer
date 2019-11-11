const VERSION='JDCLOUD3'

const HEADERDATE='x-jdcloud-date'
const HEADERNOUNCE='x-jdcloud-nonce'
const HEADERHOST='host'

const BLACKLIST=[
  'cache-control',
  'content-type',
  'content-length',
  'host',
  'expect',
  'max-forwards',
  'pragma',
  'range',
  'te',
  'if-match',
  'if-none-match',
  'if-modified-since',
  'if-unmodified-since',
  'if-range',
  'accept',
  'authorization',
  'proxy-authorization',
  'from',
  'referer',
  'user-agent',
  'x-jdcloud-request-id']


module.exports={
  VERSION,
  HEADERDATE,
  HEADERNOUNCE,
  HEADERHOST,
  BLACKLIST
}
