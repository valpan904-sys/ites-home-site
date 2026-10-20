/**
 * Адреса внутри сайта.
 *
 * Сайт может публиковаться и в корне домена (боевой home.ltd-ites.com), и в
 * подкаталоге (демо на GitHub Pages: /ites-home-site/). Чтобы ссылки работали
 * в обоих случаях, все внутренние адреса собираются этой функцией от BASE_URL,
 * который задаёт сборка (VITE base).
 */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export const url = (path: string): string => {
  if (!path) return BASE || "/";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("tel:") || path.startsWith("#")) {
    return path;
  }
  // Значение уже содержит префикс публикации (например адрес картинки, подставленный
  // сборщиком) — возвращаем как есть, иначе префикс удвоится.
  if (BASE && (path === BASE || path.startsWith(BASE + "/"))) return path;
  return BASE + (path.startsWith("/") ? path : "/" + path);
};
