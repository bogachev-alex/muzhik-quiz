
function bottleSVG(p) {
  const c = PAL[topNote(p)];
  return `<svg viewBox="0 0 80 100" aria-hidden="true"><rect x="32" y="6" width="16" height="14" rx="2" fill="#23272A"/><rect x="36" y="18" width="8" height="8" fill="#8F8A7E"/>
  <rect x="14" y="26" width="52" height="66" rx="8" fill="${c}" opacity=".9" stroke="#23272A" stroke-width="2.5"/>
  <rect x="22" y="48" width="36" height="24" rx="2" fill="#F4F1EA" stroke="#23272A" stroke-width="1.2"/>
  <text x="40" y="63" text-anchor="middle" font-family="Jost, sans-serif" font-size="9" font-weight="600" fill="#23272A">№${String(p.i+1).padStart(2,'0')}</text>
  <path d="M20 34 q4 -3 8 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/></svg>`;
}
const loudRu = l => ['','тихий, держится у кожи','уверенный, слышно на расстоянии руки','мощный, слышно из соседнего подъезда'][l];
const formalRu = f => f >= .75 ? 'костюм и вечерние выходы' : f >= .45 ? 'smart casual, работа и свидания' : 'худи, кроссы, выходные';
const seasonRu = p => { const warm=(p.t.sweet||0)+(p.t.tobacco||0)+(p.t.smoky||0)+(p.t.leather||0), cool=(p.t.fresh||0)+(p.t.aqua||0)+(p.t.citrus||0)+(p.t.green||0); return warm-cool>=2?'осень–зима, вечер':cool-warm>=2?'весна–лето, день':'круглый год'; };
const shopLink = p => 'https://www.google.com/search?q=' + encodeURIComponent(`${p.brand} ${p.name} купить`);
const pageUrl = () => location.href.split('#')[0];

