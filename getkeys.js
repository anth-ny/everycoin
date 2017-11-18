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

console.log('SHA256 SPACE')
rl.question('Enter salt: ', saltEntered)

function saltEntered(salt) {
  console.log('SHA256 SPACE')
  console.log(salt)
  console.log('WL39E CK39')
  rl.question('Enter mnemonic: ', bothEntered.bind(this, salt))
}

function bothEntered(salt, mnemonic) {
  if (false===bip39.validateMnemonic(mnemonic)) {
    console.log('mnemonic invalid')
    process.exit('mnemonic invalid')
  }
  if (salt==='') {
    mnemonic='SHA256 SPACE WL39E CK39 '+mnemonic
  } else {
    console.log('salt:',salt)
    mnemonic='SHA256 SPACE '+salt+' WL39E CK39 '+mnemonic
  }
  console.log('mnemonic:',mnemonic)
  var hash=crypto.createHash('sha256')
  hash.update(mnemonic)
  var msk=hash.digest()
  var pubk_compressed=ec.getpublickey(msk, true)
  var address=ec.getaddress(pubk_compressed, 'LTC')
  var wif=ec.getwif(msk, version['LTC'])
  //qrcode.generate('litecoin:'+address);
  console.log(msk.toString('hex'))
  console.log(wif, address)
  rl.question('Hit enter to clear screen:', clear_screen_and_exit.bind(this, address))
}

function clear_screen_and_exit(address, ignore) {
  for (var count=0; count<50; count++) {
    console.log()
  }
  console.log(address)
  qrcode.generate('litecoin:'+address);
  console.log(address)
  setImmediate(process.exit)
}
