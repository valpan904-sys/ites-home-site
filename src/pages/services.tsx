/** Список услуг компании */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHeading } from "@/components/Breadcrumbs";
import { SERVICES } from "@/content/services";
import { COMPANY } from "@/content/site";

export default function Services() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-24 space-y-10 sm:space-y-14 w-full flex-1">
        <PageHeading
          eyebrow="— Услуги"
          title="Строительно-монтажные работы полного цикла"
          lead={`${COMPANY.name} выполняет работы под ключ — от подготовки площадки до сдачи объекта. Ниже — направления, по которым у компании есть реализованные объекты.`}
          crumbs={[{ name: "Главная", href: "/" }, { name: "Услуги" }]}
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}/`}
              className="group border border-border hover:border-primary transition-colors flex flex-col sm:flex-row overflow-hidden"
            >
              {s.photo && (
                <img
                  src={s.photo}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full sm:w-44 h-40 sm:h-auto object-cover shrink-0"
                />
              )}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h2 className="text-lg font-bold leading-snug">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{s.desc}</p>
                {s.examplesHint && <p className="text-xs text-muted-foreground/80 mt-auto pt-2">Объекты: {s.examplesHint}</p>}
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium pt-2">
                  Подробнее об услуге
                  <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
