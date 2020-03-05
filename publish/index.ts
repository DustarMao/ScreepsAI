import https from 'https'

export default async function publish(branch: string = 'main', assetData: string = 'dist/assets.json') {
  const config = require('../.screeps.json')
  const asset = require('../dist/assets.json')
  const req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Token': config.token,
    }
  }, res => {
    if ((res?.statusCode ?? 0) >= 400) {
      console.error(res.statusMessage, res)
    }
  })
  req.write(JSON.stringify({
    branch, modules: asset
  }))
  req.end()
}
