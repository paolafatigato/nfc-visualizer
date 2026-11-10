// Dati INVENTATI usati da tutte le pagine fittizie.

/* ---------- Lingua: inglese per Inglese + seconde lingue, italiano per il resto ---------- */
const ENGLISH_SUBJECTS = ['inglese', 'english', 'spagnolo', 'spanish', 'francese', 'french', 'tedesco', 'german'];
function langForSubject(subject) {
  return ENGLISH_SUBJECTS.includes((subject || '').trim().toLowerCase()) ? 'en' : 'it';
}
const L = lang => (lang === 'it' ? 1 : 0);   // indice per le coppie [en, it]

/* ---------- Colori assegnati in automatico (l'admin può cambiarli) ---------- */
const PALETTE = ['#9333EA', '#0E9F8A', '#E8710A', '#2563EB', '#DB2777', '#65A30D', '#B45309', '#0891B2'];

/* ---------- Valuta: { symbol, name, pos } — pos 'before' ($5) oppure 'after' (5 ⭐) ---------- */
function fmtMoney(cur, n) {
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  return cur.pos === 'after' ? `${sign}${a} ${cur.symbol}` : `${sign}${cur.symbol}${a}`;
}
function fmtSigned(cur, n) { return (n > 0 ? '+' : '') + fmtMoney(cur, n); }

/* ---------- Default premi, ispirati a quelli di Ms Fatigato ---------- */
// [en, it] per nome e descrizione
const DEFAULT_REWARDS = [
  { icon: '📅', cost: 100, name: ['1 week no homework', '1 settimana senza compiti'], desc: ['One full week with no homework', 'Una settimana intera senza compiti'] },
  { icon: '🪑', cost: 100, name: ['Deskmate for 1 week', 'Compagno di banco per 1 settimana'], desc: ['Choose your deskmate for one week', 'Scegli il compagno di banco per una settimana'] },
  { icon: '🪑', cost: 50, name: ['Deskmate for 1h', 'Compagno di banco per 1 ora'], desc: ['Choose your deskmate for one hour', 'Scegli il compagno di banco per un\'ora'] },
  { icon: '🎵', cost: 80, name: ['Choose a song', 'Scegli una canzone'], desc: ['Choose the song to listen to in class', 'Scegli la canzone da ascoltare in classe'] },
  { icon: '👥', cost: 300, name: ['Group work', 'Lavoro di gruppo'], desc: ['Choose your group for the next group activity', 'Scegli il gruppo per la prossima attività'] },
  { icon: '📢', cost: 20, name: ['Shoutout to a friend', 'Dedica a un amico'], desc: ['A 3-minute announcement to the class', 'Un annuncio di 3 minuti alla classe'] },
  { icon: '❌', cost: 400, name: ['Remove worst grade', 'Cancella il voto peggiore'], desc: ['Delete your worst grade', 'Elimina il tuo voto peggiore'] },
  { icon: '🚫', cost: 50, name: ['No homework', 'Niente compiti'], desc: ['Skip homework for today', 'Salta i compiti di oggi'] },
  { icon: '💫', cost: 300, name: ['+1 to grade', '+1 al voto'], desc: ['Increase one grade by 1 point', 'Aumenta un voto di 1 punto'] }
];
const DEFAULT_QUICK = [
  { icon: '🧹', amount: 5, name: ['Clean class', 'Classe pulita'], desc: ['The class is clean when you leave', 'L\'aula è pulita quando esci'] },
  { icon: '📧', amount: 50, name: ['Weekly email', 'Email settimanale'], desc: ['Email a family member about the week', 'Scrivi a un familiare cosa hai fatto'] },
  { icon: '📒', amount: 10, name: ['Notebook ok', 'Quaderno ok'], desc: ['Show the notebook for checking', 'Mostra il quaderno'] },
  { icon: '🎨', amount: 20, name: ['Beautiful notebook', 'Quaderno bellissimo'], desc: ['Creative work with drawing and color', 'Lavoro creativo con disegni e colori'] },
  { icon: '🤩', amount: 100, name: ['The best notebook!', 'Il miglior quaderno!'], desc: ['Perfectly organized, with drawings', 'Perfettamente organizzato'] },
  { icon: '📖', amount: 150, name: ['Book comment', 'Commento al libro'], desc: ['Finish a book, write summary and review', 'Finisci un libro, scrivi riassunto e recensione'] }
];
// NB Check (come nel sito attuale): valido per TUTTI di default, poi ognuno modifica importi/etichette
const DEFAULT_NB = [
  { key: 'missing', icon: '⚠️', amount: 0, warning: true, label: ['No NB', 'No quad.'], reason: ['No Notebook', 'Quaderno mancante'] },
  { key: 'nohw', icon: '📚', amount: 0, warning: true, label: ['No HW', 'No comp.'], reason: ['No Homework', 'Compiti mancanti'] },
  { key: 'ugly', icon: '😬', amount: 0, label: ['Ugly', 'Brutto'], reason: ['Notebook ugly', 'Quaderno brutto'] },
  { key: 'ok', icon: '📒', amount: 10, label: ['Ok', 'Ok'], reason: ['Notebook ok', 'Quaderno ok'] },
  { key: 'pretty', icon: '🎨', amount: 20, upgrade: 'stunning', label: ['Pretty', 'Bello'], reason: ['Beautiful notebook', 'Quaderno bellissimo'] },
  { key: 'stunning', icon: '✨', amount: 40, hidden: true, label: ['Stunning', 'Stupendo'], reason: ['Stunning notebook', 'Quaderno stupendo'] },
  { key: 'best', icon: '🤩', amount: 100, label: ['Best', 'Il top'], reason: ['The best Notebook!', 'Il miglior quaderno!'] }
];
// Compiti facoltativi: nome, icona e importo di default (modificabili)
const DEFAULT_HW = { icon: '📚', name: ['Optional homework', 'Compiti facoltativi'], price: 30 };

