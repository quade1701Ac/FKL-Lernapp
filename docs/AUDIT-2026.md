# LagerLogik: Prüfung und Korrekturen vom 16.09.2026

Status: geprüfter Entwicklungsstand, noch nicht für die Produktion freigegeben.

## Umfang und Ergebnis

Ausgangspunkt war main `82a2a0b3dac5375f52abb6683e4ab2b6b147583a`.
Die 868 ursprünglich aggregierten Aufgaben wurden anhand von Fragetext,
Antwortoptionen und Referenzlösungen durchgesehen. 41 Aufgaben ergänzen
curriculare Lücken. Der technische Audit zählt jetzt 909 Rohaufgaben und
808 auswählbare Aufgaben (345 MC, 398 Freitext, 55 Zahlen, 10 Reihenfolgen).
101 Aufgaben werden durch die bestehenden Qualitäts- und Duplikatfilter
ausgeschlossen. Historische, bereits vor der Aggregation ausgeschlossene
Dateiinhalte sind nicht vollständig Bestandteil dieser Prüfung.

Die Durchsicht ist keine fachliche Zertifizierung. Technisch gültige Aufgaben
können weiterhin zu einfache Distraktoren oder fachlich diskutierbare
Formulierungen enthalten. Vollständige Abdeckung jeder regionalen IHK-Aufgabe
wird nicht behauptet. Ein unverändert wiederholter Musterlösungstext erhält
nun lokal volle Punkte; dies beweist allein keine semantisch faire Bewertung.

## Fachliche Korrekturen und Ergänzungen

Korrigiert wurden unter anderem die Abgrenzung von Mengen- und Sachmängeln,
Transportschäden, zentrale/dezentrale Abgabe beim Kommissionieren, Lastschrift,
BIP ohne doppelte Vorleistungen, Kündigung in der Ausbildung sowie die
vollständige Abfallhierarchie. Fünf MC-Aufgaben mit „Alle genannten“ wurden
auf mehrere tatsächlich richtige Einzeloptionen umgestellt, damit das
Mischen der Antworten ihre Bedeutung nicht verfälscht.

Die Ergänzungen orientieren sich an diesen bisher schwach vertretenen Themen:

| LF | Ergänzungen | Auswählbar |
|---|---|---:|
| 1 | Rüge und Verjährung, Lieferverzug, Flächen | 69 |
| 2 | Lagervertrag, Bodenbelastung, Volumen, Emissionen | 63 |
| 3 | Güterpflege, Inventur, Tara, Reichweite | 53 |
| 4 | Rampen, Erste Hilfe, Transportmittel | 52 |
| 5 | Kommissionierzeit und Verfahren | 59 |
| 6 | Verpackungskosten, Abfälle, Volumen | 56 |
| 7 | Zeitplanung, Schiene, Umwegkosten | 62 |
| 8 | Kräfte, LC/STF, Plomben | 66 |
| 9 | Frachttarife, englische Begriffe, kombinierter Verkehr | 63 |
| 10 | ABC, Bedarfsermittlung, Produktionsfaktoren | 59 |
| 11 | Märkte, Incoterms, Bezugskalkulation | 69 |
| 12 | Bilanzveränderung, Buchung, Wareneinsatz, Gewinn | 89 |
| WiSo | Bestehender Pool mit fachlichen Korrekturen | 48 |

Diese Zahlen betreffen den reproduzierbaren Audit-Pool einschließlich der
mit festem Startwert erzeugten Rechenaufgaben. Dynamische Teilpoolfilter
können je nach Auswahl weitere ähnliche Varianten zulassen.

## Bewertung und technische Korrekturen

- Kurze plausible Antworten und schwache lokale Bewertungen können eine
  KI-Zweitprüfung erreichen. Eine überzeugende KI-Korrektur wird nicht mehr
  mit einer fehlerhaften lokalen Bewertung heruntergemittelt.
- Nur ausdrücklich in der Frage verlangte Anzahlen erzeugen einen Zählauftrag.
  Zusammengesetzte Aufträge werden ganzheitlich bewertet.
- Groq-Primärmodell auf `openai/gpt-oss-120b` aktualisiert; Fallback bleibt
  `openai/gpt-oss-20b`. Netzwerkfehler erlauben den zweiten Versuch.
  Zeitlimits, Eingabegrößen und Antwortformate werden geprüft.
- Verspätete KI-Antworten verändern eine bereits verlassene Sitzung nicht.
- Zahlenparser akzeptiert deutsche Formate und Einheiten, aber keine
  zusammengeklebten Rechenausdrücke oder beliebigen Texte.
- Wiederholungen verwenden den tatsächlichen Antwortzeitpunkt. Cloud-Historie
  wird vollständig paginiert und vorrangig nach `created_at` gelesen.
- Kontowechsel entfernt auch alte lokale Migrationsstände; Hintergrund-
  Tokenrefresh blendet laufende Sitzungen nicht aus.
- Lernserien verwenden lokale Kalendertage auch bei Zeitumstellung.
- Prüfungsschwellen werden vor der Rundung geprüft.
- Numerische Varianten werden nicht mehr durch den semantischen
  Duplikatfilter verschluckt. MC-Indizes werden strenger validiert.
- In „Lager unter Druck“ zählt Arbeitszeit auch bei fertiggestellten Vorgängen
  gegen die Frist; sofortiges Beenden ergibt keine perfekte Schichtleistung.
- Im Einkaufs-Duell ist beim Präzisionslager-Angebot AxisPro der günstigste
  geeignete Anbieter. Alle 17 Fallentscheidungen sind rechnerisch getestet.
