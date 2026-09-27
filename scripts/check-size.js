const fs = require('fs')
const path = require('path')
const app = JSON.parse(fs.readFileSync('app.json', 'utf8'))
const ignore = (app.packOptions && app.packOptions.ignore || []).map(i => i.value)
function shouldIgnore(p) {
  return ignore.some(v => {
    const re = new RegExp(v.replace(/\//g, '\\/').replace(/\*\*/g, '[\\s\\S]*').replace(/\*/g, '[^/]*'))
    return re.test(p)
  })
}
let total = 0, count = 0
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name)
    const r = f.replace(/\\/g, '/')
    if (shouldIgnore(r)) continue
    if (e.isDirectory()) walk(f)
    else { total += fs.statSync(f).size; count++ }
  }
}
walk('.')
console.log('Main package: ' + (total / 1024).toFixed(1) + ' KB (' + count + ' files) / limit 2048 KB')
