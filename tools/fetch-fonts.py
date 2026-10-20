#!/usr/bin/env python3
"""
Скачивает шрифт Inter с Google Fonts и раскладывает его локально,
чтобы сайт не зависел от чужих доменов.

Результат:
  artifacts/ites-home/public/fonts/*.woff2
  artifacts/ites-home/src/styles/fonts.css   (локальные @font-face)

Запуск: python tools/fetch-fonts.py
"""
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = ROOT
FONT_DIR = os.path.join(SITE, "public", "fonts")
CSS_OUT = os.path.join(SITE, "src", "styles", "fonts.css")

CSS_URL = ("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700"
           "&display=swap&subset=cyrillic,cyrillic-ext,latin,latin-ext")
# современный User-Agent – иначе Google отдаёт ttf вместо woff2
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")


def get(url: str) -> bytes:
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()


def main() -> int:
    os.makedirs(FONT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(CSS_OUT), exist_ok=True)

    css = get(CSS_URL).decode("utf-8")
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})", css)
    if not blocks:
        print("не разобрал ответ Google Fonts", file=sys.stderr)
        return 1

    # Сайт русскоязычный: греческое и вьетнамское подмножества не нужны.
    # Браузер сам скачает только те подмножества, которые встретит на странице (unicode-range).
    allowed = {"cyrillic", "cyrillic-ext", "latin", "latin-ext"}

    out, n, kept = [], 0, set()
    for subset, block in blocks:
        if subset not in allowed:
            continue
        m_url = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", block)
        m_weight = re.search(r"font-weight:\s*(\d+)", block)
        m_range = re.search(r"unicode-range:\s*([^;]+);", block)
        if not (m_url and m_weight):
            continue
        weight = m_weight.group(1)
        name = "inter-%s-%s.woff2" % (subset, weight)
        kept.add(name)
        path = os.path.join(FONT_DIR, name)
        if not os.path.exists(path):
            data = get(m_url.group(1))
            with open(path, "wb") as fh:
                fh.write(data)
        size = os.path.getsize(path)
        n += 1
        out.append(
            "@font-face {\n"
            '  font-family: "Inter";\n'
            "  font-style: normal;\n"
            "  font-weight: %s;\n"
            "  font-display: swap;\n"
            '  src: url("/fonts/%s") format("woff2");\n' % (weight, name)
            + ("  unicode-range: %s;\n" % m_range.group(1).strip() if m_range else "")
            + "}"
        )
        print("  %-28s %6.1f КБ  (подмножество %s)" % (name, size / 1024, subset))

    header = (
        "/* Шрифт Inter, размещённый локально. Файл создаётся скриптом tools/fetch-fonts.py –\n"
        "   править вручную не нужно, при обновлении шрифта скрипт перезапишет его целиком. */\n\n"
    )
    with open(CSS_OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(header + "\n".join(out) + "\n")

    removed = 0
    for f in os.listdir(FONT_DIR):
        if f.endswith(".woff2") and f not in kept:
            os.remove(os.path.join(FONT_DIR, f))
            removed += 1

    total = sum(os.path.getsize(os.path.join(FONT_DIR, f)) for f in os.listdir(FONT_DIR))
    print("\nвсего начертаний: %d, вес шрифтов: %.1f КБ%s" % (n, total / 1024,
          " (удалено лишних подмножеств: %d)" % removed if removed else ""))
    print("css: %s" % CSS_OUT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
