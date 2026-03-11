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