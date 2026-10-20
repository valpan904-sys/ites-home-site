/**
 * Хлебные крошки: показывают поисковику и человеку место страницы в структуре сайта.
 */
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { url } from "@/lib/url";

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-xs sm:text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={`${c.name}-${i}`} className="flex items-center gap-2">
            {c.href ? (
              <Link href={url(c.href)} className="hover:text-primary transition-colors">
                {c.name}
              </Link>
            ) : (
              <span className="text-foreground/80">{c.name}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Единая «шапка» внутренних страниц: крошки, надзаголовок, H1, описание */
export function PageHeading({
  eyebrow,
  title,
  lead,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs: Crumb[];
}) {
  return (
    <div className="space-y-5">
      <Breadcrumbs items={crumbs} />
      {eyebrow && <p className="text-primary text-sm uppercase tracking-widest font-medium">{eyebrow}</p>}
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight max-w-4xl">{title}</h1>
      {lead && <p className="text-muted-foreground leading-relaxed max-w-3xl">{lead}</p>}
    </div>
  );
}
