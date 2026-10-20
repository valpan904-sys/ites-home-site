#!/usr/bin/env python3
"""
Готовит медиа для сайта: фотоальбомы объектов -> WebP (галерея + превью),
PDF-кейсы и презентации -> public/documents/.

Запуск:  python tools/build-media.py [папка_с_сырыми_файлами]
Сырые файлы качаются скриптом docs/download-media.py с Dropbox.
"""
import io
import json
import os
import shutil
import subprocess
import sys
import zipfile

from PIL import Image, ImageOps

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = PROJ
PUB = os.path.join(SITE, "public")
GAL_DIR = os.path.join(PUB, "media", "projects")
DOC_DIR = os.path.join(PUB, "documents")
CONTENT = os.path.join(SITE, "src", "content")
RAW = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\ValeriyT14\Documents\ites-home-media\raw"

# slug объекта -> zip с фотографиями
ALBUMS = {
    "spa-kompleks": "album-spa-kompleks.zip",
    "kireevsk": "album-kireevsk.zip",
    "legend-rakira": "album-legend-rakira.zip",
    "monolit": "album-monolit.zip",
}
# локальные PDF: имя_файла_в_исходниках -> (имя_на_сайте, заголовок)
DOCS = {
    "doc-pao-tplus.pdf": ("case-kotelnaya-t-plus.pdf", "Куйбышевская отопительная котельная – кейс"),
    "doc-3.pdf": ("case-spg-sabetta.pdf", "Завод по производству СПГ – кейс"),
    "doc-1.pdf": ("case-kinel.pdf", "Канализационно-очистные сооружения, Кинель – кейс"),
    "doc-2.pdf": ("case-bavly.pdf", "ЛПДС «Бавлы» – кейс"),
    "doc-presentation-2.1.pdf": ("presentation-company.pdf", "Презентация компании ИТЭС-Хоум"),
    "doc-4.pdf": ("project-management.pdf", "Как мы управляем проектами"),
    "doc-presentation-2.pdf": ("presentation-monolit.pdf", "Монолитные работы – презентация"),
}
MAX_PHOTO = 1600     # длинная сторона больших фото, px
MAX_THUMB = 480      # превью для сетки
Q_PHOTO, Q_THUMB = 80, 75
ALT = {"spa-kompleks": "Строительство СПА-комплекса, Самара",
       "kireevsk": "Реконструкция очистных сооружений, Киреевск",
       "legend-rakira": "Отделка ЖК «Легенда» и ЖК «Ракита», Самара",
       "monolit": "Монолитные работы"}


def kb(n):
    return "%d КБ" % (n / 1024)


def convert(img_bytes, long_side, quality, out_path):
    im = Image.open(io.BytesIO(img_bytes))
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    w, h = im.size
    if max(w, h) > long_side:
        k = long_side / max(w, h)
        resample = getattr(getattr(Image, "Resampling", Image), "LANCZOS")
        im = im.resize((max(1, round(w * k)), max(1, round(h * k))), resample)
    im.save(out_path, "WEBP", quality=quality, method=6)
    return im.size


