import sys, os, base64, io, json
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
focus = {'tsoi':.05,'sinatra':.08,'basta':.02,'craig':.3,'hamm':.3,'murphy':0,'pitt':.15,'vysotsky':.2,'zimmer':.05,'krug':.35,'bodrov':0,'gandolfini':.12,'gosling':.4,'bale':.12,'duchovny':.05,'cranston':.05,'statham':.3,'kanye':.06}
zoom = {}
out = {}
for f in sorted(os.listdir(src)):
    if not f.endswith('.jpg') or f.startswith('lube'): continue
    k = f[:-4]; im = Image.open(f'{src}/{f}').convert('RGB'); w, h = im.size
    tw, th = (w, round(w*3/4)) if w*3/4 <= h else (round(h*4/3), h)
    if k in zoom:
        cx, cy, s = zoom[k]; tw, th = round(w*s), round(w*s*3/4); x = round(min(w-tw, max(0, cx*w - tw/2))); y = round(cy*h)
    else:
        x = (w - tw)//2; y = round((h - th) * focus.get(k, .5))
    im = im.crop((x, y, x+tw, y+th)).resize((400, 300), Image.LANCZOS)
    im.save(f'{dst}/{k}.jpg', quality=72, optimize=True, progressive=True)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=70, optimize=True); out[k] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
json.dump(out, open(f'{dst}/photos.json','w'))
print({k: len(v)//1024 for k,v in out.items()}, sum(len(v) for v in out.values())//1024, 'KB')
