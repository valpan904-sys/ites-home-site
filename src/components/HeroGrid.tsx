import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import logoForDark from "@assets/ites_fin_var_black_1_1774953769032.png";
import logoForLight from "@assets/ites_fin_var_1_1774953769031.png";
import { url } from "@/lib/url";

const NAV_ITEMS = [
  { label: "О компании", id: "about" },
  { label: "Проекты", id: "projects" },
  { label: "Контакты", id: "contacts" },
];

export function HeroGrid() {
  const { theme, toggleTheme } = useTheme();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">

      {/* Dot grid background — theme adaptive */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: theme === "light"
            ? "radial-gradient(circle, rgba(0,140,160,0.25) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,180,200,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Grid Lines — all identical 1px, GPU-rendered to avoid sub-pixel differences */}
      <motion.div
        className="absolute w-full bg-[#00b4c8]/50 top-[33.33%] pointer-events-none"
        style={{ height: "2px", transformOrigin: "left center", backfaceVisibility: "hidden" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-full bg-[#00b4c8]/50 top-[66.66%] pointer-events-none"
        style={{ height: "2px", transformOrigin: "left center", backfaceVisibility: "hidden" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-full bg-[#00b4c8]/50 left-[33.33%] pointer-events-none"
        style={{ width: "2px", transformOrigin: "center top", backfaceVisibility: "hidden" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.6, duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-full bg-[#00b4c8]/50 left-[66.66%] pointer-events-none"
        style={{ width: "2px", transformOrigin: "center top", backfaceVisibility: "hidden" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 2.3, duration: 0.6, ease: "easeInOut" }}
      />

      {/* Logo — top-left cell, half cell height */}
      <motion.div
        className="absolute top-[16px] left-[16px] sm:top-[40px] sm:left-[48px] z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 0.5 }}
      >
        <img
          src={url(theme === "dark" ? logoForDark : logoForLight)}
          alt="ИТЭС-Хоум"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="object-contain h-[7vh] max-w-[26vw] sm:h-[11.11vh] sm:max-w-none"
          draggable={false}
        />
      </motion.div>

      {/* Theme toggle — z-30 always on top */}
      <motion.button
        className="absolute top-[16px] right-[16px] sm:top-[40px] sm:right-[48px] z-30 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/50 hover:border-primary/50 bg-background/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.5 }}
        onClick={toggleTheme}
        aria-label="Переключить тему"
        data-testid="theme-toggle"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.button>

      {/* Nav Grid — pointer-events-none on wrapper, auto on cells */}
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 relative z-10 pointer-events-none">
        {/* Row 1 — empty */}
        <div />
        <div />
        <div />

        {/* Row 2 — nav cells */}
        {NAV_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            className="hero-nav-cell flex items-center justify-center cursor-pointer pointer-events-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2 + idx * 0.15, duration: 0.5, ease: "easeOut" }}
            onClick={() => scrollTo(item.id)}
            data-testid={`hero-nav-${item.id}`}
          >
            <span
              className="hero-nav-text text-foreground uppercase tracking-widest font-bold"
              style={{ fontSize: "clamp(13px, 3.5vw, 28px)" }}
            >
              {item.label}
            </span>
          </motion.div>
        ))}

        {/* Row 3 — empty */}
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
