/**
 * Единый список страниц сайта: используется пре-рендером, sitemap.xml и меню.
 * Здесь же — тексты title/description и разметка для поисковиков (JSON-LD).
 */
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";
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
  /** Не индексировать (служебные страницы) */
  noindex?: boolean;
};

const clamp = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:.—-]+$/, "") + "…");

const breadcrumbs = (trail: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: SITE_URL + t.url,
  })),
});

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

export const STATIC_ROUTES: RouteMeta[] = [
  HOME_ROUTE,
  {
    path: "/projects",
    title: "Реализованные объекты — ИТЭС-Хоум",
    description: clamp(
      "Портфель объектов ООО «ИТЭС-Хоум»: СПА-комплекс в Самаре, очистные сооружения, котельная ПАО Т+, завод СПГ в Сабетте, ЛПДС «Бавлы». Фото и описания работ."
    ),
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Реализованные объекты ИТЭС-Хоум",
        url: SITE_URL + "/projects/",
        about: { "@id": SITE_URL + "/#organization" },
        hasPart: PROJECTS.map((p) => ({
          "@type": "CreativeWork",
          name: p.title,
          url: `${SITE_URL}/projects/${p.slug}/`,
        })),
      },
      breadcrumbs([{ name: "Главная", url: "/" }, { name: "Объекты", url: "/projects/" }]),
    ],
  },
  {
    path: "/services",
    title: "Услуги — генподряд, отделка, монолит, электромонтаж | ИТЭС-Хоум",
    description: clamp(
      "Строительно-монтажные работы полного цикла в Самаре и Поволжье: генподряд, отделочные и монолитные работы, электромонтаж, поставка и логистика, сервис и обслуживание."
    ),
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Услуги ИТЭС-Хоум",
        url: SITE_URL + "/services/",
        about: { "@id": SITE_URL + "/#organization" },
        hasPart: SERVICES.map((s) => ({
          "@type": "Service",
          name: s.title,
          url: `${SITE_URL}/services/${s.slug}/`,
        })),
      },
      breadcrumbs([{ name: "Главная", url: "/" }, { name: "Услуги", url: "/services/" }]),
    ],
  },
  {
    path: "/documents",
    title: "Документы: СРО, сертификат, презентации и кейсы — ИТЭС-Хоум",
    description: clamp(
      "Выписка из реестра СРО, сертификат дистрибьютера ESTIMA, презентация компании и кейсы по объектам ООО «ИТЭС-Хоум»."
    ),
    changefreq: "monthly",
    priority: "0.6",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Документы ИТЭС-Хоум",
        url: SITE_URL + "/documents/",
      },
      breadcrumbs([{ name: "Главная", url: "/" }, { name: "Документы", url: "/documents/" }]),
    ],
  },
  {
    path: "/contacts",
    title: "Контакты ИТЭС-Хоум — Самара, ул. Льва Толстого, 14",
    description: clamp(
      "Контакты ООО «ИТЭС-Хоум»: 8 (846) 333-11-88, ites-home@ltd-ites.com, г. Самара, ул. Льва Толстого, 14. Форма заявки на расчёт стоимости работ."
    ),
    changefreq: "yearly",
    priority: "0.8",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: SITE_URL + "/contacts/",
        about: { "@id": SITE_URL + "/#organization" },
      },
      breadcrumbs([{ name: "Главная", url: "/" }, { name: "Контакты", url: "/contacts/" }]),
    ],
  },
];

export const PROJECT_ROUTES: RouteMeta[] = PROJECTS.map((p) => ({
  path: `/projects/${p.slug}`,
  title: `${p.title} — ${p.client} | Объекты ИТЭС-Хоум`,
  description: clamp(`${p.client}, ${p.location}. ${p.items.join(". ")}`),
  ogImage: `${SITE_URL}${p.photo.startsWith("http") ? "" : ""}`,
  changefreq: "yearly",
  priority: "0.7",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${p.title} — ${p.client}`,
      url: `${SITE_URL}/projects/${p.slug}/`,
      description: clamp(`${p.client}, ${p.location}. ${p.items.join(". ")}`, 300),
      isPartOf: { "@id": SITE_URL + "/#website" },
      about: { "@id": SITE_URL + "/#organization" },
    },
    breadcrumbs([
      { name: "Главная", url: "/" },
      { name: "Объекты", url: "/projects/" },
      { name: p.title, url: `/projects/${p.slug}/` },
    ]),
  ],
}));

export const SERVICE_ROUTES: RouteMeta[] = SERVICES.map((s) => ({
  path: `/services/${s.slug}`,
  title: `${s.title} в Самаре — ИТЭС-Хоум`,
  description: clamp(`${s.desc.replace(/\n/g, " ")} ${s.works[0] ? " " + s.works[0] : ""}`),
  changefreq: "yearly",
  priority: "0.7",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      description: clamp(s.desc.replace(/\n/g, " "), 300),
      url: `${SITE_URL}/services/${s.slug}/`,
      provider: { "@id": SITE_URL + "/#organization" },
      areaServed: { "@type": "State", name: "Самарская область" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: s.title,
        itemListElement: s.works.map((w) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: w } })),
      },
    },
    breadcrumbs([
      { name: "Главная", url: "/" },
      { name: "Услуги", url: "/services/" },
      { name: s.title, url: `/services/${s.slug}/` },
    ]),
  ],
}));

export const NOT_FOUND_ROUTE: RouteMeta = {
  path: "/404",
  title: "Страница не найдена — ИТЭС-Хоум",
  description: "Запрошенная страница не найдена. Вернитесь на главную страницу сайта ИТЭС-Хоум.",
  noindex: true,
};

/** Все страницы, которые нужно сгенерировать статикой */
export const ALL_ROUTES: RouteMeta[] = [
  ...STATIC_ROUTES,
  ...PROJECT_ROUTES,
  ...SERVICE_ROUTES,
  NOT_FOUND_ROUTE,
];

export const routeByPath = (path: string) =>
  ALL_ROUTES.find((r) => r.path === (path.length > 1 ? path.replace(/\/+$/, "") : path));
