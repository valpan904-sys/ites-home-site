#!/usr/bin/env python3
"""
Собирает фотогалерею страницы объекта: приводит кадры к одному формату 4:3,
убирает белые поля по краям, делает большой кадр для полноэкранного просмотра
и превью для полосы фотографий.

Запуск:
    python tools/build-project-gallery.py <папка с оригиналами> <slug> [--hero ИМЯ] [--dry-run]

Например:
    python tools/build-project-gallery.py "D:/iTES/Котельная оригиналы" kotelnaya-tplus

Что делает с каждым кадром:
  1) учитывает поворот из EXIF, переводит в RGB;
  2) срезает белые поля по краям (порог 242 и выше, настраивается --white);
  3) обрезает по центру до 4:3;
  4) пишет WebP: большой (1200 px) + превью (480 px).
Кадры, у которых при обрезке теряется больше --max-loss процента площади,
пропускаются и попадают в отчёт: их лучше проверить глазами.
"""
import argparse
import glob
import json
import os
import sys

from PIL import Image, ImageFilter, ImageOps

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff")
# файл с главным кадром для страницы (projects.ts читает его по имени)
HERO_FILES = {"kotelnaya-tplus": "hero-kotelnaya.json"}

RATIO = 4 / 3
LONG_W = 1200
THUMB_W = 480
Q_BIG, Q_THUMB = 82, 75
RESAMPLE = getattr(getattr(Image, "Resampling", Image), "LANCZOS")


def trim_uniform_border(im, white=242, tol=9):
    """Срезает поля по краям: ряды и столбцы, где почти все пиксели белые."""
    gray = im.convert("L")
    w, h = gray.size
    px = gray.load()

    def row_white(y):
        # допускаем несколько небелых пикселей на строку – на случай мусора
        limit = max(1, int(w * 0.004))
        bad = 0
        for x in range(0, w, 2):
            if px[x, y] < white - tol:
                bad += 1
                if bad > limit:
                    return False
        return True

    def col_white(x):
        limit = max(1, int(h * 0.004))
        bad = 0
        for y in range(0, h, 2):
            if px[x, y] < white - tol:
                bad += 1
                if bad > limit:
                    return False
        return True

    top = 0
    cap_y, cap_x = int(h * 0.12), int(w * 0.12)          # не срезаем больше 12% с каждой стороны
    while top < cap_y and row_white(top):
        top += 1
    bottom = h - 1
    while bottom > h - 1 - cap_y and bottom > top + 2 and row_white(bottom):
        bottom -= 1
    left = 0
    while left < cap_x and col_white(left):
        left += 1
    right = w - 1
    while right > w - 1 - cap_x and right > left + 2 and col_white(right):
        right -= 1
    if (top, left, bottom, right) == (0, 0, h - 1, w - 1):
        return im, 0.0
    box = (left, top, right + 1, bottom + 1)
    trimmed = im.crop(box)
    cut = 1 - (trimmed.width * trimmed.height) / (w * h)
    return trimmed, cut


def crop_to_ratio(im, ratio=RATIO):
    """Обрезка по центру до нужной пропорции."""
    w, h = im.size
    if abs(w / h - ratio) < 0.005:
        return im
    if w / h > ratio:
        new_w = int(h * ratio)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = int(w / ratio)
    top = (h - new_h) // 2
    return im.crop((0, top, w, top + new_h))


