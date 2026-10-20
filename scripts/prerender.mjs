/**
 * Полная сборка сайта:
 *   1) клиентская сборка (Vite) -> dist/public
 *   2) серверная сборка точки входа -> dist/ssr
 *   3) рендер каждой страницы в готовый HTML (+ sitemap.xml, 404.html)
 *
 * Запуск:  pnpm run build:site      (или node scripts/prerender.mjs)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist", "public");
const ssrDir = path.join(root, "dist", "ssr");

process.env.PORT = process.env.PORT || "3000";
process.env.BASE_PATH = process.env.BASE_PATH || "/";
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const kb = (n) => (n / 1024).toFixed(1) + " КБ";

/** Сниппет Яндекс.Метрики — подставляется, если указан номер счётчика */
function metrikaSnippet(id) {
  if (!id) return "";
  return `<!-- Yandex.Metrika counter -->
    <script type="text/javascript">
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(${id}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->`;
}

function readMetrikaId() {
  const f = path.join(root, "scripts", "metrika-id.txt");
  if (!fs.existsSync(f)) return "";
  const id = fs.readFileSync(f, "utf8").trim().replace(/\D/g, "");
  return id || "";
}

async function main() {
  const metrika = metrikaSnippet(readMetrikaId());
  console.log("1/4 клиентская сборка…");
  await build({ configFile: path.join(root, "vite.config.ts"), logLevel: "warn" });

  console.log("2/4 серверная сборка…");
  await build({
    configFile: path.join(root, "vite.config.ts"),
    logLevel: "warn",
    build: {
      ssr: path.join(root, "src", "entry-server.tsx"),
      outDir: ssrDir,
      emptyOutDir: true,
      minify: false,
      rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
    },
    ssr: { noExternal: true },
  });

  const ssrEntry = path.join(ssrDir, "entry-server.mjs");
  if (!fs.existsSync(ssrEntry)) throw new Error("серверная сборка не создала " + ssrEntry);
  const ssr = await import(pathToFileURL(ssrEntry).href);

  const templatePath = path.join(dist, "index.html");
  const template = fs.readFileSync(templatePath, "utf8");
  if (!template.includes("<!--APP-HTML-->")) throw new Error("в index.html нет метки <!--APP-HTML-->");

  console.log("3/4 рендер страниц…");
  let count = 0;
  for (const route of ssr.ALL_ROUTES) {
    // PREVIEW=1 — демонстрационная сборка для обсуждения: поисковикам её не показываем
    const isPreview = !!process.env.PREVIEW;
    const html = template
      .replace("<!--HEAD-START-->", "<!--HEAD-START-->\n    " + ssr.head(route.path))
      .replace("<!--APP-HTML-->", ssr.render(route.path))
      .replace("<!--METRIKA-->", metrika);

    const dir = route.path === "/" ? dist : path.join(dist, route.path.replace(/^\/+/, ""));
    fs.mkdirSync(dir, { recursive: true });
    const outHtml = isPreview
      ? html.replace(/content="index, follow"/g, 'content="noindex, nofollow"')
      : html;
    fs.writeFileSync(path.join(dir, "index.html"), outHtml, "utf8");
    count++;
  }

  // страница 404 для сервера (Apache отдаёт её через ErrorDocument)
  const notFoundHtml = template
    .replace("<!--HEAD-START-->", "<!--HEAD-START-->\n    " + ssr.head("/404"))
    .replace("<!--APP-HTML-->", ssr.render("/404"))
    .replace("<!--METRIKA-->", "");
  fs.writeFileSync(path.join(dist, "404.html"), notFoundHtml, "utf8");

  console.log("4/4 sitemap.xml…");
  const today = new Date().toISOString().slice(0, 10);
  const urls = ssr.ALL_ROUTES.filter((r) => !r.noindex).map((r) => {
    const loc = "https://home.ltd-ites.com" + (r.path === "/" ? "/" : r.path + "/");
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${r.changefreq ?? "monthly"}</changefreq>`,
      `    <priority>${r.priority ?? "0.5"}</priority>`,
      "  </url>",
    ].join("\n");
  });
  fs.writeFileSync(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    "utf8"
  );

  const size = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((acc, e) => {
    const p = path.join(d, e.name);
    return acc + (e.isDirectory() ? size(p) : fs.statSync(p).size);
  }, 0);

  console.log(`\nготово: страниц — ${count}, 404.html, sitemap.xml (${count - 1} адресов)`);
  console.log(`размер сборки: ${kb(size(dist))}${metrika ? " | счётчик Метрики подключён" : " | счётчик Метрики пока не задан (scripts/metrika-id.txt)"}`);
}

main().catch((e) => {
  console.error("сборка упала:", (e && e.message) || e);
  if (e && e.frame) console.error(e.frame);
  if (e && e.stack) console.error("\nстек:\n" + e.stack.split("\n").slice(0, 12).join("\n"));
  process.exit(1);
});
