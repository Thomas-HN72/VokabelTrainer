# Vokabeltrainer für Synology Web Station – Installationsanleitung

## Überblick

Der Vokabeltrainer ist eine vollständig statische Web-Anwendung (HTML, CSS, JavaScript), die keine Server-Komponente, keine Datenbank und keinen Docker benötigt. Die App läuft vollständig im Browser und speichert alle Daten lokal auf dem Gerät des Benutzers (LocalStorage).

**Systemanforderungen:**
- Synology DiskStation mit Web Station (oder jeder Webserver)
- Moderner Browser (Chrome, Firefox, Safari, Edge)
- Internetverbindung für externe Libraries (Tesseract.js, Chart.js)

---

## Installation auf Synology Web Station

### Schritt 1: Dateien vorbereiten

1. Lade alle Dateien der Vokabeltrainer-App herunter:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `ocr.js`

2. Erstelle einen neuen Ordner auf deinem Computer, z.B. `vokabeltrainer`

3. Kopiere alle vier Dateien in diesen Ordner

### Schritt 2: Verbindung zur Synology DiskStation herstellen

#### Option A: Über File Station (empfohlen für Anfänger)

1. Öffne die **Synology DiskStation** im Browser (z.B. `http://192.168.1.100:5000`)
2. Melde dich mit deinen Administratoranmeldedaten an
3. Öffne die **File Station**
4. Navigiere zum Ordner: `/web` oder `/volume1/web` (je nach Synology-Modell)
5. Falls der Ordner nicht existiert, erstelle ihn
6. Erstelle einen neuen Unterordner namens `vokabeltrainer`

#### Option B: Über SSH (für fortgeschrittene Benutzer)

```bash
ssh admin@192.168.1.100
cd /volume1/web
mkdir -p vokabeltrainer
```

### Schritt 3: Dateien hochladen

#### Option A: Über File Station

1. Öffne den Ordner `/web/vokabeltrainer` in File Station
2. Klicke auf **Hochladen** (Upload-Button)
3. Wähle die vier Dateien aus (`index.html`, `styles.css`, `app.js`, `ocr.js`)
4. Bestätige den Upload

#### Option B: Über SCP (SSH)

```bash
scp index.html admin@192.168.1.100:/volume1/web/vokabeltrainer/
scp styles.css admin@192.168.1.100:/volume1/web/vokabeltrainer/
scp app.js admin@192.168.1.100:/volume1/web/vokabeltrainer/
scp ocr.js admin@192.168.1.100:/volume1/web/vokabeltrainer/
```

### Schritt 4: Berechtigungen setzen (optional, aber empfohlen)

Über SSH:

```bash
ssh admin@192.168.1.100
chmod 755 /volume1/web/vokabeltrainer
chmod 644 /volume1/web/vokabeltrainer/*
```

### Schritt 5: App aufrufen

Öffne deinen Browser und navigiere zu:

```
http://192.168.1.100/vokabeltrainer/
```

oder

```
http://192.168.1.100:80/vokabeltrainer/
```

Ersetze `192.168.1.100` durch die IP-Adresse oder den Hostnamen deiner Synology DiskStation.

---

## Verwendung der App

### Startseite

Nach dem Öffnen siehst du die Startseite mit schnellen Aktionen:
- **Karteikarten**: Vokabeln mit Umdreh-Animation lernen
- **Quiz**: Multiple-Choice-Quiz spielen
- **Vokabel hinzufügen**: Neue Vokabeln manuell eingeben
- **Foto hochladen**: Vokabeln aus Schulbuchfotos erkennen (OCR)

### Vokabeln verwalten

1. Klicke auf **Vokabeln** in der Navigation
2. Klicke auf **➕ Neue Vokabel**
3. Gib ein:
   - **Deutsch**: z.B. "Haus"
   - **Englisch**: z.B. "house"
   - **Beispielsatz (optional)**: z.B. "The house is big."
   - **Liste (optional)**: Wähle eine thematische Liste
4. Klicke **Speichern**

### Vokabeln aus Fotos importieren (OCR)

1. Klicke auf **Vokabeln** → **📸 Aus Foto importieren**
2. Fotografiere eine Vokabelliste aus deinem Schulbuch
3. Lade das Foto hoch
4. Klicke **Foto analysieren**
5. Die App erkennt automatisch Vokabelpaare
6. Überprüfe die erkannten Vokabeln und importiere sie

