/**
 * Управление содержимым <head>: одинаково для статики (пре-рендер) и для браузера.
 * При переходе между страницами без перезагрузки заголовок и мета-теги обновляются.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { SITE_URL } from "@/content/site";
import { NOT_FOUND_ROUTE, routeByPath, type RouteMeta } from "./routes";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const DEFAULT_OG = SITE_URL + "/opengraph.jpg";
const absolute = (u?: string) => (!u ? DEFAULT_OG : u.startsWith("http") ? u : SITE_URL + u);
const pageUrl = (path: string) => SITE_URL + (path === "/" ? "/" : path + "/");
const jsonLdString = (items: unknown[]) =>
  JSON.stringify(items.length === 1 ? items[0] : { "@context": "https://schema.org", "@graph": items }).replace(
    /</g,
    "\\u003c"
  );

/** HTML-блок head для конкретной страницы — подставляется при сборке */
export function headHtml(meta: RouteMeta): string {
  const url = pageUrl(meta.path);
  const og = absolute(meta.ogImage);
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow"}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="ru_RU" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:site_name" content="ИТЭС-Хоум" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${og}" />`,
  ];
  if (meta.jsonLd?.length) head.push(`<script type="application/ld+json">${jsonLdString(meta.jsonLd)}</script>`);
  return head.join("\n    ");
}

const setMeta = (attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

/** Обновляет head в браузере при переходе по внутренним ссылкам */
export function applyHead(meta: RouteMeta) {
  const url = pageUrl(meta.path);
  const og = absolute(meta.ogImage);
  document.title = meta.title;
  setMeta("name", "description", meta.description);
  setMeta("name", "robots", meta.noindex ? "noindex, follow" : "index, follow");
  setMeta("property", "og:url", url);
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:image", og);
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  setMeta("name", "twitter:image", og);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  if (meta.jsonLd?.length) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = jsonLdString(meta.jsonLd);
    document.head.appendChild(s);
  }
}

/** Слушает смену маршрута и применяет мета-теги нужной страницы */
export function HeadManager() {
  const [location] = useLocation();
  useEffect(() => {
    applyHead(routeByPath(location) ?? NOT_FOUND_ROUTE);
  }, [location]);
  return null;
}
