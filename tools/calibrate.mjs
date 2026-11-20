import fs from 'fs';
const core = fs.readFileSync(process.argv[2], 'utf8');
const load = bias => new Function('BIASIN', core.replace('/*BIAS*/[]', 'BIASIN') + '; return {QUESTIONS,P,scoreFor,userDom,quadOf};')(bias);
let bias = new Array(32).fill(0);
let rng = 12345; const rnd = () => (rng = (rng * 1103515245 + 12345) % 2147483648) / 2147483648;
function sim(bias, N) {
  const { QUESTIONS, P, scoreFor, userDom, quadOf } = load(bias);
  const win = new Array(P.length).fill(0), quads = {}; let sameQ = 0;
  for (let n = 0; n < N; n++) {
    const A = {};
    for (const q of QUESTIONS) A[q.id] = q.slider ? Math.round(rnd() * 100) : q.opts[Math.floor(rnd() * q.opts.length)][0];
    const y = userDom(A); let best = null, bs = -1e9;
    for (const p of P) { const s = scoreFor(p, A, y).s; if (s > bs) { bs = s; best = p; } }
    win[best.i]++; const qk = quadOf(A.rug, y); quads[qk] = (quads[qk] || 0) + 1;
    if (quadOf(best.rug, best.dom) === qk) sameQ++;
  }
  return { win: win.map(w => w / N), quads, sameQ: sameQ / N, P };
}
for (let it = 0; it < 40; it++) {
  const { win } = sim(bias, 6000);
  bias = bias.map((b, i) => b + 0.6 * Math.log((1 / 32) / Math.max(win[i], 0.002)));
}
const r = sim(bias, 40000);
console.error('min/max share %', (Math.min(...r.win) * 100).toFixed(2), (Math.max(...r.win) * 100).toFixed(2), 'quads', r.quads, 'winner in user quadrant', (r.sameQ * 100).toFixed(1) + '%');
console.error(r.P.map((p, i) => `${p.name}:${(r.win[i] * 100).toFixed(1)}`).join('  '));
console.log(JSON.stringify(bias.map(b => +b.toFixed(2))));
