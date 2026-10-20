/** Страница отдельного объекта: состав работ, фотографии, кейс */
import { Link, useParams } from "wouter";
import { ArrowUpRight, Download, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHeading } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { PROJECTS, galleryFor, projectBySlug } from "@/content/projects";
import { serviceBySlug } from "@/content/services";
import { COMPANY } from "@/content/site";
import docmap from "@/content/documents-map.json";
import NotFound from "./not-found";

const video = (docmap as { video?: { src: string; poster: string } | null }).video ?? null;

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectBySlug(slug ?? "");
  if (!project) return <NotFound />;

  const photos = galleryFor(project);
  const others = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-24 space-y-12 sm:space-y-16 w-full flex-1">
        <PageHeading
          eyebrow={`— ${project.client}`}
          title={project.title}
          lead={project.location}
          crumbs={[{ name: "Главная", href: "/" }, { name: "Объекты", href: "/projects/" }, { name: project.title }]}
        />

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div className="relative overflow-hidden border border-border">
            <img
              src={project.photo}
              alt={`${project.title} — ${project.client}, ${project.location}`}
              loading="eager"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Состав работ</p>
              <ul className="space-y-3">
                {project.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="text-primary select-none">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.services.map((s) => {
                const svc = serviceBySlug(s);
                if (!svc) return null;
                return (
                  <Link
                    key={s}
                    href={`/services/${svc.slug}/`}
                    className="inline-flex items-center gap-1.5 border border-border hover:border-primary text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {svc.title}
                  </Link>
                );
              })}
            </div>

            {project.doc && (
              <a
                href={project.doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-2.5 text-sm font-medium group"
              >
                <Download className="w-4 h-4" />
                {project.doc.title}
                <span className="text-xs opacity-70">{project.doc.size}</span>
              </a>
            )}
          </div>
        </div>

        {(photos.length > 0 || (video && project.slug === "spa-kompleks")) && (
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Фотографии объекта{photos.length ? ` — ${photos.length}` : ""}
              </h2>
              <p className="text-xs text-muted-foreground">Нажмите на снимок, чтобы открыть во весь экран</p>
            </div>

            {video && project.slug === "spa-kompleks" && (
              <video
                controls
                preload="none"
                poster={video.poster}
                className="w-full max-w-3xl border border-border"
              >
                <source src={video.src} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            )}

            <Gallery photos={photos} title={project.title} />
          </section>
        )}

        <section className="border border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-card/40">
          <div>
            <p className="font-bold text-foreground mb-1">Обсудить похожий проект</p>
            <p className="text-sm text-muted-foreground">
              {COMPANY.name}, {COMPANY.address}. Телефон: {COMPANY.phone}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={COMPANY.phoneHref}
              className="inline-flex items-center gap-2 border border-border hover:border-primary px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" /> Позвонить
            </a>
            <Link
              href="/contacts/"
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-2.5 text-sm font-medium"
            >
              Оставить заявку
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Другие объекты</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className="group border border-border hover:border-primary transition-colors flex flex-col"
              >
                <img
                  src={p.photo}
                  alt={`${p.title} — ${p.client}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{p.client}</p>
                  <p className="font-medium leading-snug mb-2">{p.title}</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm">
                    Подробнее
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
