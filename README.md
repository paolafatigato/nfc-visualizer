# nfc-visualizer

## Firestore rules note

Aggiungi la regola per rewardRequests:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function userDoc() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function hasUserProfile() {
      return signedIn() && userDoc().data != null;
    }

    function role() {
      return hasUserProfile() ? userDoc().data.role : null;
    }

    function isSuperAdmin() {
      return role() == 'superadmin';
    }

    function isAdmin() {
      return role() == 'admin' || isSuperAdmin();
    }

    function isTeacher() {
      return role() == 'teacher' || isAdmin();
    }

    function sameSchoolId(schoolId) {
      return isSuperAdmin() || (hasUserProfile() && userDoc().data.schoolId == schoolId);
    }

    match /users/{userId} {
      allow read: if signedIn()
        && (userId == request.auth.uid
          || isSuperAdmin()
          || (isAdmin() && userDoc().data.schoolId == resource.data.schoolId))
        || (resource.data.role in ['teacher', 'admin']);

      allow create: if signedIn()
        && (userId == request.auth.uid || isAdmin() || isSuperAdmin());

      allow update, delete: if signedIn()
        && (isSuperAdmin()
          || (isAdmin() && userDoc().data.schoolId == resource.data.schoolId)
          || userId == request.auth.uid);
    }

    match /schools/{schoolId} {
      allow read: if true;
      allow write: if sameSchoolId(schoolId) && isAdmin();

      match /students/{studentId} {
        allow read: if true;
        allow create, update: if sameSchoolId(schoolId) && isTeacher();
        allow delete: if sameSchoolId(schoolId) && isAdmin();
      }
      
      match /warnings/{warningId} {
allow read: if sameSchoolId(schoolId) && isTeacher();
allow create: if sameSchoolId(schoolId) && isTeacher();
allow update, delete: if sameSchoolId(schoolId) && isAdmin();
}

      match /classes/{classId} {
        allow read: if sameSchoolId(schoolId) && isTeacher();
        allow write: if sameSchoolId(schoolId) && isAdmin();
      }

      match /teachers/{teacherId} {
        allow read: if sameSchoolId(schoolId) && isTeacher();
        allow write: if sameSchoolId(schoolId) && isAdmin();
      }

      match /rewards/{rewardId} {
        allow read: if true;
        allow write: if sameSchoolId(schoolId) && isAdmin();
      }

      match /quickRewards/{rewardId} {
        allow read: if true;
        allow write: if sameSchoolId(schoolId) && isAdmin();
      }

      match /subjects/{subjectId} {
        allow read: if true;
        allow write: if sameSchoolId(schoolId) && isAdmin();
      }

      match /transactions/{transactionId} {
        allow read: if true;
        allow create: if sameSchoolId(schoolId) && isTeacher();
        allow update, delete: if sameSchoolId(schoolId) && isAdmin();
      }

      match /rewardRequests/{requestId} {
        // Chiunque autenticato (anche anonimamente) puo creare una request
        allow create: if request.auth != null;
        // Solo utenti registrati (teacher/admin) possono leggere e aggiornare
        allow read, update: if request.auth != null &&
          exists(/databases/$(database)/documents/users/$(request.auth.uid));
      }
    }
  }
}

```

Perche funziona: `signInAnonymously()` crea una sessione Firebase silenziosa, senza che il bambino se ne accorga. Basta avere internet sul dispositivo, e la regola `request.auth != null` diventa vera, sbloccando la scrittura.

## Più docenti: un conto (ledger) per ciascuno

Ogni docente del consiglio di classe ha il suo **conto**: saldo per alunno, premi, premi rapidi, premi ripetuti, richieste, richiami, transazioni, valuta, colore e lingua sono separati.

**Come funziona**
- Il tuo conto storico si chiama `main` e **non richiede migrazioni**: i documenti senza `ledgerId` appartengono a `main`, e il suo saldo resta in `students/{id}.balance`.
- Gli altri conti tengono il saldo in `students/{id}.balances.{ledgerId}`.
- La configurazione di ogni conto (nome visibile, materia, colore, valuta, lingua, classi, impostazioni NB check e compiti) sta in `schools/{schoolId}/ledgers/{ledgerId}`. Al primo accesso come admin il conto `main` viene creato da solo, valido per tutte le classi.
- Gli alunni vedono una scheda per ogni conto che include la loro classe. Con un solo conto la pagina è identica a prima.

**Messa in funzione**
1. Pubblica le nuove regole: `firebase deploy --only firestore:rules` (aggiungono la collezione `ledgers`).
2. Accedi come admin: nella sezione **Teachers** aggiungi un docente (nome visibile, materia, classi, email Google, colore, valuta). Riceve subito premi e premi rapidi di default nella sua lingua.
3. Il collega entra con Google dalla pagina di login: il suo profilo viene collegato in automatico dall'email.
4. **Open page** (👁️) apre la pagina di un collega in modalità admin (`teacher.html?as=<ledgerId>`).

**Chi può cosa**
- Admin: Classes, Teachers, Settings (e i colori delle classi), oltre a tutto ciò che fanno i docenti.
- Docente: solo il proprio conto, sulle classi assegnate. Alunni, assegnazione premi, catalogo e premi rapidi, premi ripetuti, richieste, richiami, storico e **Check settings** (voti del NB check e compiti facoltativi) sono i suoi.

**Lingua**: inglese per Inglese, Spagnolo, Francese e Tedesco; italiano per le altre materie (modificabile per docente). L'interfaccia docente è tradotta da `js/i18n.js`: una voce mancante resta in inglese, per aggiungerla basta una riga nel dizionario.

**Note**
- Gli strumenti di manutenzione in Settings (riconciliazione nomi, alunni scomparsi, duplicati) lavorano sui dati grezzi; l'unione di alunni duplicati somma solo il saldo del conto `main`.
- Il reset di inizio anno azzera i saldi di tutti i conti.
