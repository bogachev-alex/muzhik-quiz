const BLOCKS = ['', 'bg-ink', 'bg-khaki', 'bg-olive', 'bg-sand'];
const A = {};      // answers
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TOTAL = QUESTIONS.length;
const plural = (n, a, b, c) => { const m10=n%10, m100=n%100; return m10===1&&m100!==11?a:(m10>=2&&m10<=4&&(m100<12||m100>14)?b:c); };
const domLabel = v => v <= 15 ? 'очень ведомый' : v <= 35 ? 'скорее ведомый' : v <= 64 ? 'золотая середина' : v <= 85 ? 'скорее доминант' : 'доминант';

/* ---------- текст под того, кто проходит ---------- */
function voice() {
  const who = A.who;
  if (who === 'gf') return { yougot:'по моей мужицкой методике твой мужик — вот этот парфюм:', story:'мой мужик пахнет как', also:'ему также зайдут:',
    mx:'его точка на мужицкой матрице', quad:'его четверть', why:'почему именно он', share:'покажи ему (и подружкам)', tag:'угадала? сохрани карточку и кинь ему 🫵',
    gift:'отправить ему намёк 🎁', giftMsg:(p,u)=>`прошла за тебя мужицкий парфюмерный квиз. ты — ${p.brand} ${p.name}, он же «${p.arch}». теперь я знаю, что тебе дарить 😏\n\nпроверь сам: ${u}`, giftOk:'намёк скопирован. отправляй ему 😇' };
  if (who === 'gift') return { yougot:'по мужицкой методике дарить нужно вот это:', story:'идеальный подарок мужику', also:'запасные варианты:',
    mx:'его точка на мужицкой матрице', quad:'его четверть', why:'почему именно он', share:'поделись', tag:'угадал? сохрани карточку, чтобы не забыть в магазине 🫵',
    gift:'скопировать идею подарка 🎁', giftMsg:(p,u)=>`идея подарка: ${p.brand} ${p.name}. ноты: ${p.notes.join(', ')}.\n\nподобрано тут: ${u}`, giftOk:'идея скопирована' };
  const fem = who === 'self_f';
  return { yougot: fem ? 'по мужицкой методике ты — вот этот парфюм. носи смело:' : 'по моей мужицкой методике ты — вот этот парфюм:',
    story:'по жизни я пахну как', also:'тебе также зайдут:', mx:'твоя точка на мужицкой матрице', quad:'твоя четверть', why:'почему именно он',
    share: fem ? 'покажи подружкам' : 'покажи пацанам', tag: fem ? 'угадал? сохрани карточку и кинь в чат с подружками 🫵' : 'угадал? сохрани карточку и кинь в чат с мужиками 🫵',
    gift:'намекнуть на подарок 🎁', giftMsg:(p,u)=>`по мужицкому парфюмерному квизу я — ${p.brand} ${p.name}, он же «${p.arch}». просто к слову, если не знаешь, что мне дарить…\n\nа ты чем пахнешь? ${u}`, giftOk:'намёк скопирован. кидай в семейный чат 😇' };
}

/* ---------- матрица ---------- */
const MX = { S: 560, pad: 48 };
const mxX = v => MX.pad + v / 100 * (MX.S - 2 * MX.pad);
const mxY = v => MX.pad + (1 - v / 100) * (MX.S - 2 * MX.pad);
const PAL = { fresh:'#9CC3D5', citrus:'#F2C14E', aqua:'#5FA8C8', green:'#7C9A5B', woody:'#A9774A', leather:'#6B3F2A', smoky:'#6E6A66', tobacco:'#8A5A2B', spicy:'#C4532B', sweet:'#D9A35B', fougere:'#8E89B8', fruity:'#D9774E' };
const topNote = p => TAGS.slice().sort((a,b)=>(p.t[b]||0)-(p.t[a]||0))[0];
let LAYOUT = null;

/** Раскладывает флаконы по матрице без наложений, не выпуская их из своей четверти. */
function layout() {
  if (LAYOUT) return LAYOUT;
  const c = MX.S / 2, lo = MX.pad + 14, hi = MX.S - MX.pad - 14;
  const pts = P.map(p => ({ x: mxX(p.rug), y: mxY(p.dom), r: p.rug >= 50, t: p.dom >= 50 }));
  for (let it = 0; it < 120; it++) {
    for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
      const dx = pts[b].x - pts[a].x, dy = pts[b].y - pts[a].y, d = Math.hypot(dx, dy) || .01;
      if (d >= 34) continue;
      const k = (34 - d) / 2 / d; pts[a].x -= dx*k; pts[a].y -= dy*k; pts[b].x += dx*k; pts[b].y += dy*k;
    }
    for (const q of pts) {
      q.x = q.r ? Math.min(hi, Math.max(c + 16, q.x)) : Math.max(lo, Math.min(c - 16, q.x));
      q.y = q.t ? Math.max(lo, Math.min(c - 18, q.y)) : Math.min(hi, Math.max(c + 18, q.y));
    }
  }
  return LAYOUT = pts;
}