**Tipps für beste OCR-Ergebnisse:**
- Gute Beleuchtung verwenden
- Vokabelliste sollte klar und lesbar sein
- Format: "Deutsch - Englisch" oder "Deutsch | Englisch"
- Keine schrägen Fotos oder Schatten

### Lernmodi

#### Karteikarten-Modus 🎴

1. Klicke auf **Lernen**
2. Wähle **Karteikarten** als Modus
3. Wähle optional eine Liste aus
4. Klicke **Lernen starten**
5. Lese die deutsche Vokabel
6. Klicke **Umdrehen** um die englische Übersetzung zu sehen
7. Bewerte dich selbst:
   - **✅ Gewusst**: Du hast die Vokabel richtig gewusst
   - **❌ Nicht gewusst**: Du hast die Vokabel nicht gewusst

#### Quiz-Modus ❓

1. Klicke auf **Lernen**
2. Wähle **Quiz** als Modus
3. Wähle optional eine Liste aus
4. Klicke **Lernen starten**
5. Lese die deutsche Vokabel
6. Wähle die richtige englische Übersetzung aus vier Optionen
7. Die App zeigt sofort, ob deine Antwort richtig ist
8. Klicke **Nächste Frage** um fortzufahren

#### Schreib-Modus ⌨️

1. Klicke auf **Lernen**
2. Wähle **Schreiben** als Modus
3. Wähle optional eine Liste aus
4. Klicke **Lernen starten**
5. Lese die deutsche Vokabel
6. Tippe die englische Übersetzung in das Textfeld
7. Klicke **Überprüfen**
8. Die App vergleicht deine Antwort mit der korrekten Übersetzung

### Vokabellisten organisieren

1. Klicke auf **Listen** in der Navigation
2. Klicke auf **➕ Neue Liste**
3. Gib ein:
   - **Listenname**: z.B. "Unit 1" oder "Kapitel 5"
   - **Beschreibung (optional)**: z.B. "Grundwortschatz"
4. Klicke **Speichern**
5. Beim Hinzufügen von Vokabeln kannst du sie dieser Liste zuordnen

### Fortschritt verfolgen

1. Klicke auf **Fortschritt** in der Navigation
2. Sieh deine Statistiken:
   - **Gesamte Vokabeln**: Anzahl aller Vokabeln
   - **Gelernte Vokabeln**: Vokabeln mit hoher Erfolgsquote
   - **Erfolgsquote**: Prozentsatz richtig beantworteter Fragen
   - **Aktuelle Serie**: Tage in Folge mit Lernaktivität
3. Sieh ein Diagramm mit deinem Lernfortschritt
4. Überprüfe deine letzte Aktivität

### Daten sichern und importieren

**Daten exportieren:**
1. Klicke auf **Fortschritt**
2. Klicke auf **📥 Daten exportieren**
3. Eine JSON-Datei wird heruntergeladen (Backup)

**Daten importieren:**
1. Klicke auf **Fortschritt**
2. Klicke auf **📤 Daten importieren**
3. Wähle eine zuvor exportierte JSON-Datei
4. Die Daten werden wiederhergestellt

**Alles zurücksetzen:**
1. Klicke auf **Fortschritt**
2. Klicke auf **🔄 Alles zurücksetzen**
3. Bestätige die Warnung
4. Alle Vokabeln, Listen und Fortschrittsdaten werden gelöscht

---

## Technische Details

### Datenspeicherung

Die App speichert alle Daten im **Browser LocalStorage**:
- Vokabeln
- Vokabellisten
- Lernfortschritt
- Aktivitätsprotokoll

**Wichtig:** Die Daten werden nur auf diesem Gerät/Browser gespeichert. Wenn du:
- Den Browser-Cache leerst → Daten gehen verloren
- Einen anderen Browser verwendest → Daten sind nicht vorhanden
- Einen anderen Computer verwendest → Daten sind nicht vorhanden

**Lösung:** Regelmäßig Daten exportieren und sichern!

### Externe Libraries

Die App verwendet folgende externe Bibliotheken (CDN):

