import fetch, {Request} from 'node-fetch'
import fs from 'fs'

const config = JSON.parse(
  process.env.SCREEPS_CONFIG || fs.readFileSync('./.screeps.json', { encoding: 'utf-8' })
)

const branch = process.env.SCREEPS_BRANCH?.replace(/^.*\//, '')
if (branch == null || branch.length < 1) {
  console.error('must provide BRANCH')
  process.exit(1)
}
console.log('upload to branch:', branch)

const main = fs.readFileSync('./dist/main.js', {encoding: 'utf-8'})

const request = new Request('https://screeps.com:443/api/user/code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Token': config.token
  },
  body: JSON.stringify({branch, modules: {main}})
})
fetch(request)
  .then(async resp => {
    const respBody = await resp.json()
    console.dir(respBody)
    if (!respBody.ok) {
      process.exit(1)
    }
  })
  .catch(err => {
    console.dir(err)
    process.exit(1)
  })
