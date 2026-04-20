# 📁 Vokabeltrainer – Dateistruktur

## Übersicht

Die Vokabeltrainer-App besteht aus 9 Dateien (4 Applikationsdateien + 5 Dokumentationsdateien).

```
vocabulary_trainer_static/
├── index.html                    (Hauptdatei - HTML-Struktur)
├── styles.css                    (Styling und Layout)
├── app.js                        (Hauptlogik und Funktionalität)
├── ocr.js                        (OCR-Integration)
├── README.md                     (Übersicht und Features)
├── INSTALLATION_SYNOLOGY.md      (Detaillierte Installationsanleitung)
├── QUICKSTART.md                 (Schnellstart-Anleitung)
├── BEISPIEL_DATEN.md             (Test-Vokabeln und JSON-Import)
├── FEATURES.txt                  (Feature-Liste)
└── DATEISTRUKTUR.md              (Diese Datei)
```

---

## 📄 Applikationsdateien

### 1. `index.html` (11 KB, 370 Zeilen)

**Zweck:** HTML-Struktur und Layout der gesamten App

**Inhalt:**
- DOCTYPE und Meta-Tags (Viewport, Charset)
- Navigation mit 5 Hauptseiten
- 5 Seiten-Container:
  - Home (Startseite mit Aktions-Cards)
  - Vocabulary (Vokabelverwaltung)
  - Lists (Vokabellisten-Verwaltung)
  - Learn (Lernmodi: Karteikarten, Quiz, Schreiben)
  - Dashboard (Fortschrittsverfolgung)
- Formular-Container für:
  - Vokabel hinzufügen/bearbeiten
  - OCR-Import
  - Listen erstellen
- Modal-Overlay und Modal-Container
- Script-Tags für externe Libraries und lokale Scripts

**Wichtige Elemente:**
- Navigation Bar mit 5 Buttons
- Seiten-Navigation mit `data-page` Attributen
- Formular-Elemente mit IDs für JavaScript-Zugriff
- Lernmodus-Container mit versteckten Elementen

---

### 2. `styles.css` (24 KB, 1284 Zeilen)

**Zweck:** Styling, Layout und Responsive Design

**Struktur:**
- **CSS-Variablen:** Farben, Abstände, Schatten, Border-Radius
- **Global Styles:** Reset, Fonts, Basis-Styling
- **Layout:** Flexbox für Navigation und Container
- **Navigation Bar:** Sticky Navbar mit Gradient
- **Seiten:** Fade-In Animation
- **Buttons:** Verschiedene Varianten (Primary, Secondary, Success, Danger)
- **Formulare:** Input-Styling mit Focus-States
- **Vokabel-Cards:** Grid-Layout mit Hover-Effekten
- **Flashcards:** 3D-Flip-Animation mit `transform: rotateY()`
- **Quiz:** Option-Styling mit Selected/Correct/Incorrect States
- **Dashboard:** Stat-Cards und Diagramm-Container
- **Responsive Design:** Media Queries für Mobile (768px, 480px)
- **Animationen:** Fade-In, Slide-In, Spin, Pulse

**Farbpalette:**
- Primary: `#6366f1` (Indigo)
- Secondary: `#ec4899` (Pink)
- Success: `#10b981` (Grün)
- Danger: `#ef4444` (Rot)
- Background: Weiß/Grau-Töne

---

### 3. `app.js` (35 KB, 1013 Zeilen)

**Zweck:** Hauptlogik und Funktionalität der App

**Struktur:**

#### VocabularyTrainer Klasse

**Eigenschaften:**
- `vocabularies` – Array von Vokabel-Objekten
- `lists` – Array von Listen-Objekten
- `progress` – Objekt mit Lernfortschritt
- `activities` – Array von Aktivitäten
- `currentPage` – Aktuelle Seite
- `currentLearningMode` – Aktueller Lernmodus
- `currentLearningVocabs` – Vokabeln der aktuellen Sitzung

**Methoden:**

1. **Initialisierung:**
   - `init()` – Initialisiert die App
   - `loadFromStorage()` – Lädt Daten aus LocalStorage
   - `saveToStorage()` – Speichert Daten in LocalStorage

2. **Event Listeners:**
   - `setupEventListeners()` – Registriert alle Event-Handler

