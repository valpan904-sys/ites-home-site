import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import logoForDark from "@assets/ites_fin_var_black_1_1774953769032.png";
import logoForLight from "@assets/ites_fin_var_1_1774953769031.png";

const SECTIONS = [
  { id: "about", label: "О компании" },
  { id: "projects", label: "Проекты" },
  { id: "contacts", label: "Контакты" },
];

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={theme === "dark" ? logoForDark : logoForLight}
                alt="ИТЭС-Хоум"
                className="h-8 w-auto object-contain"
                draggable={false}
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                {SECTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
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
