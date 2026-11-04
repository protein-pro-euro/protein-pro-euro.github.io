# Protein pro Euro

Ein kleiner Rechner: Wie viel Gramm Eiweiß bekommt man im Supermarkt für 1 €?
Rund 30 Produkte sind vorausgefüllt, alle Preise lassen sich überschreiben.

- `index.html`: die ganze Seite, ohne Abhängigkeiten, ohne Cookies
- `apps-script/Code.gs`: anonymer Zähler (Google Apps Script + Google Sheet)

## Was gezählt wird

Pro Ereignis eine Zeile: Zeitpunkt, Ereignis (`aufruf`, `ja`, `nein`) und das Kürzel aus
`?q=` (nur `a-z 0-9 _ -`, höchstens 40 Zeichen). Keine Cookies, keine IP-Adressen,
keine E-Mail-Adressen. Aufrufe mit `?test=1`, von `localhost` oder als lokale Datei
landen im Blatt „Test“ und zählen nicht mit.

## Preise und Nährwerte

Preise: Onlinepreise eines Discounters (überwiegend ALDI SÜD), abgerufen am 04.11.2026.
Haferflocken nach ALDI-Nord-Onlinepreis, Eier als 18er-Packung. Sojaschnetzel sind
geschätzt (Fachhandel, rund 10 €/kg), weil der Discounter sie nicht online führt.
Proteinwerte sind typische Werte pro 100 g im Rohzustand; bei Dosen gilt das
Abtropfgewicht, bei Eiern das Gewicht ohne Schale (rund 53 g je Ei).
