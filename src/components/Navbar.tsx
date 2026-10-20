import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import logoForDark from "@assets/ites-group-logo_dark-theme.png";
import logoForLight from "@assets/ites-group-logo_light-theme.png";
import { url } from "@/lib/url";

const SECTIONS = [
  { id: "about", label: "О компании" },
  { id: "projects", label: "Проекты" },
  { id: "contacts", label: "Контакты" },
];

/**
 * Шапка сайта. Одна и та же на всех страницах: на главной появляется после
 * прокрутки, на внутренних – сразу (иначе с верха страницы некуда уйти).
 * Пункты меню ведут в разделы главной: если раздела на странице нет, переходим
 * на главную с якорем.
 */
export function Navbar({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const [isVisible, setIsVisible] = useState(alwaysVisible);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }
    const handleScroll = () => setIsVisible(window.scrollY > window.innerHeight * 0.8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [location]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // раздела нет на этой странице – идём на главную, к нужному блоку
    navigate(url(`/#${id}`));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/40"
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div
              className="cursor-pointer flex items-center"
              onClick={() => {
                if (document.getElementById("about")) window.scrollTo({ top: 0, behavior: "smooth" });
                else navigate(url("/"));
              }}
            >
              <img
                src={url(theme === "dark" ? logoForDark : logoForLight)}
                alt="ИТЭС group"
                className="h-8 w-auto object-contain"
                draggable={false}
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                {SECTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    className={[
                      "text-sm transition-colors uppercase tracking-wider",
                      activeSection === id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                    data-testid={`nav-${id}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/50 hover:border-primary/50"
                aria-label="Переключить тему"
                data-testid="theme-toggle-nav"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