- Stapler-Zustandsänderungen erfolgen nicht mehr als Seiteneffekte innerhalb
  eines React-State-Updaters.

## Nachweise

Lokal erfolgreich:

- `npm test`: 21 Tests für Bewertung, Anbieterfehler, Auswahl, Historie,
  Einkaufsfälle und Simulationszustände.
- `npm run test:ui`: 4 React-Komponententests, darunter vollständige
  20er-Lern- und 30er-Prüfungssitzungen, 15/9/6-Zusammensetzung, alle Lernfelder,
  Lernkarten, WiSo, Fehlertraining, verzögerte KI-Antworten und Auth-Ereignisse.
- `npm run audit:questions`: 909/808; alle auswählbaren Freitext-Referenzantworten
  erreichen lokal volle Punkte.
- `npm run build`: erfolgreicher Next.js-Produktionsbuild mit öffentlichen
  Dummy-Konfigurationswerten. `git diff --check` ohne Fehler.

GitHub Actions führt Logiktests, Komponententests und Build künftig mit
`npm ci` und der eingecheckten Lockdatei aus. Die Komponententests ersetzen
Supabase und KI durch kontrollierte Testantworten; sie sind keine Browser-E2E-Tests.

Live wurde das aktive Supabase-Projekt `uwptopypgvnmmvhqwzlv` geprüft:
Status gesund, `answer_history` mit beiden Zeitspalten und aktivierter RLS.
Bei der Prüfung lagen 356 Zeilen vor; keine unterschiedlichen Zeitstempel
oder ungültigen Feld-/Score-Werte im abgefragten Aggregat. SELECT und INSERT
sind auf den angemeldeten Benutzer beschränkt. Keine Datenbankänderung vorgenommen.

Ein zusätzlicher Live-Aufruf der bestehenden Produktionsroute `/api/grade`
lieferte HTTP 200 und 100 Punkte für „Testweise kleinere Mengen bestellen“
zur Risikobegrenzung bei einem neuen Lieferanten. Als tatsächlich verwendetes
Modell meldete die Route `openai/gpt-oss-20b`. Dies bestätigt die bestehende
Anbindung für diesen Fall, noch nicht das neue Primärmodell dieses Branches.

## Verbleibende Grenzen vor Produktionsfreigabe

1. Browserprüfung wurde durch die automatische Freigabeprüfung wegen eines
   Nutzungslimits blockiert. Mobile Darstellung und echte Bedienung sind für
   diesen Änderungsstand noch nicht visuell abgenommen.
2. Das neue Groq-Modell ist mit simulierten Anbieterantworten getestet.
   Seine tatsächliche fachliche Bewertungsqualität braucht einen Live-Test
   mit repräsentativen richtigen, teilrichtigen, falschen und manipulativen Antworten.
3. Echter Login, Registrierung, Speicherung einer Antwort und Dashboard-Abgleich
   auf dem neuen Deployment stehen noch aus. Das bestehende Produktionslogin
   wurde vom Nutzer als funktionierend bestätigt.
4. Die 15/9/6-Prüfungsauswahl bleibt innerhalb der Bereiche zufällig; eine feste
   Lernfeld- und Aufgabentypverteilung in jedem Bereich ist nicht garantiert.
5. Der lokale Hochscore kann weiterhin eine KI-Prüfung überspringen. Es gibt
   keine Garantie gegen alle semantischen Fehlbewertungen.
6. Die Bewertungsroute besitzt weiterhin keine eigene Nutzerprüfung oder
   Ratenbegrenzung. Die Referenzlösung kommt vom Client. Vor größerer öffentlicher
   Nutzung sind serverseitige Aufgabenauflösung und Zugriffsschutz sinnvoll.
7. Fehlgeschlagene Cloud-Schreibvorgänge besitzen keine dauerhafte Wiederholungs-
   warteschlange. Lokaler Fortschritt ist kein Beweis für erfolgreichen Cloud-Sync.
8. Dokumenten-Werkstatt und Schicht-Simulator wurden im Code durchgesehen,
   aber nicht vollständig im Browser durchgespielt. Weitere manuelle
   Fachredaktion, insbesondere der Distraktoren, bleibt sinnvoll.

## Verwendete Primärquellen

- [KMK-Rahmenlehrplan Fachkraft für Lagerlogistik](https://www.kmk.org/fileadmin/Dateien/pdf/Bildung/BeruflicheBildung/rlp/FKLagerlogistik.pdf)
- [BGB § 434 Sachmangel](https://www.gesetze-im-internet.de/bgb/__434.html),
  [§ 438 Verjährung](https://www.gesetze-im-internet.de/bgb/__438.html),
  [§ 286 Verzug](https://www.gesetze-im-internet.de/bgb/__286.html)
- [HGB § 438 Schadensanzeige](https://www.gesetze-im-internet.de/hgb/__438.html),
  [§ 467 Lagervertrag](https://www.gesetze-im-internet.de/hgb/__467.html)
- [BBiG § 22 Kündigung](https://www.gesetze-im-internet.de/bbig_2005/__22.html)
- [KrWG § 6 Abfallhierarchie](https://www.gesetze-im-internet.de/krwg/__6.html)
- [ICC Incoterms 2020](https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/)
- [DGUV Gabelstapler](https://www.bghm.de/fileadmin/user_upload/Arbeitsschuetzer/Gesetze_Vorschriften/Informationen/208-004.pdf)
- [Groq-Modellabkündigungen](https://console.groq.com/docs/deprecations)
