#!/usr/bin/env bash
# Пересборка галереи объекта «Котельная» и заглавного кадра.
# Запускать из корня проекта: bash tools/build-kotelnaya-gallery.sh
# Подбирает интерпретатор с Pillow (системный Python его не имеет).
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

SRC="D:/iTES/8.1. Маркетинг/Сайт/Фото, картинки/Фото, картинки/Котельная, ПАО Т+"

echo
echo "=== галерея: 15 кадров, единый формат, мелкие кадры увеличиваются ==="
cd "$PROJ"
"$PY" tools/build-project-gallery.py "$SRC" kotelnaya-tplus \
  --alt "Куйбышевская отопительная котельная, ПАО Т+"

echo
echo "=== заглавный кадр: шире и ниже, чтобы в баннер попало здание, а не небо ==="
"$PY" tools/upscale-hero.py "$SRC/32s6DuGg4a8.jpg" kotelnaya-tplus \
  --ratio 3.2 --top-bias 1.0 --width 2560 --sharpen 100 \
  --alt "Куйбышевская отопительная котельная, ПАО Т+"

echo
echo "готово: public/media/projects/kotelnaya-tplus/"
