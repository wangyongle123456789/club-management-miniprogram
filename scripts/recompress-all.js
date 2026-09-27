const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

// 用 Python PIL 批量重新压缩项目内所有 JPG
const dirs = [
  path.join(__dirname, '..', 'images', 'gallery'),
  path.join(__dirname, '..', 'images', 'banners')
]

const pyScript = `
import sys, os
from PIL import Image
max_w = int(sys.argv[1])
quality = int(sys.argv[2])
files = sys.argv[3:]
for f in files:
    img = Image.open(f)
    if img.mode in ('RGBA','P'):
        img = img.convert('RGB')
    try:
        exif = img._getexif()
        if exif:
            o = exif.get(274)
            if o==3: img = img.rotate(180, expand=True)
            elif o==6: img = img.rotate(270, expand=True)
            elif o==8: img = img.rotate(90, expand=True)
    except Exception: pass
    w,h = img.size
    if w > max_w:
        img = img.resize((max_w, int(h*max_w/w)), Image.LANCZOS)
    img.save(f, 'JPEG', quality=quality, optimize=True)
    print(f + ' -> ' + str(os.path.getsize(f)))
`

const files = []
dirs.forEach(d => {
  if (!fs.existsSync(d)) return
  fs.readdirSync(d).forEach(f => {
    if (/\.(jpg|jpeg)$/i.test(f)) files.push(path.join(d, f))
  })
})

const python = 'C:/Users/Administrator/.workbuddy/binaries/python/versions/3.13.12/python.exe'
execFileSync(python, ['-c', pyScript, '800', '55', ...files], { stdio: 'inherit' })
console.log('done')
