/**
 * Страница объекта. Пока заполнена для одного объекта – Куйбышевской
 * отопительной котельной (ПАО Т+); остальные объекты ведут на внешние альбомы
 * до появления своих страниц.
 */
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { PhotoStrip } from "@/components/PhotoStrip";
import { COMPANY } from "@/content/site";
import { galleryFor, projectBySlug } from "@/content/projects";
import { url } from "@/lib/url";
import NotFound from "./not-found";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();

  // страница объекта всегда открывается сверху: иначе переход из карточки
  // на главной оставляет браузер на прежней прокрутке
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  const project = projectBySlug(slug ?? "");
  if (!project || !project.page) return <NotFound />;

  const photos = galleryFor(project);
  const hero = project.hero;

  return (
    <div className="min-h-screen bg-background text-foreground w-full font-sans selection:bg-primary/30">
      <Navbar alwaysVisible />

      {/* Заглавное фото и название объекта */}
      <section className="relative">
        <div className="relative h-[52vh] min-h-[340px] sm:h-[64vh] sm:min-h-[460px] max-h-[780px] overflow-hidden">
          {hero ? (
            <img
              src={url(hero.src)}
              srcSet={`${url(hero.srcSmall ?? hero.src)} 1280w, ${url(hero.src)} ${hero.w}w`}
              sizes="100vw"
              alt={hero.alt}
              width={hero.w}
              height={hero.h}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img src={url(project.photo)} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
          )}

          {/* затемнение под текстом: слева, где стоит заголовок */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

          {/* нижняя треть растворяется в фоне страницы – фоновый цвет берётся из темы */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/80 to-transparent" />

          <div className="absolute inset-x-0 bottom-1/3 pb-4 sm:pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-white">
              <p className="text-xs uppercase tracking-widest text-white/80 mb-2 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
                {project.client} · {project.location}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight max-w-3xl [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="mt-2 text-sm text-white/85 max-w-2xl [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
                  {project.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14 sm:space-y-24">
        <Link
          href={url("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>

        {/* О проекте и краткие данные – блоки одной высоты */}
        <section className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">– О проекте</p>
            {project.about?.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <aside className="border border-border divide-y divide-border flex flex-col justify-between">
            {project.facts?.map((f) => (
              <div key={f.label} className="px-4 py-3.5 flex-1 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{f.label}</p>
                {Array.isArray(f.value) ? (
                  <ul className="space-y-1">
                    {f.value.map((v) => (
                      <li key={v} className="text-sm font-medium leading-snug">
                        {v}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-medium leading-snug">{f.value}</p>
                )}
              </div>
            ))}
          </aside>
        </section>

        {/* Работы и технологии – шесть плиток, сплошной текст без списков */}
        {project.scope && (
          <section className="space-y-6">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">– Работы и технологии</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {project.scope.map((s) => (
                <div key={s.title} className="bg-background p-5 sm:p-6 flex flex-col gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Фотографии – полосой на всю ширину, кадры в одном формате */}
        {photos.length > 0 && (
          <section className="space-y-6">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">– Фотографии</p>
            <PhotoStrip photos={photos} title={project.title} />
          </section>
        )}

        {/* Заявка */}
        <section className="border border-border p-5 sm:p-8 grid lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Похожий объект?</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Расскажите о задаче: посчитаем объём работ, сроки и стоимость. Полный цикл – от закупки и поставки
              оборудования до монтажа и пусконаладки.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a
              href={COMPANY.phoneHref}
              className="inline-flex items-center gap-2 border border-border hover:border-primary px-5 py-3 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" /> {COMPANY.phone}
            </a>
            <Link
              href={url("/#contacts")}
              className="inline-flex items-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-3 text-sm font-medium"
            >
              Оставить заявку <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
