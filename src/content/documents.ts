/**
 * Документы компании. Все файлы лежат на нашем домене — внешних ссылок нет.
 * Размеры указаны для показа (пересчитываются скриптом tools/build-media.py).
 */
export type SiteDocument = {
  title: string;
  file: string;
  size: string;
  note?: string;
  group: "legal" | "presentation" | "case";
};

export const DOCUMENTS: SiteDocument[] = [
  {
    title: "Выписка из реестра СРО",
    file: "/sro.pdf",
    size: "1,5 МБ",
    group: "legal",
  },
  {
    title: "Сертификат дистрибьютера",
    file: "/cert.pdf",
    size: "198 КБ",
    note: "ИТЭС-Хоум — официальный дистрибьютор керамогранита ТМ ESTIMA",
    group: "legal",
  },
  {
    title: "Политика в отношении обработки персональных данных",
    file: "/privacy-policy.pdf",
    size: "397 КБ",
    group: "legal",
  },
  {
    title: "Презентация компании ИТЭС-Хоум",
    file: "/documents/presentation-company.pdf",
    size: "5,0 МБ",
    group: "presentation",
  },
  {
    title: "Как мы управляем проектами",
    file: "/documents/project-management.pdf",
    size: "1,0 МБ",
    note: "Система совещаний трёх уровней, эскалация барьеров",
    group: "presentation",
  },
  {
    title: "Монолитные работы — презентация",
    file: "/documents/presentation-monolit.pdf",
    size: "4,6 МБ",
    group: "presentation",
  },
  {
    title: "Кейс: Куйбышевская отопительная котельная",
    file: "/documents/case-kotelnaya-t-plus.pdf",
    size: "1,3 МБ",
    group: "case",
  },
  {
    title: "Кейс: завод по производству СПГ (Сабетта)",
    file: "/documents/case-spg-sabetta.pdf",
    size: "1,7 МБ",
    group: "case",
  },
  {
    title: "Кейс: канализационно-очистные сооружения, Кинель",
    file: "/documents/case-kinel.pdf",
    size: "1,0 МБ",
    group: "case",
  },
  {
    title: "Кейс: ЛПДС «Бавлы», Бугурусланское РНУ",
    file: "/documents/case-bavly.pdf",
    size: "1,4 МБ",
    group: "case",
  },
];

export const documentsByGroup = (group: SiteDocument["group"]) => DOCUMENTS.filter((d) => d.group === group);
