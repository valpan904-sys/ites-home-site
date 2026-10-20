/** Список всех объектов компании */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHeading } from "@/components/Breadcrumbs";
import { PROJECTS } from "@/content/projects";
import { COMPANY } from "@/content/site";
import { url } from "@/lib/url";

export default function Projects() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-24 space-y-10 sm:space-y-14 w-full flex-1">
        <PageHeading
          eyebrow="— Объекты"
          title="Реализованные объекты"
          lead="Промышленные и гражданские объекты в Самарской области и за её пределами: монолитные работы, электромонтаж, отделка, реконструкция сооружений. По каждому объекту — состав работ, фотографии и кейс."
          crumbs={[{ name: "Главная", href: "/" }, { name: "Объекты" }]}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={url(`/projects/${p.slug}/`)}
              className="group border border-border hover:border-primary transition-colors flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={url(p.photo)}
                  alt={`${p.title} — ${p.client}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-52 object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.client}</p>
                <h2 className="text-lg font-bold leading-snug">{p.title}</h2>
                <p className="text-sm text-muted-foreground">{p.location}</p>
                <span className="mt-auto pt-3 inline-flex items-center gap-1 text-primary text-sm font-medium">
                  Состав работ и фото
                  <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="border border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40">
          <div>
            <p className="font-bold text-foreground mb-1">Похожий объект на подходе?</p>
            <p className="text-sm text-muted-foreground">
              Расскажите о задаче — посчитаем объём работ и сроки. {COMPANY.phone}
            </p>
          </div>
          <Link
            href={url("/contacts/")}
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-2.5 text-sm font-medium shrink-0"
          >
            Оставить заявку
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
