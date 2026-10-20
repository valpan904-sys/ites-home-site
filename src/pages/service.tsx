/** Страница отдельной услуги: что входит, объекты, заявка */
import { Link, useParams } from "wouter";
import { Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHeading } from "@/components/Breadcrumbs";
import { serviceBySlug } from "@/content/services";
import { projectsForService } from "@/content/projects";
import { COMPANY } from "@/content/site";
import NotFound from "./not-found";
import { url } from "@/lib/url";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceBySlug(slug ?? "");
  if (!service) return <NotFound />;

  const examples = projectsForService(service.slug);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-24 space-y-12 sm:space-y-16 w-full flex-1">
        <PageHeading
          eyebrow="— Услуга"
          title={service.title}
          lead={service.desc.replace(/\n/g, " ")}
          crumbs={[{ name: "Главная", href: "/" }, { name: "Услуги", href: "/services/" }, { name: service.title }]}
        />

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-5">Что входит в работу</h2>
              <ul className="space-y-3">
                {service.works.map((w, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="text-primary select-none">—</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {examples.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Объекты с такими работами</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {examples.map((p) => (
                    <Link
                      key={p.slug}
                      href={url(`/projects/${p.slug}/`)}
                      className="group border border-border hover:border-primary transition-colors flex gap-4 overflow-hidden"
                    >
                      <img
                        src={url(p.photo)}
                        alt={`${p.title} — ${p.client}`}
                        loading="lazy"
                        decoding="async"
                        className="w-28 h-full min-h-[96px] object-cover shrink-0"
                      />
                      <div className="py-4 pr-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{p.client}</p>
                        <p className="font-medium leading-snug mb-1">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="border border-border p-6 space-y-4 bg-card/40">
            <p className="font-bold text-foreground">Нужна оценка работ?</p>
            <p className="text-sm text-muted-foreground">
              Пришлите описание объекта или проектную документацию — посчитаем объём, стоимость и сроки.
            </p>
            <a
              href={url(COMPANY.phoneHref)}
              className="flex items-center gap-2 text-primary text-sm font-medium hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" /> {COMPANY.phone}
            </a>
            <a href={url(`mailto:${COMPANY.email}`)} className="block text-sm text-primary hover:text-foreground transition-colors break-all">
              {COMPANY.email}
            </a>
            <Link
              href={url("/contacts/")}
              className="block text-center border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-2.5 text-sm font-medium"
            >
              Оставить заявку
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
