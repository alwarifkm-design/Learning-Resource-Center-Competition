from pathlib import Path
import struct, zlib
root = Path(r'c:\Users\almam\Downloads\مركز مصادر التعلم (مدرسة الإمام المهنا بن سلطان 10-12)')
(root / 'public').mkdir(exist_ok=True)

w, h = 260, 100
raw = bytearray()
for y in range(h):
    raw.append(0)
    for x in range(w):
        r, g, b = 18, 38, 72
        if 14 <= x <= 75 and 14 <= y <= 88:
            r, g, b = 18, 38, 72
        elif 90 <= x <= 240 and 20 <= y <= 80:
            r, g, b = 255, 255, 255
        raw.extend((r, g, b, 255))

def chunk(tag, data):
    return struct.pack('!I', len(data)) + tag + data + struct.pack('!I', zlib.crc32(tag + data) & 0xffffffff)

img = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(bytes(raw), 9)) + chunk(b'IEND', b'')
(root / 'public' / 'msader.png').write_bytes(img)
print('created', (root / 'public' / 'msader.png'))
