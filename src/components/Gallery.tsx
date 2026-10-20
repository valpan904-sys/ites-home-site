/**
 * Галерея фотографий объекта: сетка превью + просмотр во весь экран.
 * Все изображения локальные (WebP), размеры известны — вёрстка не «прыгает».
 */
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/content/projects";

export function Gallery({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
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
  }, [index, close, step]);

  if (!photos.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setIndex(i)}
            className="group relative overflow-hidden border border-border/60 hover:border-primary transition-colors focus:outline-none focus:border-primary"
            aria-label={`Открыть фото ${i + 1} из ${photos.length}`}
          >
            <img
              src={p.thumb}
              alt={p.alt}
              width={p.w}
              height={p.h}
              loading="lazy"
              decoding="async"
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — просмотр фотографий`}
          onClick={close}
        >
          <button onClick={close} className="absolute top-4 right-4 text-white/70 hover:text-white p-2" aria-label="Закрыть">
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-2 sm:left-6 text-white/70 hover:text-white p-2"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <figure className="max-w-[92vw] max-h-[88vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[index].src}
              alt={photos[index].alt}
              width={photos[index].w}
              height={photos[index].h}
              className="max-w-[92vw] max-h-[84vh] object-contain"
            />
            <figcaption className="mt-3 text-xs text-white/60">
              {title} — {index + 1} / {photos.length}
            </figcaption>
          </figure>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-2 sm:right-6 text-white/70 hover:text-white p-2"
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-9 h-9" />
          </button>
        </div>
      )}
    </>
  );
}
