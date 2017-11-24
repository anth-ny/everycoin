"use strict"

var base58=require('bs58')
var version=require('./json/versions.json')
var wif_version=require('./json/wif_versions.json')
var algo=require('./json/algos.json')
//var mh = require('multi-hashing-jh')
var crypto = require('crypto')

function sha3(buf) {
  return mh.keccak(buf) //can't get it working
}

function blake8(buf) {
  return mh.blake8(buf) //8 round version of blake; rarely implemented & I can't get mh to compile
}

function sha256x2(buf) {

  var sha256x1 = crypto.createHash('sha256').update(buf).digest()
  return crypto.createHash('sha256').update(sha256x1).digest()
}

exports.getversion = function(coin) {
  return version[coin]
}

exports.getchecksum = function(buf) {
  return sha256x2(buf).slice(0,4)
}

exports.getpublickey = function(private_key, compress) {
  var ecurve=require('ecurve')
  var BigInteger = require('bigi')
  var buf

  //console.log('getpublickey', private_key)
  if (typeof(private_key)==='object') {
    //var name=Object.prototype.toString.call(private_key)
    if ((private_key instanceof Buffer)||(private_key instanceof SlowBuffer)) {
      buf=private_key
    } else {
      buf=undefined
    }
  } else if (typeof(private_key)==='string') {
    buf=new Buffer(private_key, 'hex')
  } else {
    buf=undefined
  }

  //console.log('buf', buf)
  var ecparams=ecurve.getCurveByName('secp256k1')
  var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(buf))
  var public_key = curvePt.getEncoded(compress)
  //var public_key = curvePt.getEncoded(true)
  //console.log(public_key.toString('hex'))

  return public_key
}

function prependversion(buf, version) {
  return Buffer.concat([new Buffer(version.toString('hex'), 'hex'), buf])
}

function appendcompressionflag(buf) {
  return Buffer.concat([buf, new Buffer('01', 'hex')])
}

exports.gethexaddress = function(pubk) {
  var hash=crypto.createHash('sha256').update(pubk).digest()
  var hash2=crypto.createHash('ripemd160').update(hash).digest()

  return hash2
}

exports.getaddress = function(pubk, coin) {
  //console.log('getaddress', pubk, coin)

  var ver=version[coin]
  var fn=eval(algo[coin])
  var hexaddress=gethexaddress(pubk)
  var hash=prependversion(hexaddress, ver)
  //console.log(hash)
  var checksum=fn(hash).slice(0, 4)
  //console.log(checksum)
  var binary_address=Buffer.concat([hash, new Buffer(checksum, 'hex')])
  //console.log(hash6)

  return new Buffer(base58.encode(binary_address)).toString()
}

exports.getpriv = function(wif) {
  var buf=new Buffer(base58.decode(wif))
  return buf.slice(1,-4).toString('hex')
}

exports.getwif = function(private_key, coin, compressed) {
  //console.log('getwif',private_key,coin)
  if (coin==='') {
    var ver=''
  } else {
    var ver=wif_version[coin]
  }
  var buf
  if (typeof(private_key)==='object') {
    //var name=Object.prototype.toString.call(private_key)
    if ((private_key instanceof Buffer)||(private_key instanceof SlowBuffer)) {
      buf=prependversion(private_key, ver)
      if (compressed) {
	buf=appendcompressionflag(buf)
      }
    } else {
      buf=undefined
    }
  } else if (typeof(private_key)==='string') {
    buf=new Buffer(ver+private_key, 'hex')
  } else {
    buf=undefined
  }
  buf=Buffer.concat([buf, this.getchecksum(buf)])
  return new Buffer(base58.encode(buf)).toString()
}

exports.brainwalletgen = function(passphrase) {
  return crypto.createHash('sha256').update(passphrase).digest()
}

exports.wif_invalid = function(coin, address) {
  var buf=new Buffer(base58.decode(address))
  var checksum=buf.slice(-4)
  var fn=eval(algo[coin])

  if ((wif_version[coin])&&(wif_version[coin].length!=2)) {
    console.log(coin, 'fail coin wif_version')
    return -3
  } else if (buf.slice(0, 1).toString('hex') !== wif_version[coin]) {
    console.log(coin, 'fail wif_version')
    return -1
  } else if (fn===undefined) {
    console.log(coin, 'fail coin algo')
    return -3
  } else if (checksum.toString('hex') !== fn(buf.slice(0, buf.length-4)).slice(0, 4).toString('hex')) {
    console.log(coin, 'fail checksum')
    return -2
  } else {
    return 0
  }
}

exports.invalid = function(coin, address) {
  var buf=new Buffer(base58.decode(address))
  var checksum=buf.slice(-4)
  var fn=eval(algo[coin])

  if ((version[coin])&&(version[coin].length!=2)) {
    console.log(coin, 'fail coin version')
    return -3
  } else if (buf.slice(0, 1).toString('hex') !== version[coin]) {
    console.log(coin, 'fail version')
    return -1
  } else if (fn===undefined) {
    console.log(coin, 'fail coin algo')
    return -3
  } else if (checksum.toString('hex') !== fn(buf.slice(0, buf.length-4)).slice(0, 4).toString('hex')) {
    console.log(coin, 'fail checksum')
    return -2
  } else {
    return 0
  }
}

var BTCvbuf=new Buffer('0488ADE4', 'hex')
var LTCvbuf=new Buffer('019D9CFE', 'hex')
var zeros=new Buffer('000000000000000000', 'hex')
var zero=new Buffer('00', 'hex')

exports.getBIP32Digest = function(seed) {
  var hmac=crypto.createHmac('sha512', 'Bitcoin seed')
  hmac.update(seed)
  return hmac.digest()
}
exports.getBIP32RootKey = function(digest) {
  var msk=digest.slice(0, 32)
  var mcc=digest.slice(32)
  return this.getwif(Buffer.concat([LTCvbuf, zeros, mcc, zero, msk]), '')
}
