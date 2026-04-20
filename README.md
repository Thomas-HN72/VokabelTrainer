# 📚 Vokabeltrainer – Für Justin

Eine moderne, mobile-optimierte Web-App zum Trainieren von Englisch-Vokabeln mit OCR-Funktion (Foto-zu-Text), verschiedenen Lernmodi und Fortschrittsverfolgung.

## ✨ Features

### 🎓 Lernmodi

- **Karteikarten 🎴**: Klassisches Karteikarten-Lernen mit Umdreh-Animation
- **Quiz ❓**: Multiple-Choice-Quiz mit automatischer Auswertung
- **Schreiben ⌨️**: Tippe die englische Übersetzung ein und überprüfe dich selbst

### 📸 OCR-Funktion

- Fotografiere Vokabellisten aus deinem Schulbuch
- Tesseract.js erkennt automatisch den Text
- Vokabelpaare werden erkannt und können importiert werden
- Unterstützt Deutsch und Englisch

### 📝 Vokabelverwaltung

- Vokabeln manuell hinzufügen, bearbeiten und löschen
- Beispielsätze für jede Vokabel
- Vokabeln in thematische Listen organisieren (Unit 1, Unit 2, etc.)
- Schnelle Suchfunktion

### 📊 Fortschrittsverfolgung

- Dashboard mit Statistiken (Gesamte Vokabeln, Gelernte, Erfolgsquote)
- Aktivitätsprotokoll mit Zeitstempel
- Lernstreak-Zähler
- Diagramm mit Lernfortschritt

### 💾 Datenverwaltung

- Alle Daten werden lokal im Browser gespeichert (LocalStorage)
- Daten exportieren (JSON-Backup)
- Daten importieren (Wiederherstellen aus Backup)
- Alles zurücksetzen (mit Bestätigung)

### 📱 Design & Benutzerfreundlichkeit

- Modernes, jugendfreundliches Design
- Vollständig responsive (Smartphone, Tablet, Desktop)
- Touch-optimierte Bedienung
- Gradient-Hintergründe und Animationen
- Dunkle und helle Farbpalette

---

## 🚀 Schnellstart

### Installation auf Synology Web Station

1. **Dateien vorbereiten**
   - Lade alle Dateien herunter: `index.html`, `styles.css`, `app.js`, `ocr.js`

2. **Auf Synology hochladen**
   - Öffne File Station
   - Navigiere zu `/web`
   - Erstelle einen Ordner `vokabeltrainer`
   - Lade alle vier Dateien hoch

3. **App öffnen**
   - Öffne: `http://192.168.1.100/vokabeltrainer/`
   - Ersetze `192.168.1.100` durch deine Synology-IP

**Detaillierte Anleitung:** Siehe [INSTALLATION_SYNOLOGY.md](INSTALLATION_SYNOLOGY.md)

### Lokal testen

1. Speichere alle Dateien in einem Ordner
2. Öffne `index.html` im Browser
3. Die App funktioniert sofort!

---

## 📖 Verwendung

### Vokabeln hinzufügen

```
Klick: Vokabeln → ➕ Neue Vokabel
Eingabe:
  - Deutsch: "Haus"
  - Englisch: "house"
  - Beispiel: "The house is big." (optional)
  - Liste: "Unit 1" (optional)
Klick: Speichern
```

### Vokabeln aus Foto importieren

```
Klick: Vokabeln → 📸 Aus Foto importieren
Hochladen: Foto von Vokabelliste
Klick: Foto analysieren
Überprüfen: Erkannte Vokabelpaare
Klick: Alle importieren oder einzeln hinzufügen
```

### Lernen starten

```
Klick: Lernen
Wähle: Lernmodus (Karteikarten, Quiz, Schreiben)
Wähle: Liste (optional)
Klick: Lernen starten
```

### Fortschritt verfolgen

