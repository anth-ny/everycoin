var ec=require('../everycoin.js')
var address=require('./addresses.json')
var assert=require('assert')

var privk=ec.brainwalletgen('correct horse battery staple')
assert.equal(privk.toString('hex'), 'c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
assert.equal(ec.getwif(privk, 'BTC'), '5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS')
var pubk=ec.getpublickey(privk, false)
assert.equal(pubk.toString('hex'), '0478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455')
assert.equal(ec.getaddress(pubk, 'BTC'), '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T')
pubk=ec.getpublickey(privk, true)
assert.equal(pubk.toString('hex'), '0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71')
assert.equal(ec.getaddress(pubk, 'BTC'), '1C7zdTfnkzmr13HfA2vNm5SJYRK6nEKyq8')

assert.equal(ec.getpriv('5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS'), 'c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')

privk='0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D'
assert.equal(ec.getwif(privk, 'BTC'), '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ')
//assert.equal(ec.wif_to_privk('5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'), '0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D')
assert.equal(ec.wif_invalid('BTC', '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'), 0)

privk='18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725'
var pubk=ec.getpublickey(privk, false)
assert.equal(pubk.toString('hex'), '0450863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6')
assert.equal(ec.getaddress(pubk, 'BTC'), '16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM')

address.forEach(function (arr) {
  var coin=arr[0]
  var address=arr[1]
  if (ec.invalid(coin, address)<0) {
    console.log(coin, "fail")
    process.exit()
  } else {
    console.log(coin, "pass")
  }
})
