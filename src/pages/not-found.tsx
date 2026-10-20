/** Страница 404 */
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY } from "@/content/site";
import { url } from "@/lib/url";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar alwaysVisible />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20 w-full flex-1 space-y-8">
        <p className="text-primary text-sm uppercase tracking-widest font-medium">– Ошибка 404</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Страница не найдена</h1>
        <p className="text-muted-foreground leading-relaxed">
          Возможно, адрес введён с опечаткой или страница переехала. Вернитесь на главную или позвоните нам –{" "}
          <a href={COMPANY.phoneHref} className="text-primary hover:text-foreground transition-colors">
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
            href={url("/#projects")}
            className="inline-flex items-center border border-border hover:border-primary px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Объекты
          </Link>
          <Link
            href={url("/#contacts")}
            className="inline-flex items-center border border-border hover:border-primary px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Контакты
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