```
Klick: Fortschritt
Sieh: Statistiken und Diagramme
Klick: Daten exportieren/importieren
```

---

## 🛠️ Technische Details

### Technologie-Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Datenspeicherung**: Browser LocalStorage
- **OCR**: Tesseract.js (clientseitig)
- **Diagramme**: Chart.js
- **Schriftarten**: Google Fonts (Inter, Poppins)

### Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | HTML-Struktur und Layout |
| `styles.css` | Styling und Responsive Design |
| `app.js` | Hauptlogik und Funktionalität |
| `ocr.js` | OCR-Integration mit Tesseract.js |

### Browser-Kompatibilität

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile Browser (iOS, Android)

### Anforderungen

- Moderner Browser mit JavaScript-Unterstützung
- Internetverbindung (für externe Libraries)
- ~2 MB Speicherplatz im Browser (LocalStorage)

---

## 📊 Datenverwaltung

### Speicherung

Alle Daten werden im **Browser LocalStorage** gespeichert:
- Vokabeln
- Vokabellisten
- Lernfortschritt
- Aktivitätsprotokoll

**Wichtig:** Die Daten sind spezifisch für:
- Diesen Browser
- Diesen Computer
- Diesen Benutzer

### Backup erstellen

```
Klick: Fortschritt → 📥 Daten exportieren
→ JSON-Datei wird heruntergeladen
→ Speichere die Datei sicher
```

### Backup wiederherstellen

```
Klick: Fortschritt → 📤 Daten importieren
→ Wähle die JSON-Datei aus
→ Daten werden wiederhergestellt
```

---

## 🎯 Tipps zum effektiven Lernen

1. **Regelmäßig lernen**: Tägliche kurze Sitzungen sind effektiver
2. **Verschiedene Modi**: Wechsle zwischen Karteikarten, Quiz und Schreiben
3. **Listen nutzen**: Organisiere Vokabeln nach Kapiteln
4. **Fortschritt verfolgen**: Überprüfe regelmäßig dein Dashboard
5. **Daten sichern**: Exportiere deine Daten wöchentlich
6. **Gute Fotos**: Verwende gute Beleuchtung beim OCR-Import

---

## 🔒 Sicherheit & Datenschutz

- ✅ **Keine Datenübertragung**: Alle Daten bleiben auf deinem Gerät
- ✅ **Keine Anmeldung**: Keine Benutzerauthentifizierung erforderlich
- ✅ **Keine Verfolgung**: Kein Tracking oder Analytik
- ✅ **Offline-Funktion**: Teilweise offline nutzbar (nach erstem Laden)

---

## 🐛 Fehlerbehebung

### App lädt nicht

- Überprüfe die URL
- Stelle sicher, dass alle vier Dateien im Ordner sind
- Aktualisiere die Seite (Strg+F5)

### OCR funktioniert nicht

- Überprüfe deine Internetverbindung
- Versuche ein anderes Bild mit besserer Qualität
- Überprüfe die Browser-Konsole (F12)

### Daten sind weg

- Browser-Cache wurde geleert?
- Verwendest du den gleichen Browser?
- Importiere ein Backup

---

## 📝 Lizenz

Diese App ist für den persönlichen Gebrauch frei verfügbar.

---

## 🎓 Viel Erfolg beim Lernen!

**Für Justin – Viel Spaß beim Trainieren deiner Englisch-Vokabeln! 🚀📚**

---

### Versionshistorie

| Version | Datum | Änderungen |
|---------|-------|-----------|
| 1.0 | Feb 2026 | Initiale Version mit allen Features |

---

### Externe Ressourcen

- [Tesseract.js Dokumentation](https://tesseract.projectnaptha.com/)
- [Chart.js Dokumentation](https://www.chartjs.org/)
- [Synology Web Station](https://www.synology.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Kontakt & Support**: Siehe [INSTALLATION_SYNOLOGY.md](INSTALLATION_SYNOLOGY.md)
