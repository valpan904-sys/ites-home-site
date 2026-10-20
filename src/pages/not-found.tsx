/** Страница 404: показывается, если адрес не найден */
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PROJECTS } from "@/content/projects";
import { COMPANY } from "@/content/site";
import { url } from "@/lib/url";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20 w-full flex-1 space-y-8">
        <p className="text-primary text-sm uppercase tracking-widest font-medium">— Ошибка 404</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Страница не найдена</h1>
        <p className="text-muted-foreground leading-relaxed">
          Возможно, адрес введён с опечаткой или страница переехала. Посмотрите разделы сайта или позвоните нам —{" "}
          <a href={url(COMPANY.phoneHref)} className="text-primary hover:text-foreground transition-colors">
            {COMPANY.phone}
          </a>
          .
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={url("/")}
            className="inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-2.5 text-sm font-medium"
          >
            На главную
          </Link>
          <Link
            href={url("/projects/")}
            className="inline-flex items-center border border-border hover:border-primary px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Объекты
          </Link>
          <Link
            href={url("/services/")}
            className="inline-flex items-center border border-border hover:border-primary px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Услуги
          </Link>
          <Link
            href={url("/contacts/")}
            className="inline-flex items-center border border-border hover:border-primary px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Контакты
          </Link>
        </div>

        <div className="pt-6 border-t border-border/60">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Популярные объекты</p>
          <ul className="space-y-2">
            {PROJECTS.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link href={url(`/projects/${p.slug}/`)} className="text-sm text-primary hover:text-foreground transition-colors">
                  {p.title} — {p.client}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
