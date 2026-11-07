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
geschätzt (Fachhandel, rund 10 €/kg), weil der Discounter sie nicht online führt. Sojaflocken nach dm-Onlinepreis (dmBio, 07.11.2026).
Protein- und Kalorienwerte sind typische Werte pro 100 g im Rohzustand; bei Dosen gilt
das Abtropfgewicht, bei Eiern das Gewicht ohne Schale (rund 53 g je Ei).

## Warum auch Kalorien

Protein pro Euro allein belohnt billige Kalorienbomben: Für 30 g Protein aus Haferflocken
isst man über 200 g und rund 830 kcal. Jede Karte zeigt deshalb, wie viel man für 30 g
Protein essen muss. Produkte mit weniger als 6 g Protein pro 100 kcal sind als
„kalorienreich“ markiert und kommen nicht aufs Podest. Sortieren geht nach Protein pro €
oder Protein pro kcal.