def build_albums():
    galleries, report = {}, []
    for slug, zip_name in ALBUMS.items():
        zpath = os.path.join(RAW, zip_name)
        if not os.path.exists(zpath):
            report.append("  нет архива %s – пропуск" % zip_name)
            continue
        out_dir = os.path.join(GAL_DIR, slug)
        os.makedirs(out_dir, exist_ok=True)
        items, n = [], 0
        with zipfile.ZipFile(zpath) as zf:
            names = sorted(i.filename for i in zf.infolist()
                           if not i.is_dir() and i.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
            for name in names:
                data = zf.read(name)
                try:
                    Image.open(io.BytesIO(data)).verify()
                except Exception:
                    continue
                n += 1
                stem = "%02d" % n
                big, thumb = stem + ".webp", stem + "-t.webp"
                w, h = convert(data, MAX_PHOTO, Q_PHOTO, os.path.join(out_dir, big))
                convert(data, MAX_THUMB, Q_THUMB, os.path.join(out_dir, thumb))
                items.append({"src": "/media/projects/%s/%s" % (slug, big),
                              "thumb": "/media/projects/%s/%s" % (slug, thumb),
                              "w": w, "h": h,
                              "alt": "%s – фото %d" % (ALT.get(slug, slug), n)})
        galleries[slug] = items
        size = sum(os.path.getsize(os.path.join(out_dir, f)) for f in os.listdir(out_dir))
        report.append("  %-16s фотографий: %-3d вес: %s" % (slug, len(items), kb(size)))
    return galleries, report


def build_docs():
    os.makedirs(DOC_DIR, exist_ok=True)
    docs, report = {}, []
    for src_name, (out_name, title) in DOCS.items():
        sp = os.path.join(RAW, src_name)
        if not os.path.exists(sp):
            report.append("  нет файла %s – пропуск" % src_name)
            continue
        shutil.copy2(sp, os.path.join(DOC_DIR, out_name))
        docs[src_name] = out_name
        report.append("  %-30s -> documents/%s (%s)" % (src_name, out_name, kb(os.path.getsize(sp))))
    return docs, report


def build_video():
    """Видео из альбома СПА-комплекса -> mp4 для веба."""
    zpath = os.path.join(RAW, "album-spa-kompleks.zip")
    if not os.path.exists(zpath):
        return None, "  видео: архива нет"
    out_dir = os.path.join(GAL_DIR, "spa-kompleks")
    with zipfile.ZipFile(zpath) as zf:
        movs = [i for i in zf.infolist() if i.filename.lower().endswith((".mov", ".mp4"))]
        if not movs:
            return None, "  видео: в архиве нет"
        os.makedirs(out_dir, exist_ok=True)
        src = os.path.join(out_dir, "_src.mov")
        with open(src, "wb") as fh:
            fh.write(zf.read(movs[0]))
    dst = os.path.join(out_dir, "video.mp4")
    poster = os.path.join(out_dir, "video-poster.webp")
    try:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src,
                        "-vf", "scale=-2:720", "-c:v", "libx264", "-crf", "26",
                        "-preset", "medium", "-an", "-movflags", "+faststart", dst], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", dst,
                        "-frames:v", "1", "-vf", "scale=-2:480", poster], check=True)
        size, psize = os.path.getsize(dst), os.path.getsize(poster)
        os.remove(src)
        return {"src": "/media/projects/spa-kompleks/video.mp4",
                "poster": "/media/projects/spa-kompleks/video-poster.webp"}, \
               "  видео: %s -> mp4 %s + постер %s" % (movs[0].filename, kb(size), kb(psize))
    except Exception as e:
        if os.path.exists(src):
            os.remove(src)
        return None, "  видео: не сконвертировалось (%s)" % str(e)[:60]


if __name__ == "__main__":
    print("=== фотоальбомы объектов ===")
    galleries, rep = build_albums()
    print("\n".join(rep))
    print("\n=== документы ===")
    docs, rep2 = build_docs()
    print("\n".join(rep2))
    print("\n=== видео ===")
    video, rep3 = build_video()
    print(rep3)

    os.makedirs(CONTENT, exist_ok=True)
    with open(os.path.join(CONTENT, "galleries.json"), "w", encoding="utf-8") as fh:
        json.dump(galleries, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(CONTENT, "documents-map.json"), "w", encoding="utf-8") as fh:
        json.dump({"maps": docs, "video": video}, fh, ensure_ascii=False, indent=1)

    total = sum(os.path.getsize(os.path.join(dp, f))
                for dp, _, fs in os.walk(os.path.join(PUB, "media")) for f in fs)
    print("\nвсего медиа в сборке: %s" % kb(total))
    print("фото в галереях: %d" % sum(len(v) for v in galleries.values()))
