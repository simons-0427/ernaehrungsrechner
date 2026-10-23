# Ernährungsrechner v1.5

Stand: 23.10.2026

Der Ernährungsrechner vergleicht Lebensmittel, verwaltet persönliche Tagesziele und berechnet einen günstigen Ernährungsplan. Die deutsche und die englische Oberfläche laufen mit derselben Datenbank und demselben Solver im Browser. Ein Konto und eine Serverberechnung sind nicht nötig.

## Neu in v1.5

- Erweiterte Filter für alle Parameter und den Preis. Mehrere Bedingungen lassen sich kombinieren, zum Beispiel Eiweiß über 20 g und Eiweißqualität ab 80 %.
- Zentrierte, durchsuchbare Auswahlfenster für Parameter und Bedingungen. Die Spaltenbeschriftungen erscheinen nur einmal. Eiweißqualität steht direkt unter Eiweiß, Flüssigkeit am Ende.
- 120 zusätzliche Lebensmittel, insgesamt 1.636 Einträge. Die Preise der neuen Einträge enthalten 10 % Sicherheitsaufschlag.
- Verbesserter Solver für ganze Gramm, Milliliter, Stück und Tropfen. Eine zusätzliche Prüfung kontrolliert die Mengen und aktiven Anforderungen nach der Optimierung.
- Der Plan wird nur auf Knopfdruck berechnet. Nach einer relevanten Änderung bleibt der bisherige Plan sichtbar und erhält einen Hinweis zur nötigen Neuberechnung.
- Neue Lebensmittel werden einmalig in bestehende lokal gespeicherte Datenbanken übernommen. Persönliche Änderungen und eigene Lebensmittel bleiben dabei erhalten.
- Die neuen Funktionen sind auf Deutsch und Englisch verfügbar. PFAS-4 und die Einzelsubstanzen werden in der Datenbank berücksichtigt.

## Inhalt

```text
v1.5_Ernaehrungsrechner/
├── README.md
├── SHA256SUMS.txt
├── assets/
│   ├── site-header.css
│   └── site-header.js
├── ernaerung/
│   ├── index.html
│   ├── database.json
│   ├── parameter.md
│   ├── requirements.json
│   ├── requirements.js
│   ├── solver.js
│   ├── plan-worker.js
│   └── pfas4-estimates.js
└── en/
    └── nutrition/
        └── index.html
```

Das Paket folgt dem Aufbau von v1.4 mit getrennten Sprachseiten und einer gemeinsamen Datenbank. Die englische Seite liegt jetzt direkt im tatsächlichen Website-Zielpfad `en/nutrition/`. In v1.4 war sie im Download unter `nutrition/` abgelegt. Die gemeinsamen Header-Dateien liegen ebenfalls bei.

Der gesamte Ordner `images/` einschließlich `images/favicons/` sowie `Daten/` und `benchmarks/` sind nicht enthalten. Bilder und Favicons können aus der bestehenden Website verwendet werden. Fehlende Vorschaubilder und Favicons verhindern den Betrieb des Rechners nicht. Die Datei `database.js` wird von diesen Seiten nicht geladen; verwendet wird `database.json`.

## Lokal starten

1. ZIP entpacken und den Ordner `v1.5_Ernaehrungsrechner` öffnen.
2. In diesem Ordner ein Terminal öffnen und starten:

   ```powershell
   python -m http.server 8000
   ```

3. Im Browser öffnen:
   - Deutsch: <http://localhost:8000/ernaerung/>
   - Englisch: <http://localhost:8000/en/nutrition/>

Ein anderer statischer HTTP-Server funktioniert ebenfalls. Wichtig ist, das Paketverzeichnis als Webwurzel zu verwenden. Die englische Seite lädt ihre Daten und den Worker über `/ernaerung/`. HTML-Dateien deshalb über HTTP öffnen, nicht direkt per Doppelklick.

Die Hauptnavigation verweist teilweise auf weitere Seiten von smstark-projekt.de. Diese Website-Seiten sind nicht Teil dieses Rechnerpakets. Die Schriften werden von Google Fonts geladen; ohne diese Verbindung verwendet der Browser Ersatzschriften.

## Auf einen Webserver hochladen

