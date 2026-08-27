// LagerLogik 1.0 · statisches Rechenpaket
// Jede Aufgabe enthält answer/tolerance und einen vollständigen Rechenweg in solution.
const n=(id,field,topic,difficulty,question,answer,solution,tolerance=0.01)=>({id,field,topic,difficulty,type:'number',question,answer,tolerance,solution});

export const v10CalculationQuestions=[
// LF2 Bestände
n('v10c-2-01',2,'Bestände',2,'Tagesverbrauch 45 Stück, Lieferzeit 6 Tage, Mindestbestand 90 Stück. Berechne den Meldebestand.',360,'Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand = 45 × 6 + 90 = 360 Stück.'),
n('v10c-2-02',2,'Bestände',2,'Tagesverbrauch 32 Stück, Lieferzeit 5 Tage, Mindestbestand 75 Stück. Berechne den Meldebestand.',235,'Meldebestand = 32 × 5 + 75 = 235 Stück.'),
n('v10c-2-03',2,'Bestände',2,'Der Meldebestand beträgt 410 Stück, der Tagesverbrauch 50 Stück und die Lieferzeit 6 Tage. Berechne den Mindestbestand.',110,'Mindestbestand = Meldebestand − Tagesverbrauch × Lieferzeit = 410 − 50 × 6 = 110 Stück.'),
n('v10c-2-04',2,'Bestände',3,'Meldebestand 340 Stück, Mindestbestand 100 Stück, Lieferzeit 6 Tage. Berechne den durchschnittlichen Tagesverbrauch.',40,'Tagesverbrauch = (Meldebestand − Mindestbestand) ÷ Lieferzeit = (340 − 100) ÷ 6 = 40 Stück.'),

// LF7 Touren/Wirtschaftlichkeit
n('v10c-7-01',7,'Wirtschaftlichkeit',2,'Ein Lkw kann 12.000 kg Nutzlast aufnehmen. Geladen werden 9.300 kg. Wie hoch ist die Nutzlastauslastung in Prozent?',77.5,'Nutzlastauslastung = 9.300 ÷ 12.000 × 100 = 77,5 %.',0.1),
n('v10c-7-02',7,'Wirtschaftlichkeit',2,'Ein Fahrzeug bietet 40 m³ Ladevolumen. Belegt sind 34 m³. Berechne die Volumenauslastung in Prozent.',85,'Volumenauslastung = 34 ÷ 40 × 100 = 85 %.',0.1),
n('v10c-7-03',7,'Wirtschaftlichkeit',3,'Eine Tour ist 280 km lang. Der Lkw verbraucht durchschnittlich 27 Liter je 100 km. Wie viele Liter Kraftstoff werden rechnerisch benötigt?',75.6,'Kraftstoffbedarf = 280 ÷ 100 × 27 = 75,6 Liter.',0.1),

// LF11 Beschaffung
n('v10c-11-01',11,'Bestellverfahren',3,'Andler-Formel: Jahresbedarf 12.000 Stück, Bestellkosten 60 €, Einstandspreis 25 €, Lagerhaltungskostensatz 12 %. Berechne die optimale Bestellmenge und runde auf ganze Stück.',693,'q = √((200 × 12.000 × 60) ÷ (25 × 12)) = √480.000 ≈ 692,82 ≈ 693 Stück.',1),
n('v10c-11-02',11,'Bestellverfahren',3,'Andler-Formel: Jahresbedarf 8.000 Stück, Bestellkosten 45 €, Einstandspreis 20 €, Lagerhaltungskostensatz 10 %. Berechne die optimale Bestellmenge und runde auf ganze Stück.',600,'q = √((200 × 8.000 × 45) ÷ (20 × 10)) = √360.000 = 600 Stück.',1),
n('v10c-11-03',11,'Bestellverfahren',3,'Der Jahresbedarf beträgt 18.000 Stück und die optimale Bestellmenge 1.500 Stück. Wie viele Bestellungen sind rechnerisch pro Jahr erforderlich?',12,'Bestellhäufigkeit = Jahresbedarf ÷ Bestellmenge = 18.000 ÷ 1.500 = 12 Bestellungen.'),
n('v10c-11-04',11,'Bestellverfahren',3,'Jahresbedarf 10.000 Stück, Bestellmenge 500 Stück, Bestellkosten 40 € je Bestellung. Berechne die jährlichen Bestellkosten.',800,'Anzahl Bestellungen = 10.000 ÷ 500 = 20. Bestellkosten/Jahr = 20 × 40 € = 800 €.'),
n('v10c-11-05',11,'Beschaffung',3,'Listenpreis 50 € je Stück. Der Lieferant gewährt 10 % Rabatt. Berechne den Zieleinkaufspreis je Stück, wenn keine weiteren Zuschläge oder Nachlässe berücksichtigt werden.',45,'Rabatt = 50 € × 10 % = 5 €. Zieleinkaufspreis = 50 € − 5 € = 45 €.',0.01),
n('v10c-11-06',11,'Beschaffung',3,'Der Zieleinkaufspreis beträgt 80 €. Es werden 2 % Skonto genutzt. Berechne den Bareinkaufspreis.',78.4,'Skonto = 80 € × 2 % = 1,60 €. Bareinkaufspreis = 80 € − 1,60 € = 78,40 €.',0.02),
n('v10c-11-07',11,'Beschaffung',3,'Bareinkaufspreis 72 €, Bezugskosten 8 € je Stück. Berechne den Bezugspreis.',80,'Bezugspreis = Bareinkaufspreis + Bezugskosten = 72 € + 8 € = 80 €.'),

// LF12 Kennzahlen/Kosten
n('v10c-12-01',12,'Lagerkennzahlen',2,'Anfangsbestand 1.200 Stück, Endbestand 800 Stück. Berechne den einfachen durchschnittlichen Lagerbestand.',1000,'Ø Lagerbestand = (Anfangsbestand + Endbestand) ÷ 2 = (1.200 + 800) ÷ 2 = 1.000 Stück.'),
n('v10c-12-02',12,'Lagerkennzahlen',3,'Anfangsbestand 1.000 Stück. Die zwölf Monatsendbestände betragen zusammen 11.350 Stück. Berechne den durchschnittlichen Lagerbestand nach der 13-Werte-Methode.',950,'Ø Lagerbestand = (Anfangsbestand + Summe der 12 Monatsendbestände) ÷ 13 = (1.000 + 11.350) ÷ 13 = 950 Stück.'),
n('v10c-12-03',12,'Lagerkennzahlen',2,'Jahresverbrauch 24.000 Stück, durchschnittlicher Lagerbestand 2.000 Stück. Berechne die Umschlagshäufigkeit.',12,'Umschlagshäufigkeit = Jahresverbrauch ÷ durchschnittlicher Lagerbestand = 24.000 ÷ 2.000 = 12.',0.01),
n('v10c-12-04',12,'Lagerkennzahlen',2,'Die Umschlagshäufigkeit beträgt 8. Berechne die durchschnittliche Lagerdauer bei einem kaufmännischen Jahr mit 360 Tagen.',45,'Lagerdauer = 360 ÷ Umschlagshäufigkeit = 360 ÷ 8 = 45 Tage.',0.01),
n('v10c-12-05',12,'Lagerkennzahlen',3,'Die durchschnittliche Lagerdauer beträgt 30 Tage. Berechne die Umschlagshäufigkeit bei 360 Tagen.',12,'Umschlagshäufigkeit = 360 ÷ Lagerdauer = 360 ÷ 30 = 12.',0.01),
n('v10c-12-06',12,'Kosten',3,'Der durchschnittliche Lagerwert beträgt 80.000 € und der Lagerhaltungskostensatz 15 %. Berechne die Lagerhaltungskosten pro Jahr.',12000,'Lagerhaltungskosten = durchschnittlicher Lagerwert × Lagerhaltungskostensatz ÷ 100 = 80.000 € × 15 ÷ 100 = 12.000 €.',0.5),
n('v10c-12-07',12,'Kosten',3,'Der marktübliche Jahreszinssatz beträgt 6 % und die durchschnittliche Lagerdauer 60 Tage. Berechne den Lagerzinssatz.',1,'Lagerzinssatz = Jahreszinssatz × Lagerdauer ÷ 360 = 6 × 60 ÷ 360 = 1 %.',0.02),
n('v10c-12-08',12,'Kosten',3,'Der durchschnittliche Lagerwert beträgt 50.000 € und der Lagerzinssatz 1,5 %. Berechne die Lagerzinsen.',750,'Lagerzinsen = durchschnittlicher Lagerwert × Lagerzinssatz ÷ 100 = 50.000 € × 1,5 ÷ 100 = 750 €.',0.1),
n('v10c-12-09',12,'Kosten',3,'Die gesamten Lagerkosten betragen 36.000 €, der durchschnittliche Lagerwert 240.000 €. Berechne den Lagerhaltungskostensatz in Prozent.',15,'Lagerhaltungskostensatz = Lagerkosten ÷ durchschnittlicher Lagerwert × 100 = 36.000 ÷ 240.000 × 100 = 15 %.',0.05),
n('v10c-12-10',12,'Wirtschaftlichkeit',3,'Ein Lager hat 900 m² nutzbare Lagerfläche. Tatsächlich belegt sind 720 m². Berechne den Flächennutzungsgrad in Prozent.',80,'Flächennutzungsgrad = belegte Fläche ÷ nutzbare Fläche × 100 = 720 ÷ 900 × 100 = 80 %.',0.1),
n('v10c-12-11',12,'Wirtschaftlichkeit',3,'Von 2.500 Auftragspositionen wurden 2.425 fehlerfrei kommissioniert. Berechne den Anteil fehlerfreier Positionen in Prozent.',97,'Fehlerfreier Anteil = 2.425 ÷ 2.500 × 100 = 97 %.',0.1),
n('v10c-12-12',12,'Wirtschaftlichkeit',3,'Von 1.200 angeforderten Positionen konnten 1.140 sofort aus dem Lager geliefert werden. Berechne den Lieferbereitschaftsgrad in Prozent.',95,'Lieferbereitschaft = 1.140 ÷ 1.200 × 100 = 95 %.',0.1),
n('v10c-12-13',12,'Lagerkennzahlen',3,'Jahresverbrauch 18.000 Stück, Umschlagshäufigkeit 9. Berechne den durchschnittlichen Lagerbestand.',2000,'Ø Lagerbestand = Jahresverbrauch ÷ Umschlagshäufigkeit = 18.000 ÷ 9 = 2.000 Stück.'),
n('v10c-12-14',12,'Kosten',3,'Der durchschnittliche Lagerbestand beträgt 1.500 Stück, der Einstandspreis 40 € je Stück. Berechne den durchschnittlichen Lagerwert.',60000,'Ø Lagerwert = Ø Lagerbestand × Einstandspreis = 1.500 × 40 € = 60.000 €.',0.5),
n('v10c-12-15',12,'Kosten',4,'Durchschnittlicher Lagerbestand 2.000 Stück, Einstandspreis 30 €, Lagerhaltungskostensatz 12 %. Berechne die jährlichen Lagerhaltungskosten.',7200,'Ø Lagerwert = 2.000 × 30 € = 60.000 €. Lagerhaltungskosten = 60.000 € × 12 ÷ 100 = 7.200 €.',0.5),
n('v10c-12-16',12,'Lagerkennzahlen',4,'Anfangsbestand 800 Stück, Zugänge im Jahr 5.400 Stück, Endbestand 1.000 Stück. Berechne den Jahresverbrauch.',5200,'Jahresverbrauch = Anfangsbestand + Zugänge − Endbestand = 800 + 5.400 − 1.000 = 5.200 Stück.'),
n('v10c-12-17',12,'Lagerkennzahlen',4,'Jahresverbrauch 14.400 Stück, durchschnittlicher Lagerbestand 1.200 Stück. Berechne zuerst die Umschlagshäufigkeit und gib anschließend nur die daraus folgende Lagerdauer in Tagen als Antwort ein.',30,'Umschlagshäufigkeit = 14.400 ÷ 1.200 = 12. Lagerdauer = 360 ÷ 12 = 30 Tage.',0.05),
n('v10c-12-18',12,'Kosten',4,'Durchschnittlicher Lagerwert 90.000 €, Jahreszinssatz 8 %, durchschnittliche Lagerdauer 45 Tage. Berechne die Lagerzinsen.',900,'Lagerzinssatz = 8 × 45 ÷ 360 = 1 %. Lagerzinsen = 90.000 € × 1 ÷ 100 = 900 €.',0.1)
];
