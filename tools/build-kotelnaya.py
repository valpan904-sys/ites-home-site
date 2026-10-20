#!/usr/bin/env python3
"""
Готовит фотогалерею объекта «Куйбышевская отопительная котельная» (ПАО Т+).

Источник: папка заказчика с тремя наборами одних и тех же кадров
  «16х9»     – кадры 1280x720
  «Карусель» – те же кадры в исходных пропорциях, часть в большем разрешении
  корень     – исходники
Для каждого кадра берётся версия с наибольшим разрешением в горизонтальной
ориентации, затем кадр приводится к пропорции 4:3 (обрезка по центру).

Результат: public/media/projects/kotelnaya-tplus/*.webp + превью и hero.webp
Запуск:    python tools/build-kotelnaya.py
"""
import glob
import json
import os
import sys

from PIL import Image, ImageOps

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = r"D:\iTES\8.1. Маркетинг\Сайт\Фото, картинки\Фото, картинки\Котельная, ПАО Т+"
OUT = os.path.join(PROJ, "public", "media", "projects", "kotelnaya-tplus")
MANIFEST = os.path.join(PROJ, "src", "content", "galleries.json")

RATIO = 4 / 3
LONG = 1200          # ширина большого кадра
THUMB_W = 480        # ширина превью
Q_BIG, Q_THUMB = 82, 75
ALT = "Куйбышевская отопительная котельная, ПАО Т+"


def crop_to_ratio(im, ratio=RATIO):
    """Обрезка по центру до нужной пропорции."""
    w, h = im.size
    if w / h > ratio:            # шире – обрезаем бока
        new_w = int(h * ratio)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = int(w / ratio)       # выше – обрезаем сверху и снизу
    top = (h - new_h) // 2
    return im.crop((0, top, w, top + new_h))


def save_webp(im, path, width, quality):
    if im.width > width:
        k = width / im.width
        resample = getattr(getattr(Image, "Resampling", Image), "LANCZOS")
        im = im.resize((width, max(1, round(im.height * k))), resample)
    im.save(path, "WEBP", quality=quality, method=6)
    return im.size


def main():
    if not os.path.isdir(SRC):
        print("нет папки с фотографиями:", SRC, file=sys.stderr)
        return 1
    os.makedirs(OUT, exist_ok=True)

    set169 = {os.path.splitext(os.path.basename(p))[0].rstrip("_"): p for p in glob.glob(SRC + r"\16х9\*")}
    setkar = {os.path.splitext(os.path.basename(p))[0]: p for p in glob.glob(SRC + r"\Карусель\*")}

    # hero – титульный кадр (без обрезки, широкий баннер)
    hero_src = set169.get("Титул") or setkar.get("Титул")
    hero = None
    if hero_src:
        im = ImageOps.exif_transpose(Image.open(hero_src)).convert("RGB")
        size = save_webp(im, os.path.join(OUT, "hero.webp"), 1280, Q_BIG)
        hero = {"src": "/media/projects/kotelnaya-tplus/hero.webp", "w": size[0], "h": size[1],
                "alt": ALT + " – главный вид"}
        print("  hero.webp            %dx%d  %5.1f КБ" % (size[0], size[1], os.path.getsize(os.path.join(OUT, "hero.webp")) / 1024))

    photos, report = [], []
    n = 0
    for key in sorted(set(list(set169) + list(setkar)) - {"Титул", "Титул_16х9"}):
        cands = []
        for src in (set169.get(key), setkar.get(key)):
            if not src:
                continue
            im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
            if im.width / im.height >= 1.2:          # берём только горизонтальные
                cands.append((im.width * im.height, src, im))
        if not cands:
            continue
        cands.sort(reverse=True, key=lambda x: x[0])
        _, src, im = cands[0]
        n += 1
        name = "%02d.webp" % n
        thumb = "%02d-t.webp" % n
        framed = crop_to_ratio(im)
        big_size = save_webp(framed, os.path.join(OUT, name), LONG, Q_BIG)
        save_webp(framed, os.path.join(OUT, thumb), THUMB_W, Q_THUMB)
        photos.append({"src": "/media/projects/kotelnaya-tplus/" + name,
                       "thumb": "/media/projects/kotelnaya-tplus/" + thumb,
                       "w": big_size[0], "h": big_size[1],
                       "alt": "%s – фото %d" % (ALT, n)})
        report.append("  %-22s -> %-12s %dx%d  %5.1f КБ" % (
            os.path.basename(src)[:22], name, big_size[0], big_size[1],
            os.path.getsize(os.path.join(OUT, name)) / 1024))

    print("\n".join(report))
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print("\nфотографий в галерее: %d, всего в папке: %.1f МБ" % (len(photos), total / 1048576))

    data = {}
    if os.path.exists(MANIFEST):
        data = json.load(open(MANIFEST, encoding="utf-8"))
    data["kotelnaya-tplus"] = photos
    json.dump(data, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("манифест обновлён:", MANIFEST)

    with open(os.path.join(PROJ, "src", "content", "hero-kotelnaya.json"), "w", encoding="utf-8") as fh:
        json.dump(hero or {}, fh, ensure_ascii=False, indent=1)
    print("hero записан в src/content/hero-kotelnaya.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
