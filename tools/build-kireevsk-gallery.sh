#!/usr/bin/env bash
# Пересборка галереи и заглавного кадра объекта «Реконструкция очистных сооружений, Киреевск».
# Запускать из корня проекта: bash tools/build-kireevsk-gallery.sh
# Фото объекта лежат вне проекта (в папке заказчика), здесь только путь к ним.
set -euo pipefail

PROJ="$(cd "$(dirname "$0")/.." && pwd)"
PY="${PYTHON_WITH_PILLOW:-}"
if [ -z "$PY" ] || [ ! -x "$PY" ]; then
  PY="$(ls -d "$HOME/AppData/Local/hermes/installs"/*/environments/*/venv/Scripts/python.exe 2>/dev/null | head -1)"
fi
if [ -z "$PY" ] || [ ! -x "$PY" ]; then
  echo "не найден интерпретатор с Pillow" >&2
  exit 1
fi
echo "интерпретатор: $PY"

PHOTOS="C:/Users/ValeriyT14/Documents/ites-home-media/kireevsk-photos"
HERO="C:/Users/ValeriyT14/Documents/ites-home-media/kireevsk-hero/photo_2026-10-23_12-26-05-2.jpg"

cd "$PROJ"

echo
echo "=== галерея: кадры одного формата 4:3, порядок и подписи — в photo-captions.json ==="
"$PY" tools/build-project-gallery.py "$PHOTOS" kireevsk \
  --alt "Реконструкция очистных сооружений г. Киреевск"

echo
echo "=== заглавный кадр: монолитные стены, баннер 3,2:1 ==="
"$PY" tools/upscale-hero.py "$HERO" kireevsk \
  --ratio 3.2 --top-bias 0.42 --width 2560 --sharpen 100 \
  --alt "Монолитные стены очистных сооружений – реконструкция в г. Киреевск"

echo
echo "готово: public/media/projects/kireevsk/"