// Costruisce i default nella lingua del docente. songLang = lingua straniera (solo per i prof di lingue)
function buildDefaults(lang, songLang) {
  const i = L(lang);
  const rewards = DEFAULT_REWARDS.map(r => ({ icon: r.icon, name: r.name[i], description: r.desc[i], cost: r.cost }));
  if (songLang) rewards.splice(4, 0, { icon: '🎶', name: `Choose a song in ${songLang}`, description: `Choose a song in ${songLang} to listen to in class`, cost: 50 });
  const quick = DEFAULT_QUICK.map(q => ({ icon: q.icon, name: q.name[i], description: q.desc[i], amount: q.amount }));
  const nb = DEFAULT_NB.map(g => ({ key: g.key, icon: g.icon, amount: g.amount, warning: !!g.warning, hidden: !!g.hidden, upgrade: g.upgrade, label: g.label[i], reason: g.reason[i] }));
  const hw = { icon: DEFAULT_HW.icon, name: DEFAULT_HW.name[i], price: DEFAULT_HW.price };
  return { rewards, quick, nb, hw };
}

/* ---------- Docenti ---------- */
const MOCK = {
  school: 'Carducci',
  student: { name: 'Verdi Giulia', className: '2A' },
  teachers: [
    {
      id: 'fatigato', name: 'Ms Fatigato', subject: 'English', emoji: '🇬🇧', email: 'fatigato@gmail.com',
      lang: 'en', color: PALETTE[0], currency: { symbol: '$', name: 'Dollars', pos: 'before' }, songLang: 'English',
      classes: ['2A', '3B', '1C'], balance: 185, pending: 0,
      tx: [
        { icon: '📒', amount: 10, r: ['Notebook ok', 'Quaderno ok'], w: ['2h ago', '2 ore fa'] },
        { icon: '🧹', amount: 5, r: ['Clean class', 'Classe pulita'], w: ['yesterday', 'ieri'] },
        { icon: '⚠️', amount: -10, r: ['Homework missing', 'Compiti mancanti'], w: ['3d ago', '3 g fa'] },
        { icon: '⭐', amount: 120, r: ['Test 9/10', 'Verifica 9/10'], w: ['1w ago', '1 sett. fa'] },
        { icon: '🎁', amount: -80, r: ['Redeemed: Choose a song', 'Riscattato: Scegli una canzone'], w: ['2w ago', '2 sett. fa'] }
      ]
    },
    {
      id: 'rossi', name: 'Prof Rossi', subject: 'Italiano', emoji: '📖', email: 'rossi@gmail.com',
      lang: 'it', color: PALETTE[1], currency: { symbol: '⭐', name: 'Stelline', pos: 'after' }, songLang: null,
      classes: ['2A', '3B'], balance: 62, pending: 20,
      tx: [
        { icon: '🎨', amount: 20, r: ['Quaderno bellissimo', 'Quaderno bellissimo'], w: ['1 g fa', '1 g fa'] },
        { icon: '🧹', amount: 5, r: ['Classe pulita', 'Classe pulita'], w: ['4 g fa', '4 g fa'] },
        { icon: '⚠️', amount: -5, r: ['Libro dimenticato', 'Libro dimenticato'], w: ['1 sett. fa', '1 sett. fa'] },
        { icon: '📖', amount: 50, r: ['Commento al libro', 'Commento al libro'], w: ['2 sett. fa', '2 sett. fa'] }
      ]
    },
    {
      id: 'bianchi', name: 'Prof Bianchi', subject: 'Matematica', emoji: '📐', email: 'bianchi@gmail.com',
      lang: 'it', color: PALETTE[2], currency: { symbol: '€', name: 'Euro', pos: 'before' }, songLang: null,
      classes: ['2A'], balance: 60, pending: 0,
      tx: [
        { icon: '⚠️', amount: -15, r: ['Disturbo durante la lezione', ''], w: ['2 g fa', ''] },
        { icon: '🧮', amount: 75, r: ['Alla lavagna', ''], w: ['5 g fa', ''] }
      ]
    },
    {
      id: 'lopez', name: 'Ms López', subject: 'Spanish', emoji: '🇪🇸', email: 'lopez@gmail.com',
      lang: 'en', color: PALETTE[3], currency: { symbol: '🌮', name: 'Tacos', pos: 'after' }, songLang: 'Spanish',
      classes: ['2A', '1C'], balance: 55, pending: 0,
      tx: [
        { icon: '🗣️', amount: 15, r: ['Great pronunciation', ''], w: ['3d ago', ''] },
        { icon: '📒', amount: 10, r: ['Notebook ok', ''], w: ['1w ago', ''] }
      ]
    }
  ]
};
// Le traduzioni "vuote" delle transazioni ripiegano sul testo disponibile
MOCK.teachers.forEach(t => t.tx.forEach(x => { x.r = [x.r[0] || x.r[1], x.r[1] || x.r[0]]; x.w = [x.w[0] || x.w[1], x.w[1] || x.w[0]]; }));
// Default premi nella lingua di ciascun docente (poi ognuno li modifica)
MOCK.teachers.forEach(t => { const d = buildDefaults(t.lang, t.songLang); t.rewards = d.rewards; t.quick = d.quick; t.nb = d.nb; t.hw = d.hw; t.recurring = []; });