3. **Navigation:**
   - `navigateTo(page)` – Wechselt zur Seite
   - `handleHomeAction(action)` – Verarbeitet Home-Aktionen

4. **Vokabelverwaltung:**
   - `addVocabulary()` – Fügt Vokabel hinzu
   - `deleteVocabulary(id)` – Löscht Vokabel
   - `editVocabulary(id)` – Bearbeitet Vokabel
   - `showVocabForm()` / `hideVocabForm()` – Formular-Anzeige
   - `filterVocabularies(searchTerm)` – Sucht Vokabeln
   - `renderVocabularyPage()` – Rendert Vokabeln-Seite

5. **Listen-Verwaltung:**
   - `addList()` – Erstellt Liste
   - `deleteList(id)` – Löscht Liste
   - `showListForm()` / `hideListForm()` – Formular-Anzeige
   - `renderListsPage()` – Rendert Listen-Seite
   - `updateListSelect()` – Aktualisiert List-Select Dropdown

6. **Lernmodi:**
   - `startLearning()` – Startet Lernmodus
   - `startFlashcards(vocabs)` – Startet Karteikarten
   - `showFlashcard(index)` – Zeigt Karteikarte
   - `flipCard()` – Dreht Karteikarte um
   - `nextFlashcard()` – Nächste Karteikarte
   - `startQuiz(vocabs)` – Startet Quiz
   - `showQuizQuestion(index)` – Zeigt Quiz-Frage
   - `checkQuizAnswer()` – Überprüft Quiz-Antwort
   - `startTyping(vocabs)` – Startet Schreib-Modus
   - `showTypingQuestion(index)` – Zeigt Schreib-Frage
   - `checkTypingAnswer()` – Überprüft Schreib-Antwort

7. **Fortschritt:**
   - `recordProgress(isCorrect)` – Speichert Lernfortschritt
   - `endLearning()` – Beendet Lernmodus
   - `renderDashboard()` – Rendert Dashboard
   - `calculateStreak()` – Berechnet Lernstreak

8. **Utilities:**
   - `updateStats()` – Aktualisiert Statistiken
   - `renderHome()` – Rendert Home-Seite
   - `addActivity(text)` – Fügt Aktivität hinzu
   - `escapeHtml(text)` – Escaped HTML
   - `exportData()` – Exportiert Daten als JSON
   - `importData()` – Importiert Daten aus JSON
   - `resetAllData()` – Setzt alles zurück

---

### 4. `ocr.js` (8 KB, 220 Zeilen)

**Zweck:** OCR-Integration mit Tesseract.js

**Struktur:**

**Methoden (erweitert VocabularyTrainer):**

1. **Formular-Verwaltung:**
   - `showOCRForm()` – Zeigt OCR-Formular
   - `hideOCRForm()` – Versteckt OCR-Formular

2. **Bildverarbeitung:**
   - `processOCRImage()` – Verarbeitet Bild mit Tesseract.js
   - `parseVocabularyFromText(text)` – Parst Vokabelpaare aus Text
   - `displayOCRResults(vocabs)` – Zeigt erkannte Vokabeln

3. **Import:**
   - `addOCRVocabulary(index)` – Importiert einzelne Vokabel
   - `importAllOCRVocabularies(vocabs)` – Importiert alle Vokabeln

**Besonderheiten:**
- Unterstützt mehrere Trennzeichen: `-`, `–`, `—`, `\t`
- Entfernt OCR-Artefakte und Nummern
- Erkennt Duplikate
- Validiert Vokabellänge (min. 2 Zeichen)

---

## 📚 Dokumentationsdateien

### 5. `README.md` (6.1 KB, 260 Zeilen)

**Inhalt:**
- Features-Übersicht
- Schnellstart-Anleitung
- Verwendungsanleitung
- Technische Details
- Datenverwaltung
- Tipps zum effektiven Lernen
- Sicherheit & Datenschutz
- Fehlerbehebung
- Externe Ressourcen

---

### 6. `INSTALLATION_SYNOLOGY.md` (11 KB, 344 Zeilen)

**Inhalt:**
- Systemanforderungen
- Schritt-für-Schritt Installation (5 Schritte)
- Verwendungsanleitung für alle Features
- Technische Details (Datenspeicherung, Libraries)
- Browser-Kompatibilität
- Fehlerbehebung
- Tipps und Tricks
- Sicherheit und Datenschutz

