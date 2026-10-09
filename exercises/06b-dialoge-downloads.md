# Übung 6b – Dialoge & Datei-Downloads (Bonus)

**Ziel:** Du behandelst Browser-Dialoge (alert, confirm, prompt) und fängst einen Datei-Download ab.
**Zeit:** Bonus-Übung, nicht im Zeitplan, ca. 15 Min. · **Startbranch:** `git switch ex/06b-dialoge-downloads` · **Dateien:** `e2e/06b-dialoge.spec.ts`, `e2e/06b-file-download.spec.ts`

> Roter Faden: Anderer Winkel derselben App: `/dialog-demo` und `/file-download`, eigenständige Bonus-Techniken ohne Voraussetzung aus früheren Übungen. · Du gibst weiter: das Muster „Handler bzw. Event vor der Aktion registrieren“. · Zurückgefallen? → `git switch ex/06b-dialoge-downloads` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/06b-dialoge-downloads ex/06c-frames-drag-upload`.

Ein **Dialog** ist ein natives Browser-Fenster (`alert`, `confirm`, `prompt`). Playwright schließt unbehandelte Dialoge selbst. Willst du sie prüfen oder beantworten, registrierst du einen `dialog`-Handler **vor** dem Klick, der den Dialog auslöst. Jeder Dialog braucht in deinem Handler **genau ein** `accept()` oder `dismiss()`, sonst hängt die auslösende Aktion.

## Aufgaben

### Aufgabe 1 – Alert bestätigen
Lege `e2e/06b-dialoge.spec.ts` an. Öffne `/dialog-demo`, registriere den Handler, klicke „Show alert dialog“ und bestätige den Dialog. Prüfe im Handler, dass der Typ `alert` ist.
**Fertig, wenn:** der Test grün ist und der Bereich mit Rolle `status` den Text „Alert dialog was shown“ enthält.
<details><summary>Tipp</summary>
`page.on('dialog', async (dialog) => { … })`, darin `dialog.type()` und `await dialog.accept()`. Der Button ist `getByRole('button', { name: 'Show alert dialog' })`. Kommt der Dialog nicht, klickst du zu früh: Die Seite reagiert erst nach der Hydration (React hängt dann seine Handler an). Das `beforeEach` der Musterlösung zeigt, wie man darauf wartet.
</details>

### Aufgabe 2 – Confirm ablehnen
Schreibe einen zweiten Test für „Show confirm dialog“. Lehne den Dialog ab und prüfe, dass die App das „Abbrechen“ registriert.
**Fertig, wenn:** der Test grün ist und der Status „Confirm dialog result: Cancel“ zeigt. Zweite Variante: mit `accept()` zeigt er „Confirm dialog result: OK“.
<details><summary>Tipp</summary>
Ablehnen: `await dialog.dismiss()`. Die Dialog-Meldung liest du mit `dialog.message()`.
</details>

### Aufgabe 3 – Prompt beantworten
Dritter Test für „Show prompt dialog“. Beantworte den Prompt mit einem eigenen Text.
**Fertig, wenn:** der Test grün ist und der Status „Prompt dialog result: <dein Text>“ zeigt. Zusätzlich prüfst du im Handler, dass die Meldung „Please enter your name:“ lautet und der Vorgabewert (`defaultValue()`) „Default Name“ ist.
<details><summary>Tipp</summary>
`await dialog.accept('mein Text')`. Mit `dismiss()` zeigt die App „Prompt dialog result: User cancelled“.
</details>

### Aufgabe 4 – PDF-Download prüfen
Lege `e2e/06b-file-download.spec.ts` an. Öffne `/file-download`, warte auf das `download`-Event, klicke den PDF-Button (`getByTestId('download-pdf-button')`) und prüfe die Datei.
**Fertig, wenn:** der Test grün ist, der vorgeschlagene Dateiname `playwright-demo.pdf` ist und der Download keinen Fehler hat (`failure()` ist `null`).
<details><summary>Tipp</summary>
Das Event startest du **vor** dem Klick: `const downloadPromise = page.waitForEvent('download')`, danach klicken und `await downloadPromise`. `download.suggestedFilename()` ist synchron. `download.failure()` prüfst du vor `path()` oder `saveAs()`, denn die werfen bei einem fehlgeschlagenen Download.
</details>

## Zusatz (noch optional)

### Bonus A – `beforeunload`
Klicke „Add BeforeUnload“ und prüfe, dass der Status „Beforeunload event listener added“ zeigt. Löse dann den Dialog aus, indem du die Seite schließt. Prüfe, dass ein Dialog vom Typ `beforeunload` kam.
**Fertig, wenn:** der Test grün ist. Tipp: `page.close({ runBeforeUnload: true })`, ohne die Option führt Playwright keine Unload-Handler aus. Der Dialog kommt nach dem Schließen, nutze `expect.poll(() => …)` auf eine Variable.

### Bonus B – `dialogclosed` mitloggen
Das Event `page.on('dialogclosed', …)` (seit v1.63) feuert, nachdem ein Dialog beantwortet wurde. Sammle damit die Dialog-Typen in einem Array und löse einen Alert aus.
**Fertig, wenn:** `expect.poll(() => closed).toEqual(['alert'])` grün ist. `expect.poll` wiederholt die Funktion, bis die Erwartung stimmt.

### Bonus C – JSON- und CSV-Download
Prüfe zwei weitere Downloads (`download-json-button`, `download-csv-button`): Dateiname und Inhalt. Du entscheidest selbst, wie du den Inhalt liest (`download.path()`, `saveAs()` oder `createReadStream()`).
**Fertig, wenn:** der JSON-Download `test-data.json` mit 100 Einträgen in `data` liefert und die erste CSV-Zeile `Name,Alter,Stadt` lautet.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/06b-dialoge-downloads ex/06c-frames-drag-upload` · oder `git switch ex/06c-frames-drag-upload`.
