/* =============================================
   CoolBank - Ledger (conto per docente)
   ---------------------------------------------
   Ogni docente ha il suo "conto" (ledger): saldo per alunno, premi,
   premi rapidi, premi ripetuti, richieste, richiami e transazioni sono
   separati per docente.

   - Il conto storico (quello dell'admin, prima di questa funzione) si
     chiama 'main' e NON richiede nessuna migrazione: i documenti senza
     campo ledgerId appartengono a 'main', e il suo saldo resta nel
     campo students/{id}.balance.
   - Gli altri conti tengono il saldo in students/{id}.balances.{ledgerId}.
   - La configurazione di ogni conto (nome visibile, materia, colore,
     valuta, lingua, classi, impostazioni NB check e compiti) sta in
     schools/{schoolId}/ledgers/{ledgerId} (lettura pubblica: la pagina
     alunno ne ha bisogno).

   Questo file contiene sia helper puri (usati anche da index.html) sia
   la parte che parla con Firestore (solo pagine docente: serve DB/Auth).
   ============================================= */

const Ledger = {
  MAIN: 'main',
  id: 'main',            // conto su cui sta lavorando la pagina docente
  data: null,            // documento di configurazione del conto corrente
  all: [],               // tutti i conti della scuola (solo admin)
  asAdmin: false,        // true se l'admin ha aperto la pagina di un collega (?as=)

  /* ---------- Lingua ---------- */
  // Inglese per Inglese + seconde lingue, italiano per tutte le altre materie
  ENGLISH_SUBJECTS: ['inglese', 'english', 'spagnolo', 'spanish', 'francese', 'french', 'tedesco', 'german'],
  langForSubject(subject) {
    return this.ENGLISH_SUBJECTS.includes((subject || '').trim().toLowerCase()) ? 'en' : 'it';
  },
  idx(lang) { return lang === 'it' ? 1 : 0; },

  /* ---------- Colori assegnati in automatico (l'admin li può cambiare) ---------- */
  PALETTE: ['#9333EA', '#0E9F8A', '#E8710A', '#2563EB', '#DB2777', '#65A30D', '#B45309', '#0891B2'],
  colorForIndex(i) { return this.PALETTE[i % this.PALETTE.length]; },

  hexToRgb(hex) {
    const n = parseInt((hex || '#9333EA').replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(', ');
  },

  /* ---------- Default premi, ispirati a quelli di Ms Fatigato ---------- */
  DEFAULT_REWARDS: [
    { icon: '📅', cost: 100, name: ['1 week no homework', '1 settimana senza compiti'], desc: ['One full week with no homework', 'Una settimana intera senza compiti'] },
    { icon: '🪑', cost: 100, name: ['Deskmate for 1 week', 'Compagno di banco per 1 settimana'], desc: ['Choose your deskmate for one week', 'Scegli il compagno di banco per una settimana'] },
    { icon: '🪑', cost: 50, name: ['Deskmate for 1h', 'Compagno di banco per 1 ora'], desc: ['Choose your deskmate for one hour', 'Scegli il compagno di banco per un\'ora'] },
    { icon: '🎵', cost: 80, name: ['Choose a song', 'Scegli una canzone'], desc: ['Choose the song to listen to in class', 'Scegli la canzone da ascoltare in classe'] },
    { icon: '👥', cost: 300, name: ['Group work', 'Lavoro di gruppo'], desc: ['Choose your group for the next group activity', 'Scegli il gruppo per la prossima attività'] },
    { icon: '📢', cost: 20, name: ['Shoutout to a friend', 'Dedica a un amico'], desc: ['Make an announcement to the class, or a public message to a friend, 3 minutes top', 'Un annuncio di 3 minuti alla classe'] },
    { icon: '❌', cost: 400, name: ['Remove worst grade', 'Cancella il voto peggiore'], desc: ['Delete your worst grade', 'Elimina il tuo voto peggiore'] },
    { icon: '🚫', cost: 50, name: ['No homework', 'Niente compiti'], desc: ['Skip homework for today', 'Salta i compiti di oggi'] },
    { icon: '💫', cost: 300, name: ['+1 to grade', '+1 al voto'], desc: ['Increase one grade by 1 point', 'Aumenta un voto di 1 punto'] }
  ],
  DEFAULT_QUICK: [
    { icon: '🧹', amount: 5, name: ['Clean class', 'Classe pulita'], desc: ['The class is clean when you leave', 'L\'aula è pulita quando esci'] },
    { icon: '📧', amount: 50, name: ['Weekly email', 'Email settimanale'], desc: ['Send an email to a family member, explaining what you did in class this week', 'Scrivi a un familiare cosa hai fatto in classe'] },
    { icon: '📒', amount: 10, name: ['Notebook ok', 'Quaderno ok'], desc: ['Show the notebook for checking', 'Mostra il quaderno'] },
    { icon: '🎨', amount: 20, name: ['Beautiful notebook', 'Quaderno bellissimo'], desc: ['Creative work with drawing and color', 'Lavoro creativo con disegni e colori'] },
    { icon: '🤩', amount: 100, name: ['The best Notebook!', 'Il miglior quaderno!'], desc: ['Perfectly organized, with drawings and color', 'Perfettamente organizzato, con disegni e colori'] },
    { icon: '📖', amount: 150, name: ['Book comment', 'Commento al libro'], desc: ['Finish reading a book and write a summary and a review', 'Finisci un libro e scrivi riassunto e recensione'] }
  ],
  // NB Check: identico a quello attuale, uguale per tutti all'inizio; ognuno poi modifica importi e nomi
  DEFAULT_NB: [
    { key: 'missing', icon: '⚠️', amount: 0, warning: true, warningIcon: '📓', warningType: 'no_notebook', label: ['No NB', 'No quad.'], reason: ['No Notebook', 'Quaderno mancante'] },
    { key: 'nohw', icon: '📚', amount: 0, warning: true, warningIcon: '📚', warningType: 'no_hw', label: ['No HW', 'No comp.'], reason: ['No Homework', 'Compiti mancanti'] },
    { key: 'ugly', icon: '😬', amount: 0, label: ['Ugly', 'Brutto'], reason: ['Notebook ugly', 'Quaderno brutto'] },
    { key: 'ok', icon: '📒', amount: 10, label: ['Ok', 'Ok'], reason: ['Notebook ok', 'Quaderno ok'] },
    { key: 'pretty', icon: '🎨', amount: 20, upgrade: 'stunning', label: ['Pretty', 'Bello'], reason: ['Beautiful notebook', 'Quaderno bellissimo'] },
    { key: 'stunning', icon: '✨', amount: 40, hidden: true, label: ['Stunning', 'Stupendo'], reason: ['Stunning notebook', 'Quaderno stupendo'] },
    { key: 'best', icon: '🤩', amount: 100, label: ['Best', 'Il top'], reason: ['The best Notebook!', 'Il miglior quaderno!'] }
  ],
  DEFAULT_HW: { icon: '📚', name: ['Optional homework', 'Compiti facoltativi'], price: 30 },

  // Costruisce i default nella lingua del docente. songLang = lingua straniera (solo prof di lingue)
  buildDefaults(lang, songLang) {
    const i = this.idx(lang);
    const rewards = this.DEFAULT_REWARDS.map(r => ({ icon: r.icon, name: r.name[i], description: r.desc[i], cost: r.cost }));
    if (songLang) rewards.splice(4, 0, { icon: '🎶', name: `Choose a song in ${songLang}`, description: `Choose a song in ${songLang} to listen to in class`, cost: 50 });
    const quick = this.DEFAULT_QUICK.map(q => ({ icon: q.icon, name: q.name[i], description: q.desc[i], amount: q.amount }));
    const nb = this.DEFAULT_NB.map(g => {
      const o = { key: g.key, icon: g.icon, amount: g.amount, label: g.label[i], reason: g.reason[i] };
      if (g.warning) { o.warning = true; o.warningIcon = g.warningIcon; o.warningType = g.warningType; }
      if (g.hidden) o.hidden = true;
      if (g.upgrade) o.upgrade = g.upgrade;
      return o;
    });
    const hw = { icon: this.DEFAULT_HW.icon, name: this.DEFAULT_HW.name[i], price: this.DEFAULT_HW.price };
    return { rewards, quick, nb, hw };
  },

  /* ---------- Saldi ---------- */
  // Dove sta il saldo di un conto dentro il documento dell'alunno
  balanceField(ledgerId) { return !ledgerId || ledgerId === 'main' ? 'balance' : `balances.${ledgerId}`; },
  balanceOf(student, ledgerId) {
    if (!student) return 0;
    if (!ledgerId || ledgerId === 'main') return student.balance || 0;
    return (student.balances && student.balances[ledgerId]) || 0;
  },
  // I documenti senza ledgerId sono del conto storico
  ledgerOf(doc) { return (doc && doc.ledgerId) || 'main'; },

  /* ---------- Formattazione ---------- */
  money(currency, n) {
    const sym = (currency && currency.symbol) || '$';
    return `${n < 0 ? '-' : ''}${sym}${Math.abs(n)}`;
  },

  /* ---------- Quali conti vede un alunno ---------- */
  // Conti che includono la classe dell'alunno. Se nessun conto è configurato
  // (sito mai passato al multi-docente) ritorna [] e la pagina resta quella di sempre.
  ledgersForClass(allLedgers, classId) {
    return allLedgers
      .filter(l => l.active !== false && (l.allClasses === true || (l.classes || []).includes(classId)))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.name || '').localeCompare(b.name || ''));
  },

  /* =============================================
     Parte "pagina docente" (richiede DB e Auth)
     ============================================= */
  ref(id) { return DB.school('ledgers').doc(id || this.id); },

  // Decide su quale conto lavora questa pagina e carica la sua configurazione.
  async init() {
    const profile = Auth.userProfile || {};
    const isAdmin = Auth.getEffectiveRole() === 'admin';
    const asParam = new URLSearchParams(location.search).get('as');

    // L'admin può aprire la pagina di un collega: ?as=<ledgerId>
    if (asParam && isAdmin) {
      this.id = asParam;
      this.asAdmin = asParam !== (profile.ledgerId || 'main');
    } else {
      this.id = profile.ledgerId || 'main';
      this.asAdmin = false;
    }

    let snap = await this.ref().get();
    if (!snap.exists && this.id === 'main' && isAdmin) {
      await this.createMainLedger();
      snap = await this.ref().get();
    }
    this.data = snap.exists ? { id: snap.id, ...snap.data() } : null;

    // Collego il conto all'utente che lo possiede (così le richieste degli alunni gli arrivano)
    if (this.data && !this.asAdmin && Auth.currentUser && this.data.ownerUid !== Auth.currentUser.uid) {
      try {
        await this.ref().update({ ownerUid: Auth.currentUser.uid });
        this.data.ownerUid = Auth.currentUser.uid;
      } catch (e) { console.warn('Ledger owner link skipped:', e.code || e.message); }
    }

    if (isAdmin) await this.loadAll();
    return this.data;
  },

  // Primo avvio: crea la configurazione del conto storico dall'impostazione attuale della scuola
  async createMainLedger() {
    const school = await DB.getSchoolData();
    const cfg = school?.config || {};
    const subject = 'English';
    const doc = {
      name: Auth.userProfile?.name || 'Teacher',
      subject,
      emoji: '🇬🇧',
      lang: this.langForSubject(subject),
      color: this.PALETTE[0],
      currency: { symbol: cfg.currencySymbol || '$', name: cfg.currencyName || 'Dollars' },
      allClasses: true,      // il conto storico vale per tutte le classi, finché l'admin non lo restringe
      classes: [],
      ownerUid: Auth.currentUser?.uid || null,
      ownerEmail: (Auth.currentUser?.email || '').toLowerCase(),
      songLang: 'English',
      order: 0,
      active: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await this.ref('main').set(doc);
  },

  async loadAll() {
    const snap = await DB.school('ledgers').get();
    this.all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.name || '').localeCompare(b.name || ''));
    return this.all;
  },

  // Valori di comodo per la pagina docente
  get lang() { return this.data?.lang || 'en'; },
  get color() { return this.data?.color || this.PALETTE[0]; },
  get currency() { return this.data?.currency || null; },
  get nb() { return this.data?.nb || this.buildDefaults(this.lang, this.data?.songLang).nb; },
  get hw() { return this.data?.hw || this.buildDefaults(this.lang, this.data?.songLang).hw; },

  async saveConfig(patch) {
    await this.ref().update(patch);
    this.data = { ...this.data, ...patch };
  },

  // Tinge l'interfaccia docente col colore del conto
  applyTheme() {
    const c = this.color;
    const r = document.documentElement.style;
    r.setProperty('--primary', c);
    r.setProperty('--primary-dark', `color-mix(in srgb, ${c} 78%, black)`);
    r.setProperty('--primary-light', `color-mix(in srgb, ${c} 55%, white)`);
    r.setProperty('--primary-rgb', this.hexToRgb(c));
  },

  // Crea (o aggiorna) un conto + il profilo utente "in attesa" collegato dall'email al primo accesso Google
  async saveLedger(id, data, opts = {}) {
    const isNew = !id;
    const ledgerId = id || ('t_' + Math.random().toString(36).slice(2, 8));
    const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    if (isNew) payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.ref(ledgerId).set(payload, { merge: true });

    // Utente collegato: stesso conto, email dell'insegnante
    const email = (data.ownerEmail || '').toLowerCase().trim();
    if (email) {
      const schoolId = Auth.getEffectiveSchoolId();
      const found = await db.collection('users').where('email', '==', email).limit(1).get();
      const userFields = { name: data.name, ledgerId, classes: opts.classIds || [], schoolId };
      if (found.empty) {
        await db.collection('users').add({
          email, role: 'teacher', status: 'pending', ...userFields,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        await found.docs[0].ref.update(userFields);
      }
    }

    // Un conto nuovo parte con premi e premi rapidi di default, nella lingua del docente
    if (isNew && opts.seedDefaults !== false) {
      const d = this.buildDefaults(data.lang, data.songLang);
      const batch = db.batch();
      d.rewards.forEach(r => batch.set(DB.school('rewards').doc(), { ...r, active: true, ledgerId, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
      d.quick.forEach(q => batch.set(DB.school('quickRewards').doc(), { ...q, ledgerId, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
      await batch.commit();
    }
    return ledgerId;
  }
};