function bottleG(p, x, y, sc = 1, cls = '') {
  const col = PAL[topNote(p)], st = 'stroke="currentColor" stroke-width="1.3"';
  const body = [
    `<rect x="-6" y="-9" width="12" height="21" rx="2" fill="${col}" ${st}/><rect x="-3" y="-14" width="6" height="5" class="mx-cap"/>`,
    `<rect x="-9" y="-6" width="18" height="18" rx="3" fill="${col}" ${st}/><rect x="-3.5" y="-11" width="7" height="5" class="mx-cap"/>`,
    `<circle cx="0" cy="3" r="9" fill="${col}" ${st}/><rect x="-2.5" y="-11" width="5" height="5" class="mx-cap"/>`,
    `<path d="M-4 -8 L4 -8 L9 12 L-9 12 Z" fill="${col}" ${st}/><rect x="-2.5" y="-13" width="5" height="5" class="mx-cap"/>`,
  ][p.i % 4];
  return `<g class="mx-b ${cls}" style="color:var(--ink)" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc})"><title>${esc(p.brand+' '+p.name)}</title>${body}<path d="M-3 -4 q2 -2 4 0" stroke="#fff" stroke-width="1.3" fill="none" opacity=".7"/></g>`;
}

/** SVG мужицкой матрицы. opts: { you:{x,y}, win:p, near:[p], youLabel } */
function matrixSVG(opts = {}) {
  const S = MX.S, c = S / 2, lo = MX.pad, hi = S - MX.pad, pts = layout();
  let g = '';
  for (let v = 10; v < 100; v += 10) if (v !== 50) g += `<line class="mx-grid" x1="${mxX(v)}" y1="${lo}" x2="${mxX(v)}" y2="${hi}"/><line class="mx-grid" x1="${lo}" y1="${mxY(v)}" x2="${hi}" y2="${mxY(v)}"/>`;
  const arrow = (x1,y1,x2,y2) => `<line class="mx-axis" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#mxa)"/>`;
  g += arrow(c, c, c, lo - 4) + arrow(c, c, c, hi + 4) + arrow(c, c, lo - 4, c) + arrow(c, c, hi + 4, c);
  g += `<text class="mx-lab" x="${c}" y="${lo - 16}" text-anchor="middle">доминант</text><text class="mx-lab" x="${c}" y="${hi + 30}" text-anchor="middle">ведомый</text>`;
  g += `<text class="mx-lab" x="${lo + 2}" y="${c - 10}">метросексуал</text><text class="mx-lab" x="${hi - 2}" y="${c - 10}" text-anchor="end">лесоруб</text>`;
  g += `<text class="mx-quad" x="${lo + 8}" y="${lo + 26}">${QUADS.tl.name}</text><text class="mx-quad" x="${hi - 8}" y="${lo + 26}" text-anchor="end">${QUADS.tr.name}</text>`;
  g += `<text class="mx-quad" x="${lo + 8}" y="${hi - 12}">${QUADS.bl.name}</text><text class="mx-quad" x="${hi - 8}" y="${hi - 12}" text-anchor="end">${QUADS.br.name}</text>`;
  const hl = new Set([opts.win, ...(opts.near || [])].filter(Boolean).map(p => p.i));
  const order = P.slice().sort((a, b) => (hl.has(a.i) - hl.has(b.i)));
  let names = '';
  for (const p of order) {
    const { x, y } = pts[p.i], win = opts.win && opts.win.i === p.i;
    g += bottleG(p, x, y, win ? 1.7 : hl.has(p.i) ? 1.2 : 1, hl.has(p.i) ? 'hl' : '');
    if (!hl.has(p.i)) continue;
    const below = y + (win ? 36 : 28), youNear = opts.you && Math.hypot(mxX(opts.you.x) - x, mxY(opts.you.y) - below) < 30;
    names += `<text class="mx-name" x="${x}" y="${youNear ? y - (win ? 30 : 22) : below}" text-anchor="middle" ${win ? 'style="font-size:14px"' : ''}>${esc(p.name)}</text>`;
  }
  if (opts.you) {
    const ux = mxX(opts.you.x), uy = mxY(opts.you.y);
    if (opts.win) { const w = pts[opts.win.i]; g += `<line x1="${ux}" y1="${uy}" x2="${w.x}" y2="${w.y}" stroke="var(--rust)" stroke-width="2" stroke-dasharray="4 5"/>`; }
    names += `<g class="mx-you" transform="translate(${ux} ${uy})"><circle class="ring" r="12"/><circle class="dot" r="14"/><text text-anchor="middle" y="4">${esc(opts.youLabel || 'ты')}</text></g>`;
  }
  return `<svg viewBox="0 0 ${S} ${S}" role="img" aria-label="мужицкая парфюмерная матрица: метросексуал–лесоруб по горизонтали, ведомый–доминант по вертикали" class="${hl.size ? 'mx-dim' : ''}">
    <defs><marker id="mxa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker></defs>${g}${names}</svg>`;
}

