#!/usr/bin/env python3
"""压缩用户提供的 8 张真实社团照片，写入 images/gallery/ 并生成 banner 图"""
import os
import shutil
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = r'C:\Users\Administrator\Desktop'
GALLERY_DIR = os.path.join(BASE, 'images', 'gallery')
BANNER_DIR = os.path.join(BASE, 'images', 'banners')
os.makedirs(GALLERY_DIR, exist_ok=True)
os.makedirs(BANNER_DIR, exist_ok=True)

# 哈希文件名 -> 语义化文件名
FILES = {
    'ab27bb75898e6736afe2c1b035f82d9b.jpg': 'real-lab-girls-1.jpg',
    '56081f5350217f036b2d1b58d340126c.jpg': 'real-lab-boys-look-1.jpg',
    'af597c007c80b8e063276553e8403270.jpg': 'real-lab-boys-look-2.jpg',
    '9c3005e6b654a20292eb88b5871c3bbf.jpg': 'real-lab-boys-blue.jpg',
    '6bb2ae6072055483120280f287a6e248.jpg': 'real-lab-girls-office.jpg',
    'c8d08adcd072e4c60526292ec04135a1.jpg': 'real-lab-wide-1.jpg',
    '63124d1a4e35027de7b3343b53cba8d8.jpg': 'real-lab-wide-2.jpg',
    '95f8ef4ae6e786e1988ceabf94199166.jpg': 'real-outdoor-boys.jpg',
}

def compress(src, dst, max_w=900, quality=65):
    img = Image.open(src)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    # 处理手机照片可能的 EXIF 旋转
    try:
        exif = img._getexif()
        if exif:
            orientation = exif.get(274)
            if orientation == 3:
                img = img.rotate(180, expand=True)
            elif orientation == 6:
                img = img.rotate(270, expand=True)
            elif orientation == 8:
                img = img.rotate(90, expand=True)
    except Exception:
        pass
    w, h = img.size
    if w > max_w:
        ratio = max_w / w
        img = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
    img.save(dst, 'JPEG', quality=quality, optimize=True)
    return os.path.getsize(dst)

print('Compressing user-provided club photos...')
total = 0
for src_name, dst_name in FILES.items():
    src = os.path.join(SRC_DIR, src_name)
    dst = os.path.join(GALLERY_DIR, dst_name)
    if not os.path.exists(src):
        print(f'  MISSING source: {src_name}')
        continue
    size = compress(src, dst)
    total += size
    print(f'  {dst_name}: {size/1024:.1f} KB')

print(f'Gallery total: {total/1024:.1f} KB')

# 生成 banner（直接用合适的横版图复制即可，WXSS 用 object-fit:cover 裁剪）
print('Generating banners from user photos...')
banner_map = {
    'real-lab-wide-1.jpg': 'real-banner-lab.jpg',
    'real-outdoor-boys.jpg': 'real-banner-outdoor.jpg',
}
banner_total = 0
for src_name, dst_name in banner_map.items():
    src = os.path.join(GALLERY_DIR, src_name)
    dst = os.path.join(BANNER_DIR, dst_name)
    shutil.copy2(src, dst)
    size = os.path.getsize(dst)
    banner_total += size
    print(f'  {dst_name}: {size/1024:.1f} KB')

print(f'Banner total: {banner_total/1024:.1f} KB')
print('Done.')
