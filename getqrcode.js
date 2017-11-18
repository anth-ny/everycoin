var ec=require('./everycoin.js')
var version=require('./versions.json')
var qrcode = require('qrcode-terminal') //dependency
var bip39 = require('bip39') //dependency
var crypto = require('crypto')
var readline=require('readline')
var rl=readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Enter address: ', addressEntered)

function addressEntered(address) {
  for (var count=0; count<50; count++) {
    console.log()
  }
  console.log(address)
  qrcode.generate('litecoin:'+address);
  console.log(address)
  setImmediate(process.exit)
}
