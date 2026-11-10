/* =============================================
   CoolBank - Traduzione dell'interfaccia docente
   ---------------------------------------------
   La pagina docente è scritta in inglese. Per i docenti con pagina in
   italiano (materie che non sono Inglese né seconde lingue) questo modulo
   traduce al volo i testi dell'interfaccia: sia quelli già nella pagina
   sia quelli creati dopo (toast, liste, finestre).

   - Traduce solo testi che corrispondono ESATTAMENTE a una voce del
     dizionario (o a uno dei modelli con numeri): nomi di alunni, premi
     e testi scritti dai docenti non vengono mai toccati.
   - Per l'inglese non fa nulla.
   - Una voce mancante resta semplicemente in inglese: per aggiungerne
     una basta una riga nel dizionario qui sotto.
   ============================================= */

const I18N = {
  lang: 'en',
  _observer: null,

  /* ---------- Dizionario: inglese → italiano ---------- */
  IT: {
    // navigazione e titoli
    'Overview': 'Panoramica', 'Management': 'Gestione', 'Rewards & Prices': 'Premi e prezzi', 'Activity': 'Attività', 'System': 'Sistema',
    'Home': 'Home', 'Students': 'Alunni', '👥 Students': '👥 Alunni', 'Classes': 'Classi', '🏫 Classes': '🏫 Classi', 'Teachers': 'Docenti', '👨‍🏫 Teachers': '👨‍🏫 Docenti',
    'Statistics': 'Statistiche', 'Give Rewards': 'Assegna premi', '⭐ Give Rewards': '⭐ Assegna premi', 'Prices Catalog': 'Catalogo premi', 'Rewards': 'Premi',
    'Quick Rewards': 'Premi rapidi', '⚡ Quick Rewards': '⚡ Premi rapidi', 'Check settings': 'Impostazioni check', 'Warnings': 'Richiami', 'Requests': 'Richieste',
    'History': 'Storico', 'Settings': 'Impostazioni', '⚙️ Settings': '⚙️ Impostazioni', 'School Bank': 'Banca della scuola',
    'Manage student list': 'Gestisci l\'elenco alunni', 'Approve reward requests': 'Approva le richieste di premi', 'Monitor HW & notebooks': 'Controlla compiti e quaderni',
    '📥 Export': '📥 Esporta',
    // alunni
    '🏆 Top Students': '🏆 Classifica', 'Ranking based on total money received': 'In base al totale ricevuto', '📅 All Time': '📅 Sempre', '📅 Current Year': '📅 Anno in corso',
    'All': 'Tutte', '+ Add': '+ Aggiungi', '📥 Bulk Import': '📥 Importa elenco', 'Search student name': 'Cerca il nome di un alunno',
    'Name': 'Nome', 'Class': 'Classe', 'Balance': 'Saldo', 'NFC': 'NFC', 'Actions': 'Azioni',
    'No students found': 'Nessun alunno trovato', 'No students': 'Nessun alunno', 'No more students': 'Nessun altro alunno',
    'No students in this class': 'Nessun alunno in questa classe', '⬇️ Mostra classifica completa': '⬇️ Mostra classifica completa',
    // assegna premi
    '📓 NB Check': '📓 Check quaderni', '📚 Optional HW': '📚 Compiti facoltativi', 'or': 'oppure', 'Custom Reward': 'Premio personalizzato', 'Reason': 'Motivo',
    'Find students': 'Cerca alunni', 'Type a name or NFC tag': 'Scrivi un nome o un tag NFC', 'All classes': 'Tutte le classi', 'Select Students': 'Seleziona alunni',
    '✅ Select All': '✅ Seleziona tutti', '⭐ Give Reward': '⭐ Assegna premio', 'No quick rewards': 'Nessun premio rapido', 'No rewards': 'Nessun premio',
    'Teachers use these buttons to give points quickly.': 'Usa questi pulsanti per assegnare punti velocemente.',
    '🔁 Recurring Rewards': '🔁 Premi che si ripetono',
    'Schedule a quick reward for a class on specific weekdays (e.g. "Clean class" every Tue & Thu). On those days, when you open the app, you\'ll be asked to confirm ✓ or skip ✗.':
      'Programma un premio rapido per una classe in certi giorni della settimana (es. "Classe pulita" ogni martedì e giovedì). In quei giorni, quando apri l\'app, ti verrà chiesto di confermare ✓ o saltare ✗.',
    'No recurring rewards scheduled': 'Nessun premio ripetuto programmato',
    '🎁 Redeemable Rewards': '🎁 Premi riscattabili', '📋 Load Defaults': '📋 Carica default', 'No description provided': 'Nessuna descrizione',
    '🗑️ Delete': '🗑️ Elimina', 'Delete': 'Elimina',
    // storico / richieste / richiami
    '📜 Transaction History': '📜 Storico transazioni', 'Search by student or reward name': 'Cerca per alunno o premio', 'No transactions': 'Nessuna transazione', 'No results': 'Nessun risultato',
    '🎁 Reward Requests': '🎁 Richieste di premi', 'No pending requests': 'Nessuna richiesta in attesa', 'Active requests': 'Richieste attive', 'Requests history': 'Storico richieste',
    'Approved': 'Approvata', 'Rejected': 'Rifiutata',
    '⚠️ Warnings Leaderboard': '⚠️ Classifica richiami', '↻ Refresh': '↻ Aggiorna', '🏅 Top 3': '🏅 Primi 3', '⬇️ Classifica completa': '⬇️ Classifica completa',
    '📒 Monitoring HW & Notebooks': '📒 Controllo compiti e quaderni', 'Quick warnings': 'Richiami rapidi', 'Custom warning': 'Richiamo personalizzato',
    'No warnings found': 'Nessun richiamo', 'No warning templates': 'Nessun modello di richiamo', 'No Homework': 'Compiti mancanti', 'No Notebook': 'Quaderno mancante',
    '⚠️ Give Warning': '⚠️ Dai un richiamo', 'Search student': 'Cerca alunno',
    // finestre: premi, premi rapidi, ripetuti
    'Reward': 'Premio', 'Description': 'Descrizione', 'Icon': 'Icona', 'Cost *': 'Costo *', 'Quick Reward': 'Premio rapido', 'Amount *': 'Importo *', 'Negative for penalty': 'Negativo per una penalità',
    '🔁 Recurring Reward': '🔁 Premio ripetuto', 'Quick Reward *': 'Premio rapido *', 'Select a quick reward': 'Scegli un premio rapido', 'Select a class': 'Scegli una classe',
    'Who gets it': 'Chi lo riceve', 'Whole class': 'Tutta la classe', 'Repeat on *': 'Ripeti il *', 'Active': 'Attivo', 'Class *': 'Classe *',
    'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mer', 'Thu': 'Gio', 'Fri': 'Ven', 'Sat': 'Sab', 'Sun': 'Dom',
    'Cancel': 'Annulla', 'Save': 'Salva', '💾 Save': '💾 Salva', '✅ Save': '✅ Salva', 'Close': 'Chiudi', 'Confirm': 'Conferma', 'OK': 'OK',
    // NB check e compiti
    '📒 Notebook Check': '📒 Check quaderni', '📒 All ok': '📒 Tutti ok', '🧽 Clear': '🧽 Azzera', '📚 Optional Homework': '📚 Compiti facoltativi', 'Homework': 'Compiti',
    '✅ All full': '✅ Tutti completi', 'Choose a class to start 👆': 'Scegli una classe per iniziare 👆', 'Full': 'Completo', 'Half': 'Metà', 'Other': 'Altro',
    'No NB': 'No quad.', 'No HW': 'No comp.', 'Ugly': 'Brutto', 'Ok': 'Ok', 'Pretty': 'Bello', 'Stunning': 'Stupendo', 'Best': 'Il top', 'warning': 'richiamo',
    '📒 Notebook check — grades': '📒 Check quaderni — voti', '↩︎ Restore defaults': '↩︎ Ripristina i default',
    'Same for everyone by default. Change names and amounts to fit your subject.': 'Uguale per tutti all\'inizio. Cambia nomi e importi per la tua materia.',
    '📚 Optional homework — defaults': '📚 Compiti facoltativi — default',
    // docenti (admin)
    '+ Add Teacher': '+ Aggiungi docente', 'No teachers': 'Nessun docente', 'Add the first teacher': 'Aggiungi il primo docente',
    '👨‍🏫 New Teacher': '👨‍🏫 Nuovo docente', '✏️ Edit teacher': '✏️ Modifica docente', 'Visible name *': 'Nome visibile *', 'Subject *': 'Materia *', 'Google email *': 'Email Google *',
    'Page language': 'Lingua della pagina', 'Color': 'Colore', 'Currency symbol': 'Simbolo valuta', 'Currency name': 'Nome valuta', 'Classes': 'Classi',
    // impostazioni scuola
    'School Name': 'Nome della scuola', 'Currency Symbol': 'Simbolo valuta', 'Currency Name': 'Nome valuta', 'Show Leaderboard': 'Mostra la classifica',
    '⚠️ Danger Zone': '⚠️ Zona pericolosa',
    // toast e messaggi frequenti
    'Saved!': 'Salvato!', 'Settings saved!': 'Impostazioni salvate!', 'Defaults restored': 'Default ripristinati', 'Request approved!': 'Richiesta approvata!', 'Request rejected': 'Richiesta rifiutata',
    'Transaction deleted!': 'Transazione eliminata!', 'Transaction updated!': 'Transazione modificata!', 'Reward added!': 'Premio aggiunto!', 'Added!': 'Aggiunto!', 'Deleted': 'Eliminato',
    'Error giving reward': 'Errore nell\'assegnare il premio', 'Error sending warning': 'Errore nell\'inviare il richiamo', 'Update error': 'Errore di aggiornamento', 'Delete error': 'Errore di eliminazione',
    'Approval error': 'Errore di approvazione', 'Rejection error': 'Errore di rifiuto', 'Error, try again': 'Errore, riprova', 'Recurring reward saved!': 'Premio ripetuto salvato!',
    'Recurring reward deleted': 'Premio ripetuto eliminato', 'Reward given!': 'Premio assegnato!', 'Skipped for today': 'Saltato per oggi',
    'Fill in all fields': 'Compila tutti i campi', 'Fill in all fields and select at least one student': 'Compila tutti i campi e scegli almeno un alunno',
    'Add a reason and select at least one student': 'Scrivi un motivo e scegli almeno un alunno', 'Enter a name': 'Inserisci un nome',
    'Reward loaded. Select students.': 'Premio caricato. Scegli gli alunni.', 'Select at least one student, or check "Whole class"': 'Scegli almeno un alunno, oppure "Tutta la classe"',
    'Select a quick reward, a class, and at least one day': 'Scegli un premio rapido, una classe e almeno un giorno',
    'Load error': 'Errore di caricamento', 'Invalid email': 'Email non valida', 'Fill in name, subject and Google email': 'Compila nome, materia ed email Google',
    'Teacher updated': 'Docente aggiornato', 'Error saving teacher': 'Errore nel salvare il docente', 'Error saving settings': 'Errore nel salvare le impostazioni',
    'Restore the default notebook-check and homework settings?': 'Ripristinare le impostazioni di default di check quaderni e compiti?',
    'Reject this request?': 'Rifiutare questa richiesta?', 'Confirm deletion': 'Conferma eliminazione',
    'See the student\'s page': 'Vedi la pagina dell\'alunno', 'Click to sign out': 'Clicca per uscire', 'Teacher': 'Docente', 'Admin': 'Admin'
  },

  /* ---------- Modelli con numeri o nomi ---------- */
  PATTERNS: [
    [/^⭐ Give Reward to (\d+) students?$/, (m) => `⭐ Assegna premio a ${m[1]} alunn${m[1] === '1' ? 'o' : 'i'}`],
    [/^⚠️ Give Warning to (\d+) students?$/, (m) => `⚠️ Dai un richiamo a ${m[1]} alunn${m[1] === '1' ? 'o' : 'i'}`],
    [/^Reward given to (\d+) students!$/, (m) => `Premio assegnato a ${m[1]} alunni!`],
    [/^Warning sent to (\d+) students!$/, (m) => `Richiamo inviato a ${m[1]} alunni!`],
    [/^Notebook check saved for (\d+) students! 📓$/, (m) => `Check quaderni salvato per ${m[1]} alunni! 📓`],
    [/^(\d+) checked(.*)$/, (m) => `${m[1]} controllati${m[2]}`],
    [/^Enter an amount for: (.*)$/, (m) => `Inserisci un importo per: ${m[1]}`],
    [/^Fixed (\d+) rewards$/, (m) => `Corretti ${m[1]} premi`],
    [/^Teacher (.+) added — they can sign in with Google \((.+)\)$/, (m) => `Docente ${m[1]} aggiunto — può accedere con Google (${m[2]})`]
  ],

  t(text) {
    if (this.lang !== 'it' || text == null) return text;
    const key = String(text).replace(/\s+/g, ' ').trim();
    if (!key) return text;
    if (Object.prototype.hasOwnProperty.call(this.IT, key)) return this.IT[key];
    for (const [re, fn] of this.PATTERNS) {
      const m = key.match(re);
      if (m) return fn(m);
    }
    return text;
  },

  _skip(node) {
    const p = node.parentElement;
    if (!p) return true;
    const tag = p.tagName;
    return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || p.closest('[data-no-i18n]') !== null;
  },

  _translateText(node) {
    if (this._skip(node)) return;
    const raw = node.nodeValue;
    const out = this.t(raw);
    if (out !== raw) {
      // conserva gli spazi iniziali e finali
      const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      node.nodeValue = lead + out + trail;
    }
  },

  _translateAttrs(el) {
    for (const a of ['placeholder', 'title', 'aria-label']) {
      const v = el.getAttribute && el.getAttribute(a);
      if (v) {
        const out = this.t(v);
        if (out !== v) el.setAttribute(a, out);
      }
    }
  },

  translateTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { this._translateText(root); return; }
    if (root.nodeType !== 1) return;
    if (root.closest && root.closest('[data-no-i18n]')) return;
    this._translateAttrs(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = walker.nextNode();
    while (n) {
      if (n.nodeType === 3) this._translateText(n); else this._translateAttrs(n);
      n = walker.nextNode();
    }
  },

  // Attiva (o disattiva) la traduzione. Per l'inglese non osserva nulla.
  setLang(lang) {
    this.lang = lang === 'it' ? 'it' : 'en';
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
    if (this.lang !== 'it') return;
    this.translateTree(document.body);
    this._observer = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'characterData') this._translateText(m.target);
        else if (m.type === 'childList') m.addedNodes.forEach(n => this.translateTree(n));
        else if (m.type === 'attributes') this._translateAttrs(m.target);
      }
    });
    this._observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label']
    });
  }
};
