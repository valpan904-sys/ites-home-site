#!/usr/bin/env python3
"""
Готовит заглавный кадр страницы объекта: обрезает источник до широкого баннера
и увеличивает разрешение, чтобы в шапке не было видно пикселей.

Зачем: исходники объекта – 1280–1600 px по ширине, а баннер занимает всю ширину
экрана (до 2560 px). Если отдать браузеру маленький файл, он растягивает его сам –
и это видно. Здесь кадр увеличивается заранее, хорошим ресемплером, с аккуратным
повышением резкости, и браузер уже сам уменьшает его до нужного размера – так
картинка остаётся чёткой.

Запуск:
    python tools/upscale-hero.py <источник> <slug> [--ratio 2.4] [--width 2560] [--sharpen 90]

Результат: public/media/projects/<slug>/hero.webp (и hero@1280.webp для узких экранов)
"""
import argparse
import json
import os
import sys

from PIL import Image, ImageFilter, ImageOps

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERO_FILES = {"kotelnaya-tplus": "hero-kotelnaya.json"}
RESAMPLE = getattr(getattr(Image, "Resampling", Image), "LANCZOS")


def crop_to_ratio(im, ratio):
    """Обрезка по центру до нужной пропорции (широкий баннер)."""
    w, h = im.size
    if w / h > ratio:                     # шире нужного – режем бока
        new_w = int(h * ratio)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = int(w / ratio)                # выше нужного – режем верх и низ
    top = int((h - new_h) * 0.45)         # чуть выше центра: небо обычно не главное
    return im.crop((0, top, w, top + new_h))


def upscale(im, target_w):
    """Двухшаговое увеличение с ресемплером Lanczos: мягче, чем одним прыжком."""
    if im.width >= target_w:
        return im
    step = im
    while step.width < target_w * 0.75:
        k = min(1.6, target_w / step.width)
        step = step.resize((max(1, round(step.width * k)), max(1, round(step.height * k))), RESAMPLE)
    return step.resize((target_w, max(1, round(step.height * target_w / step.width))), RESAMPLE)


def sharpness(im):
    """Оценка резкости: разброс яркости после фильтра краёв (больше – резче)."""
    g = im.convert("L").resize((400, max(1, round(400 * im.height / im.width))), RESAMPLE)
    e = g.filter(ImageFilter.FIND_EDGES)
    px = list(e.get_flattened_data()) if hasattr(e, "get_flattened_data") else list(e.getdata())
    m = sum(px) / len(px)
    return (sum((v - m) ** 2 for v in px) / len(px)) ** 0.5


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", help="исходный кадр")
    ap.add_argument("slug", help="адрес страницы объекта, например kotelnaya-tplus")
    ap.add_argument("--ratio", type=float, default=2.4, help="пропорция баннера (ширина/высота), по умолчанию 2.4")
    ap.add_argument("--width", type=int, default=2560, help="ширина готового файла, по умолчанию 2560")
    ap.add_argument("--sharpen", type=int, default=90, help="сила повышения резкости, по умолчанию 90")
    ap.add_argument("--quality", type=int, default=88, help="качество WebP, по умолчанию 88")
    ap.add_argument("--alt", default="", help="подпись для поисковиков")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("нет файла:", args.src, file=sys.stderr)
        return 1

    out_dir = os.path.join(PROJ, "public", "media", "projects", args.slug)
    os.makedirs(out_dir, exist_ok=True)

    im = ImageOps.exif_transpose(Image.open(args.src)).convert("RGB")
    w0, h0 = im.size
    framed = crop_to_ratio(im, args.ratio)
    before = sharpness(framed)

    big = upscale(framed, args.width)
    if args.sharpen:
        big = big.filter(ImageFilter.UnsharpMask(radius=1.8, percent=args.sharpen, threshold=4))
    after = sharpness(big)

    hero_path = os.path.join(out_dir, "hero.webp")
    big.save(hero_path, "WEBP", quality=args.quality, method=6)

    # лёгкая версия для узких экранов и медленных каналов
    small = big.resize((1280, max(1, round(big.height * 1280 / big.width))), RESAMPLE)
    small_path = os.path.join(out_dir, "hero-1280.webp")
    small.save(small_path, "WEBP", quality=args.quality, method=6)

    hero_file = os.path.join(PROJ, "src", "content", HERO_FILES.get(args.slug, "hero-%s.json" % args.slug))
    json.dump(
        {"src": "/media/projects/%s/hero.webp" % args.slug, "srcSmall": "/media/projects/%s/hero-1280.webp" % args.slug,
         "w": big.width, "h": big.height, "alt": args.alt or args.slug},
        open(hero_file, "w", encoding="utf-8"), ensure_ascii=False, indent=1,
    )

    print("источник:            %dx%d" % (w0, h0))
    print("баннер %0.1f:1:        %dx%d" % (args.ratio, framed.width, framed.height))
    print("готовый файл:        %dx%d  (увеличение x%.2f)" % (big.width, big.height, big.width / framed.width))
    print("резкость до/после:   %.1f -> %.1f" % (before, after))
    print("вес:                 hero.webp %.0f КБ + hero-1280.webp %.0f КБ"
          % (os.path.getsize(hero_path) / 1024, os.path.getsize(small_path) / 1024))
    print("главный кадр записан в", hero_file)
    return 0


if __name__ == "__main__":
    sys.exit(main())
