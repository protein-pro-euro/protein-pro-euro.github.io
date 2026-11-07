/**
 * Future Food – anonymer Zähler für den Protein-pro-Euro-Rechner.
 *
 * Wird als Web-App an ein Google Sheet gebunden (Erweiterungen → Apps Script).
 * Gespeichert werden pro Ereignis nur: Zeitpunkt, Ereignis (aufruf / ja / nein), Quelle (?q=).
 * Keine Cookies, keine IP-Adressen (Apps Script bekommt sie gar nicht), keine E-Mail-Adressen.
 *
 * Aufruf:  <web-app-url>?e=aufruf&q=reddit1
 *          <web-app-url>?e=ja&test=1   → landet im Blatt "Test", zählt nicht mit
 */

var BLATT_ECHT = 'Ereignisse';
var BLATT_TEST = 'Test';
var BLATT_AUSWERTUNG = 'Auswertung';
var KOPF = ['Zeitpunkt', 'Ereignis', 'Quelle'];
var ERLAUBT = { aufruf: true, ja: true, nein: true };

function doGet(e) {
  return verarbeite_(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  return verarbeite_(e && e.parameter ? e.parameter : {});
}

function verarbeite_(p) {
  var ereignis = String(p.e || '').toLowerCase();
  if (!ERLAUBT[ereignis]) {
    return antwort_('ignoriert');
  }
  var quelle = String(p.q || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'direkt';
  var istTest = String(p.test || '') === '1';

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var blatt = holeBlatt_(istTest ? BLATT_TEST : BLATT_ECHT);
    blatt.appendRow([new Date(), ereignis, quelle]);
  } finally {
    lock.releaseLock();
  }
  return antwort_('ok');
}

function holeBlatt_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var blatt = ss.getSheetByName(name);
  if (!blatt) {
    blatt = ss.insertSheet(name);
    blatt.appendRow(KOPF);
    blatt.setFrozenRows(1);
  }
  return blatt;
}

function antwort_(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Einmal von Hand ausführen (im Editor oben "einrichten" wählen → Ausführen).
 * Legt die drei Blätter an und baut die Auswertung mit Formeln.
 */
function einrichten() {
  holeBlatt_(BLATT_ECHT);
  holeBlatt_(BLATT_TEST);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var a = ss.getSheetByName(BLATT_AUSWERTUNG) || ss.insertSheet(BLATT_AUSWERTUNG, 0);
  a.clear();
  var E = "'" + BLATT_ECHT + "'!";
  // Je nach Spracheinstellung trennt Sheets Argumente mit "," (englisch) oder ";" (deutsch).
  // § steht unten als Platzhalter für den passenden Trenner. Dezimalzahlen bewusst vermieden.
  var trenner = ermittleTrenner_(a);
  function f(formel) { return formel.replace(/§/g, trenner); }
  a.getRange('A1:B1').setValues([['Gesamt (ohne Tests)', '']]).setFontWeight('bold');
  a.getRange('A2:A7').setValues([['Seitenaufrufe'], ['Ja'], ['Nein'], ['Ja-Quote (Ja ÷ Aufrufe)'], ['Ziel 04.01.2027'], ['Erfolg?']]);
  a.getRange('B2').setFormula(f('=COUNTIF(' + E + 'B:B§"aufruf")'));
  a.getRange('B3').setFormula(f('=COUNTIF(' + E + 'B:B§"ja")'));
  a.getRange('B4').setFormula(f('=COUNTIF(' + E + 'B:B§"nein")'));
  a.getRange('B5').setFormula(f('=IF(B2=0§0§B3/B2)')).setNumberFormat('0.0%');
  a.getRange('B6').setValue('mind. 300 Aufrufe und mind. 5 % Ja');
  a.getRange('B7').setFormula(f('=IF(AND(B2>=300§B5*100>=5)§"JA"§"noch nicht")'));
  a.getRange('A9').setValue('Nach Quelle (?q=)').setFontWeight('bold');
  a.getRange('A10').setFormula(f(
    '=IFERROR(QUERY(' + E + 'A:C§"select C, count(A) where B is not null and B <> \'Ereignis\' group by C pivot B"§0)§"noch keine Daten")'
  ));
  a.getRange('E1').setValue('Test-Klicks (zählen nicht)').setFontWeight('bold');
  a.getRange('E2').setFormula("=COUNTA('" + BLATT_TEST + "'!B:B)-1");
  a.setColumnWidth(1, 200);
  a.setColumnWidth(2, 220);
  var leer = ss.getSheetByName('Tabellenblatt1') || ss.getSheetByName('Sheet1');
  if (leer && leer.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(leer);
}

// Probiert eine Testformel mit Komma. Rechnet sie, ist "," richtig, sonst ";".
function ermittleTrenner_(blatt) {
  var zelle = blatt.getRange('D1');
  zelle.setFormula('=SUM(1,1)');
  SpreadsheetApp.flush();
  var klappt = zelle.getValue() === 2;
  zelle.clearContent();
  return klappt ? ',' : ';';
}
