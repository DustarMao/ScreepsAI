import https from 'https'
import fs from 'fs'
import config from './.screeps.json'

const branch = process.env.BRANCH || (config as any).branch || 'main'
console.log('upload to branch:', branch)

const main = fs.readFileSync('./dist/main.js')
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
  branch, modules: {main}
}))
req.end()