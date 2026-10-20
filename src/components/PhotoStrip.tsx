/**
 * Полоса фотографий объекта: кадры в одном формате идут в ряд на всю ширину
 * страницы (3–4 фото в видимой области), пролистываются стрелками.
 * На самих кадрах подписей нет – чтобы не добавлять шума.
 * Клик по фото открывает просмотр во весь экран: стрелки по бокам, подпись
 * под кадром, фон – по теме сайта.
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
    if (Math.abs(dx) > 45) step(dx > 0 ? 1 : -1);
    startX.current = null;
  };

  const pill =
    "w-10 h-10 border border-border hover:border-primary flex items-center justify-center transition-colors";

  return (
    <div className="space-y-3">
      {/* Стрелки пролистывания полосы */}
      <div className="flex justify-end gap-2">
        <button onClick={() => nudge(-1)} aria-label="Предыдущие фото" className={pill}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => nudge(1)} aria-label="Следующие фото" className={pill}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Кадры одной высоты идут в ряд: ширина у каждого своя по пропорции кадра,
          поэтому рябь от обрезки 4:3 пропадает. Подписей на кадрах нет. */}
      <div
        ref={scroller}
        className="h-[190px] sm:h-[230px] lg:h-[260px] overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
        onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
      >
        <div className="flex h-full gap-3">
          {photos.map((p, i) => (
            <button
              key={p.src}
              onClick={() => setOpen(i)}
              aria-label={`Открыть фото ${i + 1} во весь экран`}
              className="snap-start shrink-0 h-full aspect-[4/3] overflow-hidden border border-border bg-muted relative group/photo cursor-zoom-in"
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
      </div>

      {/* Просмотр во весь экран: стрелки по бокам, подпись под кадром */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} – просмотр фотографий`}
          onClick={() => setOpen(null)}
          onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
          onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
        >
          <button
            onClick={() => setOpen(null)}
            aria-label="Закрыть"
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-2 z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Предыдущее фото"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 border border-border hover:border-primary bg-background/70 flex items-center justify-center transition-colors z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Следующее фото"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 border border-border hover:border-primary bg-background/70 flex items-center justify-center transition-colors z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <figure className="h-full w-full flex flex-col items-center justify-center gap-4 px-6 sm:px-24 py-16">
            <img
              src={url(photos[open].src)}
              alt={photos[open].alt}
              width={photos[open].w}
              height={photos[open].h}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[78vh] object-contain"
            />
            <figcaption className="text-center text-sm">
              {photos[open].caption ?? title}{" "}
              <span className="text-muted-foreground">
                · {open + 1} / {total}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
