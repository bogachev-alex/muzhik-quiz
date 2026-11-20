import json, re, sys
d = sys.argv[1]; S = sys.argv[2]
r = lambda f: open(f'{d}/{f}', encoding='utf-8').read()
photos = json.load(open(f'{S}/crop/photos.json'))
cred = json.load(open(f'{S}/photos/credits.json'))
def artist(a):
    if a.startswith('Unknown') or not a: return ''
    a = re.sub(r'^Photograph by ', '', a); a = a.split(',')[0].split(' per ')[0]
    return re.sub(r'\s*\(.*', '', a).replace('. Uploader cropped.', '').strip()
cred = {k: {'artist': artist(v['artist']), 'license': v['license']} for k, v in cred.items() if k in photos}
core = r('core.js').replace('/*BIAS*/[]', r('bias.json').strip())
body = (r('body.html').replace('/*PHOTOS*/{}', json.dumps(photos))
        .replace('/*CREDITS*/{}', json.dumps(cred, ensure_ascii=False))
        .replace('/*CORE*/', core).replace('/*APP*/', r('app.js') + r('app2.js')))
html = r('head.css.html') + r('extra.css') + body
open(f'{d}/muzhik-quiz.html', 'w', encoding='utf-8').write(html)
print(len(html.encode()) // 1024, 'KB')
