/**
 * Подвал сайта – один и тот же на главной и на страницах объектов.
 */
import { useTheme } from "@/contexts/ThemeContext";
import logoForDark from "@assets/ites-group-logo_dark-theme.png";
import logoForLight from "@assets/ites-group-logo_light-theme.png";
import { url } from "@/lib/url";

export function SiteFooter() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border mt-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">© 2026 ООО «ИТЭС-Хоум». Все права защищены.</p>
          <a
            href={url("/privacy-policy.pdf?v=20261021")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-primary underline underline-offset-2 transition-colors w-fit"
          >
            Политика в отношении обработки персональных данных
          </a>
          <a
            href={url("/consent-personal-data.pdf")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-primary underline underline-offset-2 transition-colors w-fit"
          >
            Согласие на обработку персональных данных
          </a>
        </div>
        <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img
            src={url(theme === "dark" ? logoForDark : logoForLight)}
            alt="ИТЭС group"
            loading="lazy"
            decoding="async"
            className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            draggable={false}
          />
        </div>
      </div>
    </footer>
  );
}
