/**
 * Общие данные компании. Используются на всех страницах и в разметке для поисковиков.
 */
export const SITE_URL = "https://home.ltd-ites.com";

export const COMPANY = {
  name: "ООО «ИТЭС-Хоум»",
  shortName: "ИТЭС-Хоум",
  group: "ГК ИТЭС",
  brand: "ИТЭС group",
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

/** Пункты меню страницы объекта: ведут в разделы главной страницы */
export const NAV = [
  { href: "/", label: "Главная" },
  { href: "/#projects", label: "Объекты" },
  { href: "/#services", label: "Услуги" },
  { href: "/#contacts", label: "Контакты" },
];

/** Внешние профили компании – это ссылки «куда ещё можно обратиться», не источник контента */
export const SOCIALS = [
  { label: "Яндекс.Карты", href: "https://yandex.ru/maps/-/CPVBNO38" },
  { label: "2ГИС", href: "https://go.2gis.com/XABZ3" },
  { label: "ВКонтакте", href: "https://vk.ru/ltdites" },
  { label: "Telegram", href: "https://t.me/itesgroup" },
];

export const PARTNERS = [
  {
    name: "ESTIMA",
    lines: [
      "Первый производитель керамогранита в России",
      "ИТЭС-Хоум – официальный дистрибьютор керамогранита ТМ ESTIMA",
    ],
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