function renderIntroMatrix() {
  $('#intro-matrix').innerHTML = `<div class="matrix-title">мужицкая парфюмерная матрица</div>${matrixSVG()}<span class="cap">@мастер · наведи на флакон</span>`;
}

/* ---------- вопросы ---------- */
function tileHTML(q, [k, em, label, tag]) {
  const ph = q.photos ? (PHOTOS[k] ? `<img class="ph" src="${PHOTOS[k]}" alt="" loading="lazy">` : `<span class="ph-em">${em}</span>`) : `<span class="em">${em}</span>`;
  return `<button class="tile${q.photos ? ' has-ph' : ''}" aria-pressed="false" data-q="${q.id}" data-k="${esc(k)}">${ph}<span>${esc(label)}</span>${tag ? `<small>${esc(tag)}</small>` : ''}</button>`;
}

function renderQuestions() {
  $('#questions').innerHTML = QUESTIONS.map((q, i) => {
    const head = `<div class="qtitle ${BLOCKS[i % BLOCKS.length]}"><span class="qnum">${i+1}/${TOTAL}</span><h3>${esc(q.q)}</h3>${q.sub?`<p class="qsub">${esc(q.sub)}</p>`:''}</div>`;
    const body = q.slider
      ? `<div class="slider"><div class="sl-out" id="rugout">${rugLabel(50)}</div>
        <input type="range" min="0" max="100" value="50" id="rug" aria-label="${esc(q.q)}">
        <div class="sl-ticks"><span>середина</span></div>
        <div class="sl-ends"><span>${esc(q.left)}</span><span>${esc(q.right)}</span></div></div>
        <button class="btn" id="ruglock">зафиксировать →</button>`
      : `<div class="tiles${q.photos ? ' photos' : q.two ? ' two' : ''}">${q.opts.map(o => tileHTML(q, o)).join('')}</div>`;
    return `<section class="qcard" id="q-${q.id}">${head}${body}</section>`;
  }).join('');
  const r = $('#rug');
  r.addEventListener('input', () => { $('#rugout').textContent = rugLabel(+r.value); if ('rug' in A) A.rug = +r.value; });
  $('#ruglock').addEventListener('click', () => {
    const first = !('rug' in A); A.rug = +r.value;
    $('#q-rug').classList.add('answered'); $('#ruglock').textContent = 'зафиксировано ✓';
    update(); if (first) goNext('rug');
  });
}

$('#questions').addEventListener('click', e => {
  const t = e.target.closest('.tile'); if (!t) return;
  const qid = t.dataset.q, first = !(qid in A);
  A[qid] = t.dataset.k;
  t.parentElement.querySelectorAll('.tile').forEach(b => b.setAttribute('aria-pressed', b === t));
  t.closest('.qcard').classList.add('answered');
  update(); if (first) goNext(qid);
});

function goNext(qid) {
  const idx = QUESTIONS.findIndex(q => q.id === qid);
  const next = QUESTIONS.slice(idx+1).concat(QUESTIONS.slice(0, idx)).find(q => !(q.id in A));
  setTimeout(() => { const el = next ? $('#q-'+next.id) : $('#end'); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 320);
}

let stage = 'questions';
function update() {
  const n = Object.keys(A).length;
  $('#bar').style.width = (n / TOTAL * 100) + '%';
  $('#count').textContent = `${n}/${TOTAL}`;
  if (stage !== 'questions') return;
  const left = TOTAL - n;
  if (left > 0) {
    $('#end').innerHTML = `<div class="locked">ответь ещё на ${left} ${plural(left,'вопрос','вопроса','вопросов')}, чтобы узнать свой парфюм</div>`;
  } else {
    $('#end').innerHTML = `<div class="panel" id="gate"><span class="tape"></span><span class="tape r"></span>
      <h2><span class="ul">результаты готовы…</span> скажем так, отвёртку нашли в гараже.</h2>
      <p>рецепт выписан, точка на матрице найдена, печать поставлена. осталось вскрыть конверт.</p>
      <button class="btn rust" id="reveal">вскрыть мой рецепт</button></div>`;
    $('#reveal').addEventListener('click', loading);
  }
  placeDoodles();
}

function loading() {
  stage = 'loading';
  const lines = ['считаю твою брутальность…','сверяюсь с мужицкой матрицей…','нюхаю 32 флакона…','спрашиваю у бати…'];
  $('#end').innerHTML = `<div class="panel loading"><div class="spin"><i></i></div><p id="ltxt">${lines[0]}</p></div>`;
  $('#end').scrollIntoView({ behavior: 'smooth', block: 'start' });
  let i = 0; const iv = setInterval(() => { i++; const el = $('#ltxt'); if (el) el.textContent = lines[i % lines.length]; }, 650);
  setTimeout(() => { clearInterval(iv); stage = 'result'; showResult(); }, 2600);
}
