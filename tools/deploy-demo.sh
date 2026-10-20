#!/bin/bash
# Публикует демо-версию сайта на GitHub Pages (ветка gh-pages).
# Коллегам остаётся только ссылка — никаких установок и сборок.
#
# Запуск:  bash tools/deploy-demo.sh
# Итог:    https://valpan904-sys.github.io/ites-home-site/
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${REPO:-https://github.com/valpan904-sys/ites-home-site.git}"
BASE="${BASE_PATH:-/ites-home-site/}"
PAGES_URL="https://valpan904-sys.github.io${BASE}"

echo "1/4 сборка демо-версии (BASE_PATH=$BASE, без индексации поисковиками)…"
rm -rf dist
BASE_PATH="$BASE" PREVIEW=1 npm run build | tail -3

echo "2/4 подготовка ветки gh-pages…"
TMP="$(mktemp -d)"
cp -r dist/public/. "$TMP"/
touch "$TMP/.nojekyll"          # чтобы GitHub Pages отдавал файлы как есть

cd "$TMP"
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="valpan904-sys" -c user.email="demo@home.ltd-ites.com" \
    commit -q -m "Демо-версия сайта от $(date '+%d.%m.%Y %H:%M')"

echo "3/4 публикация…"
git push -q --force "$REPO" gh-pages

cd - >/dev/null
rm -rf "$TMP"

echo "4/4 готово"
echo "ссылка для коллег: $PAGES_URL"
