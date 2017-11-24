var ec=require('../everycoin.js')
var address=require('./addresses.json')
var assert=require('assert')

describe('correct horse battery staple', function() {
  var privk=ec.brainwalletgen('correct horse battery staple')
  describe('brainwalletgen', function() {
    it('returns the correct private key', function() {
      assert.equal(privk.toString('hex'), 'c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
    })
  })
  describe('getwif', function() {
    it('returns the correct private key wif', function() {
      assert.equal(ec.getwif(privk, 'BTC'), '5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS')
    })
  })
  describe('getpublickey (uncompressed)', function() {
    var pubk=ec.getpublickey(privk, false)
    it('returns the correct public key', function() {
      assert.equal(pubk.toString('hex'), '0478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455')
    })
    describe('getaddress', function() {
      it('returns the correct BTC address', function() {
        assert.equal(ec.getaddress(pubk, 'BTC'), '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T')
      })
    })
  })
  describe('getpublickey (compressed)', function() {
    var pubk=ec.getpublickey(privk, true)
    it('returns the correct public key', function() {
      assert.equal(pubk.toString('hex'), '0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71')
    })
    describe('getaddress', function() {
      it('returns the correct BTC address', function() {
        assert.equal(ec.getaddress(pubk, 'BTC'), '1C7zdTfnkzmr13HfA2vNm5SJYRK6nEKyq8')
      })
    })
  })
})

describe('getpriv 5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS', function() {
  it('returns the correct private key', function() {
    assert.equal(ec.getpriv('5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS'), 'c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
  })
})

describe('privk 0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D', function() {
  var privk='0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D'
  describe('getwif', function() {
    it('returns the correct private key wif', function() {
      assert.equal(ec.getwif(privk, 'BTC'), '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ')
    })
  })
})
describe('wif_invalid', function() {
  it('returns false on 5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ', function() {
    assert.equal(ec.wif_invalid('BTC', '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'), 0)
  })
})

describe('privk 18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725', function() {
  var privk='18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725'
  var pubk=ec.getpublickey(privk, false)
  describe('getpublickey', function() {
    it('returns the correct uncompressed public key', function() {
      assert.equal(pubk.toString('hex'), '0450863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6')
    })
  })
  describe('getaddress', function() {
    it('returns the correct uncompressed BTC address', function() {
      assert.equal(ec.getaddress(pubk, 'BTC'), '16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM')
    })
  })
})

describe('coin validity', function() {
  address.forEach(function (arr) {
    var coin=arr[0]
    var address=arr[1]
    it('is correct for '+coin+' and '+address, function() {
      assert.equal(ec.invalid(coin, address), 0)
    })
  })
})
