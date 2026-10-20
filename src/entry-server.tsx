/**
 * Серверный вход для пре-рендера: сборка вызывает render(путь) и получает
 * готовый HTML страницы. Используется скриптом scripts/prerender.mjs.
 */
import { renderToString } from "react-dom/server";
import type { BaseLocationHook } from "wouter";
import { Router } from "wouter";
import App from "./App";
import { headHtml } from "./lib/head";
import { ALL_ROUTES, NOT_FOUND_ROUTE, routeByPath } from "./lib/routes";

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * Статичный адрес для серверного рендера.
 * Штатный memoryLocation из wouter использует useSyncExternalStore без
 * серверного снимка и падает при рендере на Node, поэтому отдаём свой хук.
 */
const staticHook = (path: string): BaseLocationHook => {
  const hook = () => [path, () => undefined] as [string, (to: string) => void];
  return hook as unknown as BaseLocationHook;
};

export function render(path: string): string {
  return renderToString(
    <Router hook={staticHook(normalize(path))}>
      <App />
    </Router>
  );
}

export function head(path: string): string {
  return headHtml(routeByPath(path) ?? NOT_FOUND_ROUTE);
}

export function notFoundMeta() {
  return headHtml(NOT_FOUND_ROUTE);
}

export { ALL_ROUTES };
