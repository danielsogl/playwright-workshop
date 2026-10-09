# Übung 6c – Frames, Drag & Drop und Uploads (Bonus)

**Ziel:** Du testest Inhalte in iframes, Drag & Drop und Datei-Uploads auf selbst gebauten Testseiten.
**Zeit:** Bonus-Übung, nicht im Zeitplan, ca. 15 Min. · **Startbranch:** `git switch ex/06c-frames-drag-upload` · **Datei:** `e2e/06c-frames-drag-upload.spec.ts`

> Roter Faden: Eigenständige Bonus-Übung, wie 6b mit Browser-Features jenseits normaler Klicks. · Du gibst weiter: `frameLocator`, `dragTo` und `setInputFiles` für eigene Projekte. · Zurückgefallen? → `git switch ex/06c-frames-drag-upload` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/06c-frames-drag-upload ex/07-authentifizierung`.

Die Demo-App hat keine Seiten für diese Themen. Mit `page.setContent(html)` setzt du in jedem Test eine eigene Testseite. Die HTML-Seiten sind vorgegeben, die Playwright-Schritte schreibst du selbst.

## Aufgaben

### Aufgabe 1 – Button im iframe klicken
Lege `e2e/06c-frames-drag-upload.spec.ts` an. Setze diese Testseite, klicke im iframe „Pay Now“ und prüfe die Ausgabe.

```html
<iframe srcdoc="
  <button id='pay'>Pay Now</button>
  <p id='out' role='status'></p>
  <script>
    document.getElementById('pay').onclick = () => {
      document.getElementById('out').textContent = 'paid';
    };
  </script>"></iframe>
```

**Fertig, wenn:** der Test grün ist und das Element mit Rolle `status` im iframe den Text „paid“ hat.
<details><summary>Tipp</summary>
Elemente in einem iframe erreichst du nicht über `page`, sondern über `page.frameLocator('iframe')`. Daran hängst du `getByRole(...)` wie gewohnt. Der Frame-Locator wartet auf den Frame.
</details>

### Aufgabe 2 – Drag & Drop
Setze diese Testseite, ziehe „Drag me“ auf die Zone und prüfe das Ergebnis.

```html
<div draggable="true">Drag me</div>
<div id="zone" style="width: 200px; height: 100px; border: 1px solid">Drop here</div>
<script>
  const zone = document.getElementById('zone');
  zone.addEventListener('dragover', (event) => event.preventDefault());
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.textContent = 'dropped';
  });
</script>
```

**Fertig, wenn:** der Test grün ist und der Text „dropped“ sichtbar ist.
<details><summary>Tipp</summary>
`locator.dragTo(target)`. Der `dragover`-Handler mit `preventDefault()` in der Seite ist nötig, sonst lehnt die Zone den Drop ab.
</details>

### Aufgabe 3 – Datei hochladen
Setze diese Testseite und lade eine Datei hoch, die nur im Speicher existiert.

```html
<label>Datei <input type="file"></label>
<p role="status"></p>
<script>
  document.querySelector('input').addEventListener('change', (event) => {
    document.querySelector('p').textContent = event.target.files[0].name;
  });
</script>
```

**Fertig, wenn:** der Test grün ist und der Status „hallo.txt“ zeigt.
<details><summary>Tipp</summary>
`getByLabel('Datei').setInputFiles(...)` nimmt ein Objekt mit `name`, `mimeType` und `buffer` (`Buffer.from('Text')`). Es braucht keine Datei auf der Platte.
</details>

## Zusatz (noch optional)

### Bonus A – Verschachtelte iframes
Baue eine Seite mit einem iframe, der einen weiteren iframe mit einem Button „Deep Button“ enthält. Prüfe, dass der Button sichtbar ist.
**Fertig, wenn:** der Test grün ist. Tipp: Frame-Locator lassen sich verketten. Seit v1.64 gelten Elemente in versteckten iframes als hidden.

### Bonus B – Datei auf eine Dropzone legen
Baue eine Zone mit `dragover`- und `drop`-Handler, der `event.dataTransfer.files` ausliest und den Dateinamen in ein `role="status"`-Element schreibt. Lege dann die Datei `bericht.txt` (Inhalt frei) mit `locator.drop()` (seit v1.60) ab.
**Fertig, wenn:** der Status „bericht.txt“ zeigt.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/06c-frames-drag-upload ex/07-authentifizierung` · oder `git switch ex/07-authentifizierung`.