let RESULT = null;
function showResult() {
  const ydom = userDom(A), x = A.rug ?? 50, V = voice();
  const ranked = P.map(p => ({ p, ...scoreFor(p, A, ydom) })).sort((a,b) => b.s - a.s);
  const top = ranked[0], p = top.p, qk = quadOf(x, ydom), Q = QUADS[qk];
  RESULT = { p, qk, x, ydom, V };
  const same = quadOf(p.rug, p.dom) === qk;
  const why = top.parts.filter(x => x.c > 0 && x.hit.length).sort((a,b)=>b.c-a.c).slice(0,3)
    .map(x => `<li><b>«${esc(x.label)}»</b> → ${x.hit.slice(0,2).map(k=>TAG_RU[k]).join(' и ')}</li>`).join('');
  const mxLine = `<li><b>матрица</b> → ${same ? `вы с ним в одной четверти: «${Q.name}»` : `он стоит ближе всех к ${A.who === 'gf' || A.who === 'gift' ? 'его' : 'твоей'} точке, хоть и в четверти «${QUADS[quadOf(p.rug, p.dom)].name}»`}</li>`;
  const rxNo = '№ ' + String(Math.floor(1000 + Math.random()*8999));
  const today = new Date().toLocaleDateString('ru-RU');
  const near = ranked.slice(1,4).map(r => r.p);
  const runners = near.map((q,i) => `<a class="runner" href="${shopLink(q)}" target="_blank" rel="noopener"><span class="mono">#${i+2} · ${esc(q.brand)}</span><b>${esc(q.name)}</b><span>${esc(q.arch)}</span></a>`).join('');
  const reacts = ['МОЩЬ','БАЗА','ЖИЗА','ОГОНЬ','ЭТО Я','ХМ','МИМО'];
  const youLabel = A.who === 'gf' || A.who === 'gift' ? 'он' : 'ты';

  $('#end').innerHTML = `<div class="panel" id="result">
    <p class="yougot">${V.yougot}</p>
    <article class="rx spritzed" id="rx">
      <div class="rx-head"><span class="rx-title"><span class="rx-sym">Rx</span> мужицкий рецепт</span><span class="rx-no">${rxNo} · ${today}</span></div>
      <div class="rx-body">
        <div class="rx-top"><div class="rx-ph">${bottleSVG(p)}</div>
          <div class="rx-drug"><span class="brand">${esc(p.brand)}</span><span class="pname ul">${esc(p.name)}</span><p class="rx-arch">${esc(p.arch)}</p></div></div>
        <dl class="spec">
          <div><dt>ноты</dt><dd>${p.notes.map(esc).join(', ')}</dd></div>
          <div><dt>семейство</dt><dd>${esc(p.fam)}</dd></div>
          <div><dt>шлейф</dt><dd>${loudRu(p.loud)}</dd></div>
          <div><dt>когда носить</dt><dd>${seasonRu(p)}</dd></div>
          <div><dt>дресс-код</dt><dd>${formalRu(p.formal)}</dd></div>
          <div><dt>четверть</dt><dd>${esc(QUADS[quadOf(p.rug, p.dom)].name)}</dd></div>
          <div><dt>в двух словах</dt><dd><em>${esc(p.blurb)}</em></dd></div>
        </dl>
        <div class="rx-sig"><i>${V.why}</i><ul>${why}${mxLine}</ul></div>
        <div class="rx-foot"><span class="rx-stamp">одобрено гаражным советом</span>
          <div class="rx-signed"><div class="sigline"><span class="x">✕</span><span class="sig">Мастер</span></div><small>главный по мужскому парфюму</small></div></div>
      </div>
    </article>
    <p class="shop"><a href="${shopLink(p)}" target="_blank" rel="noopener">где купить ${esc(p.name)} →</a></p>

    <div class="section-h">${V.mx}</div>
    <div class="matrix">${matrixSVG({ you:{ x, y: ydom }, win:p, near, youLabel })}<span class="cap">пунктир ведёт к ${youLabel === 'он' ? 'его' : 'твоему'} аромату</span></div>
    <div class="quad"><span class="mono">${V.quad} · ${Q.axis}</span><b>${Q.name}</b><p>${Q.text}</p></div>
    <div class="coords">
      <div class="coord"><span class="mono">метросексуал → лесоруб</span><b>${x}/100</b><small>${rugLabel(x)}</small></div>
      <div class="coord"><span class="mono">ведомый → доминант</span><b>${ydom}/100</b><small>${domLabel(ydom)}</small></div>
    </div>

    <div class="section-h">твоя реакция?</div>
    <div class="reacts">${reacts.map(r=>`<button class="react" aria-pressed="false"><span class="dot">${r}</span></button>`).join('')}</div>

    <div class="section-h">${V.share}</div>
    <div class="share">
      <button class="btn rust wide" id="story">сделать карточку для сторис 🪓</button>
      <button class="btn" id="gift">${V.gift}</button>
      <button class="btn khaki" id="copylink">скопировать ссылку</button>
    </div>
    <p class="tagline">${V.tag}</p>

    <div class="section-h">${V.also}</div>
    <div class="runners">${runners}</div>

    <button class="btn ghost" id="retake">пройти заново</button>
  </div>`;

  document.querySelectorAll('.react').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    document.querySelectorAll('.react').forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', on); if (on) toast('принято. записал в журнал');
  }));
  $('#gift').addEventListener('click', () => copyText(V.giftMsg(p, pageUrl()), V.giftOk));
  $('#copylink').addEventListener('click', () => copyText(pageUrl(), 'ссылка скопирована. сравните точки на матрице'));
  $('#story').addEventListener('click', storyCard);
  $('#retake').addEventListener('click', retake);

  setTimeout(() => { $('#result').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  setTimeout(spritz, 450);
  setTimeout(placeDoodles, 600);
}

function spritz() {
  const rx = $('#rx'); if (!rx) return;
  const r = rx.getBoundingClientRect();
  const sp = document.createElement('div'); sp.className = 'spritz';
  sp.style.left = (r.left + r.width/2 + scrollX) + 'px'; sp.style.top = (r.top + 120 + scrollY) + 'px';
  let h = '<div class="mist"></div>';
  const em = ['🪓','🥃','🔥','💈','🌲','🧔','🛠️','🚬'];
  for (let i = 0; i < 12; i++) { const a = Math.random()*Math.PI*2, d = 120 + Math.random()*120;
    h += `<b style="--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--r:${(Math.random()*120-60)|0}deg;animation-delay:${(Math.random()*.2).toFixed(2)}s">${em[i%em.length]}</b>`; }
  sp.innerHTML = h; document.body.appendChild(sp); setTimeout(() => sp.remove(), 2200);
}

function retake() {
  for (const k in A) delete A[k];
  stage = 'questions'; RESULT = null;
  renderQuestions(); update();
  $('#q-' + QUESTIONS[0].id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
async function copyText(txt, ok) {
  try { await navigator.clipboard.writeText(txt); toast(ok); }
  catch (e) { modal(`<p><b>скопируй вручную:</b></p><textarea readonly>${esc(txt)}</textarea>`); const ta = document.querySelector('.sheet textarea'); ta && ta.select(); }
}
function modal(inner) {
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="sheet">${inner}<button class="btn ghost" data-close>закрыть</button></div>`;
  m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) m.remove(); });
  document.body.appendChild(m);
}

function wrapLines(ctx, text, maxW) {
  const words = text.split(' '), lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}

/** Мини-матрица на канвасе сторис: оси, подсвеченная четверть и точка. */
function drawMiniMatrix(c, x0, y0, size, R) {
  const h = size / 2;
  c.fillStyle = '#F6E7DD'; c.fillRect(x0 + (R.qk[1] === 'r' ? h : 0), y0 + (R.qk[0] === 'b' ? h : 0), h, h);
  c.strokeStyle = '#23272A'; c.lineWidth = 3; c.strokeRect(x0, y0, size, size);
  c.beginPath(); c.moveTo(x0 + h, y0); c.lineTo(x0 + h, y0 + size); c.moveTo(x0, y0 + h); c.lineTo(x0 + size, y0 + h); c.stroke();
  c.fillStyle = '#75726B'; c.font = '500 22px Jost'; c.textAlign = 'center';
  c.fillText('доминант', x0 + h, y0 - 12); c.fillText('ведомый', x0 + h, y0 + size + 30);
  c.textAlign = 'left'; c.fillText('метро', x0 + 6, y0 + h - 10); c.textAlign = 'right'; c.fillText('лесоруб', x0 + size - 6, y0 + h - 10);
  const px = x0 + R.x / 100 * size, py = y0 + (1 - R.ydom / 100) * size;
  c.fillStyle = '#D9773F'; c.beginPath(); c.arc(px, py, 18, 0, Math.PI*2); c.fill(); c.strokeStyle = '#FFFFFF'; c.lineWidth = 4; c.stroke();
  c.textAlign = 'center';
}

async function storyCard() {
  const R = RESULT; if (!R) return; const p = R.p;
  try { await Promise.all(['400 100px "Marck Script"','500 50px Jost','700 60px Caveat'].map(f => document.fonts.load(f))); } catch (e) { console.warn('fonts not loaded for story card', e); }
  const W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  c.fillStyle = '#ECE6D6'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#23272A'; c.fillRect(0, 0, W, 220);
  c.fillStyle = '#D9773F'; c.font = '400 120px "Marck Script"'; c.textBaseline = 'alphabetic'; c.fillText('Rx', 80, 160);
  c.fillStyle = '#F2EFE8'; c.font = '500 56px Jost'; c.fillText('мужицкий рецепт', 250, 150);
  c.fillStyle = '#FFFFFF'; c.fillRect(70, 300, W-140, 1260); c.strokeStyle = '#23272A'; c.lineWidth = 5; c.strokeRect(70, 300, W-140, 1260);
  c.fillStyle = '#75726B'; c.font = 'italic 46px Arial'; c.textAlign = 'center'; c.fillText(R.V.story, W/2, 410);
  c.fillStyle = '#23272A'; c.font = 'italic 52px Arial'; c.fillText(p.brand, W/2, 530);
  c.font = '400 140px "Marck Script"'; let y = 680;
  for (const l of wrapLines(c, p.name, W-240)) { c.fillText(l, W/2, y); y += 140; }
  c.strokeStyle = '#D9773F'; c.lineWidth = 10; c.beginPath(); c.moveTo(220, y-100); c.quadraticCurveTo(W/2, y-80, W-220, y-108); c.stroke();
  c.fillStyle = '#A8471F'; c.font = 'italic 46px Arial'; y += 20;
  for (const l of wrapLines(c, p.arch, W-260)) { c.fillText(l, W/2, y); y += 60; }
  y += 20; c.fillStyle = '#75726B'; c.font = '500 32px Jost'; c.fillText('НОТЫ', W/2, y); y += 54;
  c.fillStyle = '#23272A'; c.font = '40px Arial'; c.fillText(p.notes.join(' · '), W/2, y);
  y += 90; c.fillStyle = '#A8471F'; c.font = '700 60px Caveat'; c.fillText(`четверть: «${QUADS[R.qk].name}»`, W/2, y);
  const size = Math.min(300, 1500 - (y + 60));
  if (size >= 140) drawMiniMatrix(c, 140, y + 60, size, R);
  c.save(); c.translate(W-230, 1430); c.rotate(-0.2); c.strokeStyle = '#A8471F'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 100, 0, Math.PI*2); c.stroke();
  c.fillStyle = '#A8471F'; c.font = '700 25px Jost'; c.fillText('ОДОБРЕНО', 0, -10); c.fillText('ГАРАЖНЫМ', 0, 22); c.fillText('СОВЕТОМ', 0, 54); c.restore();
  c.fillStyle = '#23272A'; c.font = '700 64px Caveat'; c.fillText('а ты чем пахнешь? пройди квиз 👇', W/2, 1700);
  c.fillStyle = '#75726B'; c.font = '500 34px Jost'; c.fillText('мужицкий парфюмерный квиз', W/2, 1790);
  modal(`<img alt="карточка для сторис" src="${cv.toDataURL('image/png')}"><p class="tagline">зажми картинку (или правый клик), чтобы сохранить</p>`);
}

function placeDoodles() {
  const d = $('#doodles'); if (innerWidth <= 760) { d.innerHTML = ''; return; }
  const h = document.documentElement.scrollHeight; d.style.height = h + 'px';
  const words = ['мощь','база','🪓','брутально','🥃','шлейф','мужик!','🔥','кожа и дым','💈','по-мужски','🌲','одобряю','🛠️'];
  const wrapL = (innerWidth - 640) / 2; if (wrapL < 90) { d.innerHTML = ''; return; }
  let html = '', i = 0;
  for (let y = 180; y < h - 120; y += 230) {
    const left = i % 2 === 0, x = left ? 16 + (i*37 % Math.max(10, wrapL - 150)) : innerWidth - wrapL + 30 + (i*53 % Math.max(10, wrapL - 150));
    html += `<span style="left:${x}px;top:${y + (i*29 % 70)}px;transform:rotate(${(i*17 % 24) - 12}deg)">${words[i % words.length]}</span>`; i++;
  }
  d.innerHTML = html;
}

function renderCredits() {
  const label = {}; QUESTIONS.forEach(q => q.opts && q.opts.forEach(o => label[o[0]] = o[2]));
  $('#credits').textContent = Object.entries(CREDITS).map(([k, c]) => `${label[k] || k}: ${c.artist || 'автор неизвестен'}, ${c.license}`).join(' · ') + '. эти фото с wikimedia commons. остальные кадры с героями взяты из фильмов и сериалов, права на них у студий.';
}

renderIntroMatrix(); renderQuestions(); update(); renderCredits();
addEventListener('resize', () => { clearTimeout(placeDoodles.t); placeDoodles.t = setTimeout(placeDoodles, 200); });
addEventListener('load', placeDoodles);
