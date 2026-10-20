/**
 * Подвал сайта: контакты, разделы, документы, соцсети.
 * Ссылки на страницы — настоящие, поэтому поисковик видит структуру сайта.
 */
import { Link } from "wouter";
import { SiTelegram, SiVk } from "react-icons/si";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, NAV, SOCIALS } from "@/content/site";
import { DOCUMENTS } from "@/content/documents";
import { PROJECTS } from "@/content/projects";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-bold text-foreground mb-4">{COMPANY.name}</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={COMPANY.phoneHref} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 shrink-0" /> {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 shrink-0" /> {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {COMPANY.address}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-4">Разделы</p>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-4">Объекты</p>
            <ul className="space-y-2 text-sm">
              {PROJECTS.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}/`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projects/" className="text-primary hover:text-foreground transition-colors">
                  Все объекты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-4">Документы</p>
            <ul className="space-y-2 text-sm">
              {DOCUMENTS.slice(0, 5).map((d) => (
                <li key={d.file}>
                  <a
                    href={d.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {d.title}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/documents/" className="text-primary hover:text-foreground transition-colors">
                  Все документы
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-5 mt-5">
              <a href={SOCIALS[3].href} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-muted-foreground hover:text-[#2AABEE] transition-colors">
                <SiTelegram className="w-5 h-5" />
              </a>
              <a href={SOCIALS[2].href} target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="text-muted-foreground hover:text-[#0077FF] transition-colors">
                <SiVk className="w-5 h-5" />
              </a>
              {SOCIALS.slice(0, 2).map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <span className="inline-flex items-center gap-1">
                    {s.label} <ArrowUpRight className="w-3 h-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} {COMPANY.name}. Все права защищены.
          </p>
          <a
            href="/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-primary underline underline-offset-2 transition-colors"
          >
            Политика в отношении обработки персональных данных
          </a>
        </div>
      </div>
    </footer>
  );
}
