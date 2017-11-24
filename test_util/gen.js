var ec=require('../everycoin.js')
var version=require('../json/versions.json')

var crypto = require('crypto')

privk=ec.brainwalletgen('correct horse battery staple')
pubk=ec.getpublickey(privk, false)
pubk_compressed=ec.getpublickey(privk, true)
Object.keys(version).forEach(function (coin) {
  var address=ec.getaddress(pubk, coin)
  console.log('["'+coin+'", "'+address+'"],')
  var address=ec.getaddress(pubk_compressed, coin)
  console.log('["'+coin+'", "'+address+'"],')
})
