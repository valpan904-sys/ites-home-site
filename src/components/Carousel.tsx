/**
 * Карусель фотографий объекта: единый формат кадра 4:3, листание стрелками,
 * превью-полоса, просмотр во весь экран (клавиши, свайпы).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { url } from "@/lib/url";
import type { GalleryPhoto } from "@/content/projects";

export function Carousel({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const startX = useRef<number | null>(null);
  const total = photos.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total]
  );

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [full, go]);

  if (!total) return null;

  const swipeStart = (x: number) => (startX.current = x);
  const swipeEnd = (x: number) => {
    if (startX.current === null) return;
    const dx = startX.current - x;
    if (Math.abs(dx) > 45) go(dx > 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <div className="space-y-3">
      {/* Основной кадр — всегда 4:3 */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted border border-border group"
        onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
        onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((p, i) => (
            <button
              key={p.src}
              onClick={() => setFull(true)}
              className="relative h-full w-full shrink-0 cursor-zoom-in"
              aria-label={`Открыть фото ${i + 1} во весь экран`}
            >
              <img
                src={url(p.src)}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Стрелки */}
        <button
          onClick={() => go(-1)}
          aria-label="Предыдущее фото"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-background/80 hover:bg-background border border-border transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Следующее фото"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-background/80 hover:bg-background border border-border transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Счётчик и подсказка */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-background/85 border border-border text-xs tracking-widest">
          {index + 1} / {total}
        </div>
        <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background/85 border border-border text-xs text-muted-foreground">
          <Maximize2 className="w-3.5 h-3.5" />
          Нажмите на фото — просмотр во весь экран
        </div>
      </div>

      {/* Полоса превью */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {photos.map((p, i) => (
          <button
            key={p.thumb}
            onClick={() => setIndex(i)}
            aria-label={`Фото ${i + 1}`}
            className={[
              "relative w-24 sm:w-28 shrink-0 aspect-[4/3] overflow-hidden border transition-colors",
              i === index ? "border-primary" : "border-border/60 hover:border-primary/60",
            ].join(" ")}
          >
            <img src={url(p.thumb)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Просмотр во весь экран */}
      {full && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — просмотр фотографий`}
          onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
          onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
          onClick={() => setFull(false)}
        >
          <button
            onClick={() => setFull(false)}
            aria-label="Закрыть"
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Предыдущее фото"
            className="absolute left-2 sm:left-6 text-white/70 hover:text-white p-2 z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <figure className="max-w-[94vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={url(photos[index].src)}
              alt={photos[index].alt}
              className="max-w-[94vw] max-h-[84vh] object-contain"
            />
            <figcaption className="mt-3 text-xs text-white/60">
              {title} — {index + 1} / {total}
            </figcaption>
          </figure>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Следующее фото"
            className="absolute right-2 sm:right-6 text-white/70 hover:text-white p-2 z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
