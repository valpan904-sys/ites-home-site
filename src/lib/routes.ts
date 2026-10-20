/**
 * Список страниц сайта: используется пре-рендером, sitemap.xml и мета-тегами.
 * Пока страниц две: главная и один объект (страница-образец).
 */
import { PROJECTS } from "@/content/projects";
import { COMPANY, SITE_URL, SOCIALS } from "@/content/site";

export type RouteMeta = {
  /** Путь без завершающего слэша — так его понимает роутер */
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  jsonLd?: unknown[];
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
  noindex?: boolean;
};

const clamp = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:.—-]+$/, "") + "…");

const organisation = () => ({
  "@type": "GeneralContractor",
  "@id": SITE_URL + "/#organization",
  name: COMPANY.shortName,
  legalName: COMPANY.name,
  url: SITE_URL,
  telephone: COMPANY.phoneHref.replace("tel:", ""),
  email: COMPANY.email,
  description:
    "Строительно-монтажная компания полного цикла. Отделочные работы, электромонтаж, монолитные работы, генподряд.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Льва Толстого, 14",
    addressLocality: COMPANY.city,
    addressRegion: COMPANY.region,
    postalCode: "443099",
    addressCountry: "RU",
  },
  geo: { "@type": "GeoCoordinates", latitude: 53.1853, longitude: 50.1108 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: SOCIALS.map((s) => s.href),
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 53.1853, longitude: 50.1108 },
    geoRadius: "500000",
  },
});

export const HOME_ROUTE: RouteMeta = {
  path: "/",
  title: "ИТЭС-Хоум — строительно-монтажная компания в Самаре",
  description:
    "ООО «ИТЭС-Хоум» — строительно-монтажная компания полного цикла в Самаре. Отделочные работы, электромонтаж, генподряд, монолитные работы. Рассрочка и кредит. Тел.: 8 (846) 333-11-88.",
  changefreq: "monthly",
  priority: "1.0",
  jsonLd: [
    { "@context": "https://schema.org", ...organisation() },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL,
      name: COMPANY.shortName,
      inLanguage: "ru-RU",
      publisher: { "@id": SITE_URL + "/#organization" },
    },
  ],
};

/** Страницы объектов: только те, у которых есть своя страница */
export const PROJECT_ROUTES: RouteMeta[] = PROJECTS.filter((p) => p.page).map((p) => ({
  path: `/projects/${p.slug}`,
  title: `${p.title} — ${p.client} | Объекты ИТЭС-Хоум`,
  description: clamp(
    `${p.title}, ${p.location}. Заказчик: ${p.client}. ${(p.workGroups ?? [])
      .flatMap((g) => g.items)
      .join(". ")}`
  ),
  ogImage: p.hero?.src,
  changefreq: "yearly",
  priority: "0.8",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${p.title} — ${p.client}`,
      url: `${SITE_URL}/projects/${p.slug}/`,
      description: clamp(p.about?.[0] ?? "", 300),
      isPartOf: { "@id": SITE_URL + "/#website" },
      about: { "@id": SITE_URL + "/#organization" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: p.title, item: `${SITE_URL}/projects/${p.slug}/` },
      ],
    },
  ],
}));

export const NOT_FOUND_ROUTE: RouteMeta = {
  path: "/404",
  title: "Страница не найдена — ИТЭС-Хоум",
  description: "Запрошенная страница не найдена. Вернитесь на главную страницу сайта ИТЭС-Хоум.",
  noindex: true,
};

/** Все страницы, которые генерируются статикой */
export const ALL_ROUTES: RouteMeta[] = [HOME_ROUTE, ...PROJECT_ROUTES, NOT_FOUND_ROUTE];

export const routeByPath = (path: string) =>
  ALL_ROUTES.find((r) => r.path === (path.length > 1 ? path.replace(/\/+$/, "") : path));
