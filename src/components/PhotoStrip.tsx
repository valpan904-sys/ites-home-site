/**
 * Полоса фотографий объекта: кадры в одном формате 4:3 идут в ряд на всю ширину
 * страницы (3–4 фото в видимой области), клик по фото открывает просмотр во весь
 * экран с листанием клавишами, стрелками и свайпом.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { url } from "@/lib/url";
import type { GalleryPhoto } from "@/content/projects";

export function PhotoStrip({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const total = photos.length;

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? null : (i + dir + total) % total)),
    [total]
  );

  const nudge = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  if (!total) return null;
  const swipeStart = (x: number) => (startX.current = x);
  const swipeEnd = (x: number) => {
    if (startX.current === null) return;
    const dx = startX.current - x;
    if (Math.abs(dx) > 45) (open === null ? step : step)(dx > 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Все кадры в одном формате · нажмите на фото — просмотр во весь экран
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => nudge(-1)}
            aria-label="Предыдущие фото"
            className="w-10 h-10 border border-border hover:border-primary flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => nudge(1)}
            aria-label="Следующие фото"
            className="w-10 h-10 border border-border hover:border-primary flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Кадры в ряд: 2 на телефоне, 3 на планшете, 4 на большом экране */}
      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
        onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
        onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setOpen(i)}
            aria-label={`Открыть фото ${i + 1} во весь экран`}
            className="snap-start shrink-0 aspect-[4/3] basis-[calc(50%-6px)] sm:basis-[calc(33.333%-8px)] lg:basis-[calc(25%-9px)] overflow-hidden border border-border bg-muted relative group/photo cursor-zoom-in"
          >
            <img
              src={url(p.thumb)}
              alt={p.alt}
              width={p.w}
              height={p.h}
              loading="lazy"
              decoding="async"
              className={[
                "w-full h-full transition-transform duration-700 ease-out group-hover/photo:scale-105",
                p.fit === "contain" ? "object-contain" : "object-cover",
              ].join(" ")}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity">
              <Maximize2 className="w-5 h-5 text-white" />
            </span>
          </button>
        ))}
      </div>

      {/* Просмотр во весь экран — фон подстраивается под тему сайта */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — просмотр фотографий`}
          onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
          onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
          onClick={() => setOpen(null)}
        >
          <button
            onClick={() => setOpen(null)}
            aria-label="Закрыть"
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-2 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Предыдущее фото"
            className="absolute left-3 sm:left-6 w-11 h-11 border border-border hover:border-primary flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <figure
            className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={url(photos[open].src)}
              alt={photos[open].alt}
              width={photos[open].w}
              height={photos[open].h}
              className="max-w-[92vw] max-h-[80vh] object-contain"
            />
            <figcaption className="text-xs text-muted-foreground">
              {title} — {open + 1} / {total}
            </figcaption>
          </figure>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Следующее фото"
            className="absolute right-3 sm:right-6 w-11 h-11 border border-border hover:border-primary flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
