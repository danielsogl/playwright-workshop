#!/usr/bin/env bash
# Setzt die Branches ex/* anhand der Commits `ex(NN): …` der Quell-Branch-Historie.
# ex/<slug von exercises/NN-*.md> = Elternteil des Commits ex(NN)  (Startpunkt von Übung NN)
# ex/end                          = Spitze der Quelle
# Aufruf: scripts/sync-checkpoints.sh [quell-ref]   (Default: checkpoints)
set -euo pipefail
src=${1:-checkpoints}
cd "$(git rev-parse --show-toplevel)"

first=$(git log --reverse --format=%H --grep='^ex([0-9a-z]*):' "$src" | head -1)
[ -z "$(git rev-list --merges "$first^..$src")" ] || { echo "Merge-Commits in $src – Kette muss linear sein" >&2; exit 1; }

while read -r hash subject; do
  nn=${subject#ex(}; nn=${nn%%)*}
  slug=$(git ls-tree --name-only "$src" exercises/ | sed -n "s|^exercises/\(${nn}-.*\)\.md$|\1|p" | head -1)
  [ -n "$slug" ] || { echo "Kein Handout für Übung $nn" >&2; exit 1; }
  git branch -f "ex/$slug" "$hash^"
  echo "ex/$slug -> $(git rev-parse --short "$hash^")"
done < <(git log --reverse --format='%H %s' --grep='^ex([0-9a-z]*):' "$src")

git branch -f ex/end "$src"
echo "ex/end -> $(git rev-parse --short "$src")"