Die Ordner `ernaerung`, `en` und `assets` in die Webwurzel übertragen. Beim Hochladen vorhandene Ordner zusammenführen und nur die enthaltenen Dateien aktualisieren. Andere Dateien der Website bleiben bestehen. Zuerst Daten und JavaScript-Dateien übertragen, danach die beiden HTML-Dateien.

Die Zielpfade lauten:

| Paketdatei | Ziel auf der Website |
| --- | --- |
| `ernaerung/index.html` und die zugehörigen Dateien | `/ernaerung/` |
| `en/nutrition/index.html` | `/en/nutrition/index.html` |
| `assets/site-header.css` und `assets/site-header.js` | `/assets/` |

Für einen Betrieb in einem zusätzlichen Unterverzeichnis müssen die absoluten Pfade der englischen Seite angepasst werden. Das Paket ist für die oben genannte Webwurzel vorbereitet. Eine Veröffentlichung dieses ZIPs auf GitHub aktualisiert die laufende Website nicht automatisch.

## Daten und Berechnung

- Die Werte beziehen sich je nach Lebensmittel auf 100 g, 100 ml, ein Stück oder einen Tropfen. Erweiterte Filter verwenden diese Basis unabhängig von der aktuellen Dichteanzeige. Prozentwerte werden nicht skaliert.
- Alle Filterbedingungen müssen gleichzeitig erfüllt sein. Leere Nährwertfelder zählen wie in der Tabelle als 0. Eine unbekannte Eiweißqualität erfüllt keinen Filter für Eiweißqualität.
- Bei 73 der neuen Lebensmittel wurden passende Werte aus BLS 4.0 verwendet. Die übrigen 47 Einträge beruhen ganz oder teilweise auf Vergleichslebensmitteln. Einzelne Produktangaben wurden nach Herstellerdeklaration korrigiert. Auch BLS-Profile enthalten ergänzende Schätzungen.
- Die Preise der neuen Lebensmittel wurden am 21.10.2026 anhand dokumentierter ALDI Nord und Lidl Angaben geprüft. Verwendet wurde der günstigste dokumentierte Vergleichspreis zuzüglich 10 %. Das ist keine vollständige Markterhebung; Preise und Verfügbarkeit können sich ändern.
- Preise für Großbritannien und die USA sind teilweise aus vorhandenen Preisrelationen abgeleitet und nicht für jedes neue Produkt im dortigen Handel recherchiert.
- PFAS-4-Werte sind niedrige Schätzwerte aus Lebensmittelgruppen und Fischarten. Sie sind keine Messungen der einzelnen Produkte. Besonders Wasser, Eier, Fisch und Innereien können stark abweichen.
- Ganze Mengen werden nach der Optimierung separat auf die aktiven Grenzen geprüft. Der Solver arbeitet mit mehreren Such- und Reparaturschritten; ein berechneter Plan ist nicht in jedem Fall als global billigster ganzzahliger Plan bewiesen.
- Datenbankänderungen und Profile werden im Browser gespeichert. Für einen Browserwechsel oder vor dem Zurücksetzen die Exportfunktion verwenden.

## Prüfung und Integrität

Die erweiterten Filter wurden auf Deutsch und Englisch im Browser mit Desktop- und Handyansichten geprüft. Dazu gehören Vergleichsgrenzen, kombinierte Bedingungen, Eiweißqualität, Suche, bestehende Filter und Abbrechen. Separate Prüfungen kontrollieren die Übernahme älterer Browserdaten, die Datenbanksynchronisierung und die manuelle Neuberechnung.

`SHA256SUMS.txt` enthält die Prüfsummen aller übrigen Paketdateien. Der ZIP-Inhalt wird beim Paketbau gegen diese Dateien geprüft. Diese Prüfungen belegen den lokalen Stand. Sie ersetzen keine Kontrolle nach dem Upload auf einen anderen Server.

## English quick start

Extract the archive, start a static HTTP server in the package root, and open <http://localhost:8000/en/nutrition/>. Keep the `ernaerung/`, `en/` and `assets/` folders together. Images and favicons are excluded from this package. The English page shares the database and solver from `/ernaerung/`. It includes the same advanced filters and whole-amount planning features as the German page.

Food composition, contaminant estimates and prices have the limitations described above. Some new food profiles use comparable foods rather than product-specific measurements, and UK/US prices are partly estimates.