| Bibliothek | Zweck | URL |
|-----------|-------|-----|
| Tesseract.js | OCR (Texterkennung) | https://cdn.jsdelivr.net/npm/tesseract.js |
| Chart.js | Diagramme | https://cdn.jsdelivr.net/npm/chart.js |
| Google Fonts | Schriftarten | https://fonts.googleapis.com |

Diese werden automatisch aus dem Internet geladen. Die App funktioniert **offline nicht**, wenn diese Bibliotheken nicht geladen wurden.

### Browser-Kompatibilität

Die App funktioniert auf:
- ✅ Chrome/Chromium (empfohlen)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

---

## Fehlerbehebung

### Problem: App lädt nicht

**Lösung:**
1. Überprüfe die URL: `http://192.168.1.100/vokabeltrainer/`
2. Stelle sicher, dass alle vier Dateien im Ordner `/volume1/web/vokabeltrainer/` sind
3. Aktualisiere die Seite (Strg+F5 oder Cmd+Shift+R)
4. Überprüfe die Browser-Konsole (F12) auf Fehler

### Problem: OCR funktioniert nicht

**Lösung:**
1. Überprüfe deine Internetverbindung (Tesseract.js wird von CDN geladen)
2. Versuche ein anderes Bild mit besserer Qualität
3. Stelle sicher, dass das Bild Deutsch und/oder Englisch enthält
4. Überprüfe die Browser-Konsole (F12) auf Fehler

### Problem: Daten sind weg

**Ursachen:**
- Browser-Cache wurde geleert
- Cookies wurden gelöscht
- Du verwendest einen anderen Browser oder Privatmodus

**Lösung:**
- Stelle sicher, dass du im gleichen Browser und Modus (nicht Privatmodus) arbeitest
- Importiere ein Backup, falls vorhanden

### Problem: App lädt sehr langsam

**Lösung:**
1. Überprüfe deine Internetverbindung
2. Warte, bis Tesseract.js vollständig geladen ist (erste OCR dauert länger)
3. Leere den Browser-Cache
4. Versuche einen anderen Browser

---

## Tipps und Tricks

### Effektives Lernen

1. **Regelmäßig lernen**: Tägliche kurze Sitzungen sind effektiver als lange Sitzungen
2. **Verschiedene Modi nutzen**: Wechsle zwischen Karteikarten, Quiz und Schreiben
3. **Listen organisieren**: Erstelle Listen nach Kapiteln oder Themen
4. **Fortschritt verfolgen**: Überprüfe regelmäßig dein Dashboard
5. **Daten sichern**: Exportiere deine Daten wöchentlich

### OCR-Tipps

1. **Gutes Foto machen**: Verwende gute Beleuchtung und halte die Kamera gerade
2. **Klare Schrift**: Vokabellisten sollten in klarer, lesbarer Schrift sein
3. **Format beachten**: Verwende "Deutsch - Englisch" oder "Deutsch | Englisch"
4. **Überprüfen**: Überprüfe die erkannten Vokabeln vor dem Import
5. **Mehrere Versuche**: Bei schlechter Erkennung versuche ein anderes Foto

### Mobile Nutzung

Die App ist vollständig mobil-optimiert:
- Touch-freundliche Buttons
- Responsive Layout
- Funktioniert auf Smartphones und Tablets
- Ideal zum Lernen unterwegs

---

## Sicherheit und Datenschutz

- **Keine Datenübertragung**: Alle Daten bleiben auf deinem Gerät/Browser
- **Keine Anmeldung**: Es ist keine Benutzerauthentifizierung erforderlich
- **Keine Verfolgung**: Es gibt keine Tracking oder Analytik
- **Offline-Funktion**: Nach dem ersten Laden funktioniert die App teilweise offline (ohne OCR und Diagramme)

---

## Support und Feedback

Falls du Probleme hast oder Verbesserungsvorschläge:

1. Überprüfe diese Anleitung
2. Überprüfe die Browser-Konsole (F12) auf Fehlermeldungen
3. Versuche einen anderen Browser
4. Leere den Browser-Cache

---

## Zusätzliche Ressourcen

- **Synology Web Station Dokumentation**: https://www.synology.com/
- **Tesseract.js Dokumentation**: https://tesseract.projectnaptha.com/
- **Chart.js Dokumentation**: https://www.chartjs.org/

---

**Viel Erfolg beim Lernen, Justin! 🎓📚**

Version 1.0 | Februar 2026
