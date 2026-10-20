/**
 * Постоянная шапка сайта: настоящие ссылки на страницы (важно для поиска)
 * плюс переключатель темы и телефон. Фон проявляется при прокрутке,
 * чтобы не мешать главному экрану.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Moon, Phone, Sun, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { COMPANY, NAV } from "@/content/site";
import logoForDark from "@assets/ites_fin_var_black_1_1774953769032.png";
import logoForLight from "@assets/ites_fin_var_1_1774953769031.png";
import { url } from "@/lib/url";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(solid);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  useEffect(() => setOpen(false), [location]);

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <header
      className={[
        "fixed top-0 left-0 w-full z-50 transition-colors",
        scrolled || open ? "bg-background/90 backdrop-blur-md border-b border-border/40" : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href={url("/")} className="flex items-center shrink-0" aria-label={COMPANY.shortName}>
          <img
            src={url(theme === "dark" ? logoForDark : logoForLight)}
            alt={`${COMPANY.shortName} — ${COMPANY.tagline}`}
            className="h-8 w-auto object-contain"
            draggable={false}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Основная навигация">
          {NAV.filter((n) => n.href !== "/").map((n) => (
            <Link
              key={n.href}
              href={url(n.href)}
              className={[
                "text-sm uppercase tracking-wider transition-colors",
                isActive(n.href) ? "text-primary" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={url(COMPANY.phoneHref)}
            className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" />
            {COMPANY.phone}
          </a>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/50 hover:border-primary/50"
            aria-label="Переключить тему"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/50"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md" aria-label="Мобильная навигация">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={url(n.href)}
                className={[
                  "py-3 text-sm uppercase tracking-wider border-b border-border/30 last:border-0 transition-colors",
                  isActive(n.href) ? "text-primary" : "text-muted-foreground",
                ].join(" ")}
              >
                {n.label}
              </Link>
            ))}
            <a href={url(COMPANY.phoneHref)} className="py-3 text-sm text-primary">
              {COMPANY.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