---

### 7. `QUICKSTART.md` (4 KB, 150 Zeilen)

**Inhalt:**
- Installation (5 Minuten)
- Erste Schritte (10 Minuten)
- Lernmodi erklärt
- OCR-Funktion
- Daten sichern
- Häufige Fragen
- Lern-Tipps
- Fehlerbehebung
- Weitere Ressourcen

---

### 8. `BEISPIEL_DATEN.md` (5 KB, 180 Zeilen)

**Inhalt:**
- 20 Beispiel-Vokabeln (2 Units)
- Tabelle mit Deutsch-Englisch-Beispielsätzen
- JSON-Backup zum direkten Importieren
- Tipps zum Testen

---

### 9. `FEATURES.txt` (5 KB, 150 Zeilen)

**Inhalt:**
- Komplette Feature-Liste (10 Kategorien)
- Technische Details
- Performance-Informationen
- Sicherheit & Datenschutz
- Installationsmethoden
- Bekannte Limitationen
- Zukünftige Erweiterungen
- Support & Kontakt
- Version und Status

---

## 🔄 Datenfluss

```
┌─────────────────────────────────────────────────────────────┐
│                    VOKABELTRAINER APP                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  index.html (Struktur)                                       │
│       ↓                                                       │
│  styles.css (Styling)                                        │
│       ↓                                                       │
│  app.js (Logik)                                              │
│       ↓                                                       │
│  ocr.js (OCR-Integration)                                    │
│       ↓                                                       │
│  Browser LocalStorage (Datenspeicherung)                     │
│                                                               │
│  External Libraries (CDN):                                   │
│  - Tesseract.js (OCR)                                        │
│  - Chart.js (Diagramme)                                      │
│  - Google Fonts                                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Datenspeicherung

**LocalStorage-Struktur:**

```javascript
{
  "vocabularyTrainerData": {
    "vocabularies": [
      {
        "id": 1000001,
        "german": "Haus",
        "english": "house",
        "example": "The house is big.",
        "listId": 1000,
        "createdAt": "2026-02-28T10:00:00.000Z"
      },
      // ... weitere Vokabeln
    ],
    "lists": [
      {
        "id": 1000,
        "name": "Unit 1",
        "description": "Grundwortschatz",
        "createdAt": "2026-02-28T10:00:00.000Z"
      },
      // ... weitere Listen
    ],
    "progress": {
      "1000001": {
        "attempts": 5,
        "correct": 4,
        "incorrect": 1,
        "learned": true,
        "lastReview": "2026-02-28T11:00:00.000Z"
      },
      // ... weiterer Fortschritt
    },
    "activities": [
      {
        "text": "Vokabel hinzugefügt: Haus",
        "timestamp": "2026-02-28T10:00:00.000Z"
      },
      // ... weitere Aktivitäten
    ]
  }
}
```

---

## 🚀 Installation

### Schritt 1: Dateien vorbereiten
- Lade alle 4 Applikationsdateien herunter

### Schritt 2: Auf Synology hochladen
- File Station → `/web` → Ordner `vokabeltrainer` erstellen
- Alle 4 Dateien hochladen

### Schritt 3: App öffnen
- `http://192.168.1.100/vokabeltrainer/`

---

## 📊 Größen

| Datei | Größe | Zeilen |
|-------|-------|--------|
| index.html | 11 KB | 370 |
| styles.css | 24 KB | 1284 |
| app.js | 35 KB | 1013 |
| ocr.js | 8 KB | 220 |
| **Gesamt** | **78 KB** | **2887** |
| **Komprimiert (ZIP)** | **26 KB** | – |

---

## ✅ Checkliste für Installation

- [ ] Alle 4 Applikationsdateien heruntergeladen
- [ ] Ordner `/web/vokabeltrainer/` auf Synology erstellt
- [ ] Alle 4 Dateien hochgeladen
- [ ] App unter `http://192.168.1.100/vokabeltrainer/` geöffnet
- [ ] Erste Vokabel hinzugefügt
- [ ] Lernmodus getestet
- [ ] Daten exportiert (Backup)

---

**Version 1.0** | Februar 2026
