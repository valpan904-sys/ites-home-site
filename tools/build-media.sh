#!/bin/bash
# Запускает tools/build-media.py интерпретатором, в котором есть Pillow.
# На этой машине Pillow стоит в виртуальном окружении Hermes, а не в системном Python.
set -u
cd "$(dirname "$0")/.." || exit 1

VENV_PY="/c/Users/ValeriyT14/AppData/Local/hermes/installs/4c8525b3702b98a2/environments/aadf0c5ea9754a67a9389c9017f5caa0/venv/Scripts/python.exe"

if python -c "import PIL" 2>/dev/null; then
  PY=python
elif [ -f "$VENV_PY" ]; then
  PY="$VENV_PY"
else
  echo "Не найден Python с Pillow. Установите: pip install Pillow" >&2
  exit 1
fi

echo "интерпретатор: $PY"
ffmpeg -version >/dev/null 2>&1 || echo "внимание: ffmpeg не найден — видео будет пропущено"
"$PY" tools/build-media.py "$@"
