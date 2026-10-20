/**
 * Подвал страницы объекта: контакты компании, разделы главной, соцсети.
 */
import { Link } from "wouter";
import { SiTelegram, SiVk } from "react-icons/si";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, NAV, SOCIALS } from "@/content/site";
import { url } from "@/lib/url";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-bold text-foreground mb-4">{COMPANY.name}</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={COMPANY.phoneHref}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" /> {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
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
            <p className="text-sm font-bold text-foreground mb-4">На картах и в соцсетях</p>
            <ul className="space-y-2 text-sm">
              {SOCIALS.slice(0, 2).map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-5 mt-4">
              <a
                href={SOCIALS[2].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ВКонтакте"
                className="text-muted-foreground hover:text-[#0077FF] transition-colors"
              >
                <SiVk className="w-5 h-5" />
              </a>
              <a
                href={SOCIALS[3].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-muted-foreground hover:text-[#2AABEE] transition-colors"
              >
                <SiTelegram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} {COMPANY.name}. Все права защищены.
          </p>
          <a
            href={url("/privacy-policy.pdf")}
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