/* ---------- Persistenza tra le pagine dell'anteprima (solo nel browser, serve a vedere le modifiche dell'admin) ---------- */
const MOCK_KEY = 'coolbank-mock-v3';
// Colori delle classi: li decide l'admin (nel sito vero arrivano da Classroom Manager). Qui sono d'esempio.
const CLASS_COLOR_DEFAULT = '#C084FC';   // viola di default, come nel sito attuale
MOCK.classColors = { '2A': '#4F8EF7', '3B': '#F553A6', '1C': '#2ECC71' };
function classColor(c) { return MOCK.classColors[c] || CLASS_COLOR_DEFAULT; }
function saveMock() { try { localStorage.setItem(MOCK_KEY, JSON.stringify({ teachers: MOCK.teachers, classColors: MOCK.classColors })); } catch (e) {} }
function resetMock() { try { localStorage.removeItem(MOCK_KEY); } catch (e) {} location.reload(); }
(function loadMock() {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && Array.isArray(saved.teachers) && saved.teachers.length) MOCK.teachers = saved.teachers;
    if (saved && saved.classColors) MOCK.classColors = saved.classColors;
  } catch (e) {}
})();
// Tutte le classi conosciute (dei docenti + quelle con un colore)
function allClasses() { return [...new Set([...MOCK.teachers.flatMap(t => t.classes), ...Object.keys(MOCK.classColors)])].sort(); }
// Pallini delle classi al posto del menu a tendina. onPick = nome di una funzione globale che riceve la classe ('' = tutte)
function classDots(classes, selected, onPick, allLabel) {
  const dot = (c, label, color) => '<button type="button" class="cdot ' + (c === selected ? 'on' : '') + '" style="--cc:' + color + '" data-c="' + esc(c) + '" onclick="' + onPick + '(this.dataset.c)" title="' + esc(label) + '">' + esc(label) + '</button>';
  return '<div class="cdots">' + (allLabel ? dot('', allLabel, '#6B5B7A') : '') + classes.map(c => dot(c, c, classColor(c))).join('') + '</div>';
}

/* ---------- Colori helper ---------- */
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(', ');
}

/* ---------- Mini-helper condivisi ---------- */
function mockToast(msg) {
  let t = document.getElementById('mockToast');
  if (!t) {
    t = document.createElement('div'); t.id = 'mockToast';
    t.style.cssText = 'position:fixed;top:44px;left:50%;transform:translateX(-50%);background:#2C2036;color:#fff;padding:10px 18px;border-radius:12px;z-index:9999;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:opacity .3s';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = 1;
  clearTimeout(t._h); t._h = setTimeout(() => t.style.opacity = 0, 2400);
}
function mockRibbon(text) {
  document.body.classList.add('has-ribbon');
  const r = document.createElement('div'); r.className = 'mock-ribbon';
  r.innerHTML = '🧪 ANTEPRIMA FITTIZIA – dati inventati, nulla viene salvato ' + (text || '') + '<a href="index.html">← indice</a>';
  document.body.prepend(r);
}
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