def save_webp(im, path, width, quality, upscale_to=None):
    """Пишет WebP нужной ширины. Если кадр меньше нужного, увеличивает его
    (не более чем в 1.8 раза) с аккуратным повышением резкости."""
    if im.width > width:
        k = width / im.width
        im = im.resize((width, max(1, round(im.height * k))), RESAMPLE)
    elif upscale_to and im.width < upscale_to:
        k = min(upscale_to / im.width, 1.8)
        if k > 1.05:
            im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), RESAMPLE)
            im = im.filter(ImageFilter.UnsharpMask(radius=1.8, percent=90, threshold=4))
    im.save(path, "WEBP", quality=quality, method=6)
    return im.size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", help="папка с оригиналами")
    ap.add_argument("slug", help="адрес страницы объекта, например kotelnaya-tplus")
    ap.add_argument("--hero", help="имя файла, который станет главным кадром")
    ap.add_argument("--alt", default="", help="подпись для поисковиков")
    ap.add_argument("--skip", action="append", default=[], help="часть имени файла, который не берём (можно несколько раз)")
    ap.add_argument("--trim", action="store_true", help="срезать белые поля по краям (по умолчанию выключено)")
    ap.add_argument("--white", type=int, default=242, help="порог белого для обрезки полей")
    ap.add_argument("--max-loss", type=int, default=30, help="сколько процентов площади допустимо потерять")
    ap.add_argument("--dry-run", action="store_true", help="только показать, что получится")
    args = ap.parse_args()

    if not os.path.isdir(args.src):
        print("нет папки с оригиналами:", args.src, file=sys.stderr)
        return 1

    skip = [s.lower() for s in args.skip]
    files = sorted(
        p for p in glob.glob(os.path.join(args.src, "*"))
        if os.path.isfile(p) and os.path.splitext(p)[1].lower() in EXTS
        and not any(s in os.path.basename(p).lower() for s in skip)
    )
    if not files:
        print("в папке нет изображений:", args.src, file=sys.stderr)
        return 1
    print("исходных файлов: %d" % len(files))

    out = os.path.join(PROJ, "public", "media", "projects", args.slug)
    if not args.dry_run:
        os.makedirs(out, exist_ok=True)

    alt_base = args.alt or args.slug
    photos: list[dict] = []
    report, skipped = [], []

    # подписи и порядок кадров из презентации заказчика (пересборка их не теряет)
    cap_file = os.path.join(PROJ, "src", "content", "photo-captions.json")
    captions: dict = {}
    order: list = []
    if os.path.exists(cap_file):
        data = json.load(open(cap_file, encoding="utf-8")).get(args.slug, {})
        if "captions" in data or "order" in data:
            captions = data.get("captions", {})
            order = data.get("order", [])
        else:                              # старый формат: просто словарь подписей
            captions = data

    if order:
        known = [f for f in order if os.path.join(args.src, f) in files]
        rest = [f for f in files if os.path.basename(f) not in known]
        files = [os.path.join(args.src, f) for f in known] + rest
        print("порядок кадров задан вручную: %d из %d" % (len(known), len(files)))

    n = 0

    for path in files:
        name = os.path.basename(path)
        try:
            im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        except Exception as e:
            skipped.append((name, "не открылся: %s" % str(e)[:40]))
            continue

        w0, h0 = im.size
        # поля срезаем только по явной просьбе: у зимних кадров белое небо
        # неотличимо от белой рамки, и автоматика съедает верх фотографии
        im, cut_border = trim_uniform_border(im, white=args.white) if args.trim else (im, 0.0)
        loss = 1 - (im.width * im.height) / (w0 * h0)
        framed = crop_to_ratio(im)
        loss = 1 - (framed.width * framed.height) / (w0 * h0)
        fit = "cover"
        if loss * 100 > args.max_loss:
            # обрезать нельзя – оставляем кадр целиком и показываем в рамке на фоне темы
            framed = im
            fit = "contain"
            note = "кадр не 4:3 – показываем целиком на фоне темы"
            report.append("  %02d  %-34s %dx%d  %s" % (n + 1, name[:34], framed.width, framed.height, note))
        else:
            report.append("  %02d  %-34s %dx%d -> %dx%d  поля %d%%" % (
                n + 1, name[:34], w0, h0, framed.width, framed.height, round(cut_border * 100)))

        n += 1
        big, thumb = "%02d.webp" % n, "%02d-t.webp" % n
        if not args.dry_run:
            size = save_webp(framed, os.path.join(out, big), LONG_W, Q_BIG, upscale_to=LONG_W)
            save_webp(framed, os.path.join(out, thumb), THUMB_W, Q_THUMB, upscale_to=THUMB_W)
        else:
            size = framed.size

        photo = {
            "src": "/media/projects/%s/%s" % (args.slug, big),
            "thumb": "/media/projects/%s/%s" % (args.slug, thumb),
            "w": size[0], "h": size[1],
            "alt": "%s, фото %d" % (alt_base, n),
        }
        cap = captions.get(name, "")
        if cap:
            photo["caption"] = cap
            photo["alt"] = "%s, %s" % (cap, alt_base)
        if fit != "cover":
            photo["fit"] = fit
        photos.append(photo)

    print("\n".join(report))
    if skipped:
        print("\nпропущены (проверить глазами):")
        for name, why in skipped:
            print("  %-34s %s" % (name[:34], why))

    print("\nкадров в галерее: %d из %d" % (len(photos), len(files)))
    if args.dry_run:
        print("это только предпросмотр, файлы не записаны")
        return 0

    manifest = os.path.join(PROJ, "src", "content", "galleries.json")
    data = json.load(open(manifest, encoding="utf-8")) if os.path.exists(manifest) else {}
    data[args.slug] = photos
    json.dump(data, open(manifest, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    # главный кадр страницы делает отдельный инструмент tools/upscale-hero.py:
    # он готовит широкий баннер из лучшего исходника и увеличивает разрешение,
    # а этот сборщик обрезает кадры до 4:3 и писал бы hero из первого фото
    total = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out))
    print("манифест обновлён (ключ %s), вес папки: %.1f МБ" % (args.slug, total / 1048576))
    return 0


if __name__ == "__main__":
    sys.exit(main())
