//const ElectrumClient = require('../lib/electrum_client')
const BatchClient = require('../lib/batch_client')

const peers = require('electrum-host-parse').getDefaultPeers('BitcoinSegwit').filter(v => v.ssl)
// const index = peers.length * Math.random() | 0
// console.log(index)
// const getRandomPeer = () => peers[index]
const getRandomPeer = () => peers[0]

const addresses = [
  '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX',
  '3DgktXL8NszQz816kvG8wRGT9xzS2dvpMc',
  '1CrSKzNLaXbCAZB9ScV1R3hFdARx7VAHJo',
  '16TgDDuaamwYYrWk3hpE5usvm5NkWi8Hzj',
  '1Q9upWvgTt1ByP4iDqApz3sEB1N9GHZn9D',
  '1KVhMqzPr8QdHQ6yHhrZUADAfEp9n8kKsA',
]

const main = async () => {
  const peer = getRandomPeer()
  console.log('begin connection: ' + JSON.stringify(peer))

  const bc = new BatchClient(peer.ssl, peer.host, 'ssl')
  await bc.connect()
  try {
    const ver = await bc.request('server.version', ['2.7.11', '1.1'])
    console.log(ver)

    let req = []
    addresses.forEach(addr => {
      req.push(['blockchain.address.listunspent', [addr]])
      // req.push(['blockchain.address.get_balance', [addr]])
    })

    const batchResult = await bc.batchRequest(req)
    console.log(JSON.stringify(batchResult))
  } catch (e) {
    console.error(e)
  }
  await bc.close()
}

main().catch(console.log)
