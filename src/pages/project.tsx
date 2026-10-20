/**
 * Страница объекта. Пока заполнена для одного объекта — Куйбышевской
 * отопительной котельной (ПАО Т+); остальные объекты ведут на внешние альбомы
 * до появления своих страниц.
 */
import { Link, useParams } from "wouter";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Carousel } from "@/components/Carousel";
import { COMPANY } from "@/content/site";
import { galleryFor, projectBySlug } from "@/content/projects";
import { url } from "@/lib/url";
import NotFound from "./not-found";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectBySlug(slug ?? "");
  if (!project || !project.page) return <NotFound />;

  const photos = galleryFor(project);
  const hero = project.hero;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader solid />

      {/* Заглавное фото с названием объекта */}
      <section className="relative">
        <div className="relative h-[46vh] min-h-[320px] sm:h-[58vh] overflow-hidden">
          {hero ? (
            <img
              src={url(hero.src)}
              alt={hero.alt}
              width={hero.w}
              height={hero.h}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img src={url(project.photo)} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 text-white">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-white/70 mb-3">
                {project.client} · {project.location}
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight max-w-4xl">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="mt-3 text-sm sm:text-base text-white/80 max-w-3xl">{project.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14 sm:space-y-20">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Все объекты
        </Link>

        {/* О проекте + краткие факты */}
        <section className="grid lg:grid-cols-3 gap-10 sm:gap-14 items-start">
          <div className="lg:col-span-2 space-y-5">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">— О проекте</p>
            {project.about?.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <aside className="border border-border divide-y divide-border">
            {project.facts?.map((f) => (
              <div key={f.label} className="px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{f.label}</p>
                <p className="text-sm font-medium leading-snug">{f.value}</p>
              </div>
            ))}
          </aside>
        </section>

        {/* Работы */}
        {project.workGroups && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-primary text-sm uppercase tracking-widest font-medium">— Работы</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Что сделали на объекте</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
              {project.workGroups.map((g) => (
                <div key={g.title}>
                  <h3 className="text-base font-bold mb-4">{g.title}</h3>
                  <ul className="space-y-3">
                    {g.items.map((it, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Технологии */}
        {project.tech && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-primary text-sm uppercase tracking-widest font-medium">— Технологии</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Системы и решения</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {project.tech.map((t) => (
                <div key={t.name} className="bg-background p-6">
                  <p className="font-bold mb-2">{t.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Уникальность */}
        {project.unique && (
          <section className="border-l-2 border-primary pl-6 sm:pl-8">
            <p className="text-primary text-sm uppercase tracking-widest font-medium mb-4">— Уникальность</p>
            <p className="text-lg sm:text-xl leading-relaxed">{project.unique}</p>
          </section>
        )}

        {/* Фотографии */}
        {photos.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-3">
                <p className="text-primary text-sm uppercase tracking-widest font-medium">— Фотографии</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Объект в работе <span className="text-muted-foreground font-normal">({photos.length})</span>
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Все кадры в одном формате · нажмите на фото для полноэкранного просмотра
              </p>
            </div>
            <Carousel photos={photos} title={project.title} />
          </section>
        )}

        {/* Заявка */}
        <section className="border border-border p-6 sm:p-10 grid lg:grid-cols-2 gap-6 items-center bg-card/40">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Похожий объект?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Расскажите о задаче: посчитаем объём работ, сроки и стоимость. Работаем по договору, полный цикл — от
              проекта до пусконаладки.
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
              href="/#contacts"
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-3 text-sm font-medium"
            >
              Оставить заявку
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
