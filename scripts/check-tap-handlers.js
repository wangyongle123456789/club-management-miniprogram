const fs = require('fs')
const path = require('path')
function findPages() {
  const res = []
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) {
        if (['node_modules', 'cloud', 'components'].includes(e.name)) continue
        walk(full)
      } else if (e.name.endsWith('.wxml')) {
        const base = full.slice(0, -5)
        res.push({ wxml: base + '.wxml', js: base + '.js' })
      }
    }
  }
  walk('pages')
  return res
}
const pages = findPages()
const tapRe = /\b(?:bind|catch|bind:)(?:tap|touchstart|touchend|longpress|longtap)\s*=\s*["']?([A-Za-z0-9_]+)/g
const dead = []
pages.forEach(p => {
  if (!fs.existsSync(p.wxml) || !fs.existsSync(p.js)) return
  const wxml = fs.readFileSync(p.wxml, 'utf8')
  const js = fs.readFileSync(p.js, 'utf8')
  const mn = new Set()
  let mm
  const mRe = /([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/g
  while ((mm = mRe.exec(js))) mn.add(mm[1])
  const aRe = /([A-Za-z0-9_]+)\s*:\s*\([^)]*\)\s*=>/g
  while ((mm = aRe.exec(js))) mn.add(mm[1])
  let t
  const used = new Set()
  while ((t = tapRe.exec(wxml))) used.add(t[1])
  used.forEach(n => {
    if (!mn.has(n)) dead.push(p.wxml.replace(process.cwd(), '.').replace(/\\/g, '/') + ' => ' + n + '()')
  })
})
console.log(dead.length ? '❌ 死链:\n' + dead.join('\n') : '✅ 全站 bindtap 无死链')
