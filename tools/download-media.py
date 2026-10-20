#!/usr/bin/env python3
# Скачивание медиа с Dropbox на наш диск.
#   файлы  -> параметр raw=1 (dl=1 отдаёт HTML-страницу)
#   папки  -> редирект на zip_download_get, следуем вручную с cookie-банкой
import os, sys, http.cookiejar, urllib.request, urllib.error, urllib.parse

RAW = r"C:\Users\ValeriyT14\Documents\ites-home-media\raw"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

FOLDERS = [
    ("album-spa-kompleks.zip", "https://www.dropbox.com/scl/fo/dzq6o61x9uynero3vmqxm/AOAVRlg4lIbYhkIp9bza8HM?rlkey=rhxrd5kj68pl5xb6xc6p25o8p&st=65f1kfgr&dl=1"),
    ("album-kireevsk.zip", "https://www.dropbox.com/scl/fo/b5iq0yxpnssxk6fo3s56v/ANHK23gD_mD4Yu7LQblSPAE?rlkey=qq8ym9xs1un8ykh83wsbsud2z&st=0j8etckn&dl=1"),
    ("album-legend-rakira.zip", "https://www.dropbox.com/scl/fo/9juefvhij2hx1bs3bnm80/AAYYrvpJamwostl_HhJVZ5I?rlkey=u6obj4d4t3xx9w2paevmuqypd&st=ue27dccj&dl=1"),
    ("album-monolit.zip", "https://www.dropbox.com/scl/fo/urqdtl9px6s4onsbj4h3i/AF8_qCS5Nn1NAX2sOmAHjLs?rlkey=xhztp5lim07i31le8cwllls7b&st=95bq69mo&dl=1"),
]

FILES = [
    ("doc-pao-tplus.pdf", "https://www.dropbox.com/scl/fi/uklcco331aougf0nimt0m/.pdf?rlkey=j7m2y46rl7yxlw0qnha53b2tw&st=0se7m4c5&dl=0"),
    ("doc-1.pdf", "https://www.dropbox.com/scl/fi/tfu0eg9ab57rcey9emw3q/.pdf?rlkey=7rxuf4n40vwfcs9umynsy2x76&st=rg6cmjg5&dl=0"),
    ("doc-2.pdf", "https://www.dropbox.com/scl/fi/kmmytxl960guvt7hbsvk4/.pdf?rlkey=ntrj4jznfauz3016kequav9lb&st=crwtm725&dl=0"),
    ("doc-3.pdf", "https://www.dropbox.com/scl/fi/fwiw54rk5skx20xbetv56/.pdf?rlkey=ihlsj1j2jzz72mkuuuyer6ntt&st=p5vi65az&dl=0"),
    ("doc-presentation-2.1.pdf", "https://www.dropbox.com/scl/fi/nlockma8n9yoyuuq8ya5u/_-_2.1.pdf?rlkey=z0pylude614u1dzq47dvkpt5y&st=t5kfrp0g&dl=0"),
    ("doc-presentation-2.pdf", "https://www.dropbox.com/scl/fi/5dukrccyai974kcca7aaj/_-_2.pdf?rlkey=k03pt5xzvafny0yaraahvlldz&st=d6u2k3c1&dl=0"),
    ("doc-4.pdf", "https://www.dropbox.com/scl/fi/0ipm8d6c9b5hmv8oezisq/_3.pdf?rlkey=6tqeztgk6ykdeux9u4waa6zlg&st=22duokci&dl=0"),
]

MAGIC = {b"%PDF": "PDF", b"PK\x03\x04": "ZIP"}


def kind_of(path):
    with open(path, "rb") as fh:
        head = fh.read(8)
    for sig, name in MAGIC.items():
        if head.startswith(sig):
            return name
    return "HTML/прочее"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **kw):
        return None


def opener():
    jar = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def fetch(op, url, referer=None, limit=4):
    """Возвращает (итоговый_ответ, url) следуя редиректам вручную."""
    for _ in range(limit):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*",
                                                   **({"Referer": referer} if referer else {})})
        try:
            return op.open(req, timeout=120), url
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308):
                loc = e.headers.get("Location")
                if not loc:
                    raise
                url = urllib.parse.urljoin(url, loc)
                referer = url
                continue
            raise
    raise RuntimeError("слишком много редиректов")


def download(name, url, raw_param=False):
    path = os.path.join(RAW, name)
    if os.path.exists(path) and kind_of(path) in ("PDF", "ZIP"):
        print("  уже есть   %-28s %8.1f КБ  %s" % (name, os.path.getsize(path) / 1024, kind_of(path)))
        return True
    if raw_param:
        url = url.replace("dl=0", "raw=1").replace("dl=1", "raw=1")
    try:
        op = opener()
        resp, final = fetch(op, url)
        data = resp.read()
        with open(path, "wb") as fh:
            fh.write(data)
        k = kind_of(path)
        flag = "OK  " if k in ("PDF", "ZIP") else "ПЛОХО"
        print("  %s %-28s %8.1f КБ  %-9s %s" % (flag, name, len(data) / 1024, k,
                                                resp.headers.get("Content-Type", "?").split(";")[0]))
        return k in ("PDF", "ZIP")
    except Exception as e:
        print("  ОШИБКА %-28s %s: %s" % (name, type(e).__name__, str(e)[:70]))
        return False


os.makedirs(RAW, exist_ok=True)
print("=== PDF-кейсы (параметр raw=1) ===")
ok_pdf = sum(download(n, u, raw_param=True) for n, u in FILES)
print("\n=== фотоальбомы (zip через редирект) ===")
ok_zip = sum(download(n, u) for n, u in FOLDERS)
print("\nитог: PDF %d/%d, альбомы %d/%d" % (ok_pdf, len(FILES), ok_zip, len(FOLDERS)))
