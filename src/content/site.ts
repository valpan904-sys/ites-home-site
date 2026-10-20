/**
 * Общие данные компании. Используются на всех страницах и в разметке для поисковиков.
 * Источник правды — эти значения; в разметке страниц не дублируются.
 */
export const SITE_URL = "https://home.ltd-ites.com";

export const COMPANY = {
  name: "ООО «ИТЭС-Хоум»",
  shortName: "ИТЭС-Хоум",
  group: "ГК ИТЭС",
  tagline: "Строительно-монтажная компания полного цикла",
  city: "Самара",
  region: "Самарская область",
  phone: "8 (846) 333-11-88",
  phoneHref: "tel:+78463331188",
  email: "ites-home@ltd-ites.com",
  address: "г. Самара, ул. Льва Толстого, 14",
  descriptionShort:
    "Строительно-монтажная компания полного цикла: отделочные работы, электромонтаж, генподряд, монолитные работы. Рассрочка и кредит.",
};

/** Ссылки на страницы и разделы — единый источник для меню, подвала и sitemap */
export const NAV = [
  { href: "/", label: "Главная" },
  { href: "/projects/", label: "Объекты", homeAnchor: "#projects" },
  { href: "/services/", label: "Услуги" },
  { href: "/documents/", label: "Документы", homeAnchor: "#documents" },
  { href: "/contacts/", label: "Контакты", homeAnchor: "#contacts" },
];

/** Внешние профили компании. Это ссылки «куда ещё можно обратиться», а не источник контента. */
export const SOCIALS = [
  { label: "Яндекс.Карты", href: "https://yandex.ru/maps/-/CPVBNO38", icon: "map" },
  { label: "2ГИС", href: "https://go.2gis.com/XABZ3", icon: "map" },
  { label: "ВКонтакте", href: "https://vk.ru/ltdites", icon: "vk" },
  { label: "Telegram", href: "https://t.me/itesgroup", icon: "telegram" },
];

export const PARTNERS = [
  {
    name: "ESTIMA",
    lines: ["Первый производитель керамогранита в России", "ИТЭС-Хоум — официальный дистрибьютор керамогранита ТМ ESTIMA"],
    linkLabel: "estima.ru",
    link: "https://estima.ru",
  },
  {
    name: "LAGOMHOUSE",
    lines: ["Элитная отделка квартир и частных домов", "Индивидуальные решения"],
    linkLabel: "ВКонтакте",
    link: "https://vk.com/cdomc",
  },
];
