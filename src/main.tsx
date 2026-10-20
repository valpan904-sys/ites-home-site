import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import App from "./App";
import "./index.css";

/**
 * Публикация может быть в корне домена (боевой сайт) или в подкаталоге
 * (демо на GitHub Pages). BASE_URL задаёт сборка, поэтому адрес для роутера
 * приводим к «внутреннему» виду: без префикса – и возвращаем префикс при переходах.
 */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function useAppLocation() {
  const [location, navigate] = useBrowserLocation();
  // Адреса в ссылках уже содержат префикс публикации (см. src/lib/url.ts),
  // поэтому переходу остаётся только пройти насквозь; для роутера префикс снимаем.
  const local = BASE && location.startsWith(BASE) ? location.slice(BASE.length) || "/" : location;
  const nav = (to: string, options?: unknown) => navigate(to, options as never);
  return [local, nav] as const;
}

createRoot(document.getElementById("root")!).render(
  <Router hook={useAppLocation as never}>
    <App />
  </Router>
);
