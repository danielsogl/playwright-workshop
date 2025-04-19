# Übung 4B – Erweiterte Page Objects (Komponenten & Fluent Interface)

**Ziel:**
Verbessere das Page Object Model für die Public News Seite, indem du wiederverwendbare Komponenten-Objekte für einzelne News-Artikel erstellst und das Fluent Interface Pattern für eine bessere Lesbarkeit und Verkettung von Aktionen anwendest.

**Aufgaben:**

1. **NewsItem Komponenten-Objekt erstellen:**
   - Lege eine Datei an, z.B. `e2e/components/NewsItemComponent.ts`.
   - Definiere eine Klasse `NewsItemComponent` mit einem Konstruktor, der einen `Locator` für das Root-Element eines News-Artikels erhält.
   - Kapsle semantische Selektoren für Elemente innerhalb des Artikels als Properties.
   - Implementiere Methoden zur Datenextraktion und Interaktion (z.B. `getTitle()`, `getCategory()`, `getDescription()`, `clickTitle()`).

2. **PublicNewsPage mit Komponenten-Objekten anpassen:**
   - Importiere `NewsItemComponent` in `e2e/pages/PublicNewsPage.ts`.
   - Entferne Methoden, die jetzt in `NewsItemComponent` gekapselt sind.
   - Füge eine Methode hinzu, die ein `NewsItemComponent`-Objekt für einen bestimmten Index zurückgibt.
   - Optional: Füge eine Methode hinzu, die alle `NewsItemComponent`-Objekte als Array zurückgibt.

3. **Fluent Interface in PublicNewsPage implementieren:**
   - Passe Aktionsmethoden so an, dass sie `this` (oder `Promise<this>`) zurückgeben, um Verkettung zu ermöglichen.

4. **Tests mit erweiterten Page Objects refaktorieren:**
   - Verwende in den Tests die `getNewsItem(index)`-Methode, um auf einzelne Artikel zuzugreifen.
   - Nutze das Fluent Interface für verkettete Aktionen.
   - Passe Assertions an, um die Methoden des Komponenten-Objekts zu verwenden.

5. **Tests ausführen:**
   - Stelle sicher, dass alle Tests weiterhin erfolgreich sind.

**Zeit:** 30 Minuten

---

> **Tipp:** Komponenten-Objekte machen Tests robuster gegenüber Änderungen in der Struktur wiederholender Elemente. Das Fluent Interface verbessert die Lesbarkeit von Testsequenzen. Verwende ausschließlich semantische, benutzerorientierte Selektoren.
