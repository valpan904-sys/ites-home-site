/**
 * Страница объекта. Пока заполнена для одного объекта — Куйбышевской
 * отопительной котельной (ПАО Т+); остальные объекты ведут на внешние альбомы
 * до появления своих страниц.
 */
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, Check, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PhotoStrip } from "@/components/PhotoStrip";
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
    <div className="min-h-screen bg-background text-foreground w-full font-sans selection:bg-primary/30">
      <SiteHeader solid />

      {/* Заглавное фото и название объекта */}
      <section className="relative">
        <div className="relative h-[38vh] min-h-[260px] sm:h-[46vh] sm:min-h-[320px] max-h-[520px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-9 text-white">
              <p className="text-xs uppercase tracking-widest text-white/70 mb-2">
                {project.client} · {project.location}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight max-w-3xl">
                {project.title}
              </h1>
              {project.subtitle && <p className="mt-2 text-sm text-white/80 max-w-2xl">{project.subtitle}</p>}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14 sm:space-y-24">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Все объекты
        </Link>

        {/* О проекте и краткие данные */}
        <section className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">— О проекте</p>
            {project.about?.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <aside className="border border-border divide-y divide-border">
            {project.facts?.map((f) => (
              <div key={f.label} className="px-4 py-3.5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{f.label}</p>
                <p className="text-sm font-medium leading-snug">{f.value}</p>
              </div>
            ))}
          </aside>
        </section>

        {/* Работы и технологии — одна сетка 3×2 */}
        {project.scope && (
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary text-sm uppercase tracking-widest font-medium">— Работы и технологии</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Что сделали и какие системы применили</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {project.scope.map((s) => (
                <div key={s.title} className="bg-background p-5 sm:p-6 flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide">{s.title}</h3>
                  <ul className="space-y-2.5">
                    {s.works.map((w) => (
                      <li key={w} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 mt-auto">
                    {s.tech}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Уникальность проекта */}
        {project.unique && (
          <section className="border-l-2 border-primary pl-5 sm:pl-6">
            <p className="text-primary text-sm uppercase tracking-widest font-medium mb-3">— Уникальность проекта</p>
            <p className="text-base sm:text-lg leading-relaxed">{project.unique}</p>
          </section>
        )}

        {/* Фотографии — полосой на всю ширину, кадры в одном формате */}
        {photos.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-4">
              <p className="text-primary text-sm uppercase tracking-widest font-medium">— Фотографии</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Объект в работе <span className="text-muted-foreground font-normal">({photos.length})</span>
              </h2>
            </div>
            <PhotoStrip photos={photos} title={project.title} />
          </section>
        )}

        {/* Заявка */}
        <section className="border border-border p-5 sm:p-8 grid lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Похожий объект?</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Расскажите о задаче: посчитаем объём работ, сроки и стоимость. Полный цикл — от закупки и поставки
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
              href="/#contacts"
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
