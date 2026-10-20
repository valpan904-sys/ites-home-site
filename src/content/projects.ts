/**
 * Объекты компании. На каждый объект строится отдельная страница /projects/<slug>/.
 * Тексты взяты дословно из исходной главной страницы, ссылки Dropbox заменены
 * на локальные галереи и PDF внутри нашего домена.
 */
import galleriesJson from "./galleries.json";

import projectSpa from "@assets/spa-kompleks-glava_1792067002111.jpg";
import projectKireevsk from "@assets/project-kireevsk_1792406108146.jpg";
import projectViktor from "@assets/project-viktor2_1774953877091.jpg";
import projectMonolith from "@assets/project-monolith_1774953877090.jpg";
import projectKinel from "@assets/project-kinel_1774953877089.jpg";
import projectNovatek from "@assets/project-novatek_1774953877090.jpg";
import projectTPlus from "@assets/project-t-plus_1774953877090.jpg";
import projectTransneft from "@assets/project-transneft_1774953877090.jpg";

export type GalleryPhoto = { src: string; thumb: string; w: number; h: number; alt: string };

export type Project = {
  slug: string;
  client: string;
  title: string;
  location: string;
  /** Год/период не указываем: в исходных данных его нет */
  photo: string;
  items: string[];
  /** Куда теперь ведёт ссылка «Смотреть фото» — на собственную страницу объекта */
  galleryFrom?: keyof typeof galleriesJson;
  doc?: { file: string; title: string; size: string };
  /** Услуги, к которым относится объект (для перелинковки) */
  services: string[];
};

const galleries = galleriesJson as unknown as Record<string, GalleryPhoto[]>;

export const PROJECTS: Project[] = [
  {
    slug: "spa-kompleks",
    client: "ГК «ВОЛГАТРАНССТРОЙ»",
    title: "Строительство СПА-комплекса",
    location: "г. Самара",
    photo: projectSpa,
    items: [
      "Устройство ж/б конструкций подпорных стенок, лестниц, ростверков, монолитных стен, монолитных балок, перекрытий общим объёмом 470 м³",
      "Гидроизоляция",
      "Черновая и чистовая отделка помещений",
    ],
    galleryFrom: "spa-kompleks",
    services: ["monolit", "otdelka", "genpodryad"],
  },
  {
    slug: "kireevsk",
    client: "ООО «СТРОЙНЕФТЬ»",
    title: "Реконструкция очистных сооружений",
    location: "Тульская обл., г. Киреевск",
    photo: projectKireevsk,
    items: [
      "Устройство ж/б конструкций фундамента, монолитных стен резервуара, плиты покрытия общим объёмом 1800 м³",
      "Гидроизоляция",
    ],
    galleryFrom: "kireevsk",
    services: ["monolit", "obshchestroy"],
  },
  {
    slug: "legend-rakira",
    client: "КОРПОРАЦИЯ «ВИКТОР И КО»",
    title: "ЖК «Легенда», ЖК «Ракита»",
    location: "г. Самара",
    photo: projectViktor,
    items: [
      "Дизайн-проект квартир",
      "Поставка материалов",
      "Чистовая отделка квартир (10 200 м², для ДУИ г. Самары)",
      "Предчистовая отделка квартир (21 200 м²)",
      "Отделка МОП (3 подъезда по 24 этажа)",
    ],
    galleryFrom: "legend-rakira",
    services: ["otdelka", "logistika", "genpodryad"],
  },
  {
    slug: "monolit",
    client: "ЖК «РАДУЖНЫЙ ЛЮКС», «АЛЬБАТРОС» И ДР.",
    title: "Монолитные работы",
    location: "Самарская обл.",
    photo: projectMonolith,
    items: [
      "ЖК «Радужный Люкс», «Радужный Элит», «Альбатрос»",
      "Комплекс гидрокрекинга «Новокуйбышевский НПЗ»",
      "Фундамент станции очистки ливневых сточных вод стадиона Самара-Арена",
    ],
    galleryFrom: "monolit",
    services: ["monolit"],
  },
  {
    slug: "kotelnaya-tplus",
    client: "ПАО Т+",
    title: "Куйбышевская отопительная котельная",
    location: "г. Самара, п. 116 км",
    photo: projectTPlus,
    items: [
      "Электрическое освещение, автоматизация",
      "Кабельные трассы в котельной",
      "СКУД и видеонаблюдение",
      "Электроснабжение 6 кВ / 0,4 кВ",
      "Пожарная сигнализация",
      "Пусконаладочные работы",
    ],
    doc: { file: "/documents/case-kotelnaya-t-plus.pdf", title: "Кейс: Куйбышевская отопительная котельная", size: "1,3 МБ" },
    services: ["elektro", "servis"],
  },
  {
    slug: "spg-sabetta",
    client: "ООО «ЯМАЛ СПГ», ООО «НОВАТЭК»",
    title: "Завод по производству СПГ",
    location: "п-ов Ямал, п. Сабетта",
    photo: projectNovatek,
    items: [
      "Силовая обвязка зоны главного факела",
      "Монтаж системы обогрева трубопроводов",
      "Прокладка силового кабеля по эстакаде",
      "Коммутация вторичных соединений",
    ],
    doc: { file: "/documents/case-spg-sabetta.pdf", title: "Кейс: завод по производству СПГ (Сабетта)", size: "1,7 МБ" },
    services: ["elektro", "servis"],
  },
  {
    slug: "kinel",
    client: "АДМИНИСТРАЦИЯ Г.О. КИНЕЛЬ",
    title: "Канализационно-очистные сооружения",
    location: "Самарская обл., г.о. Кинель",
    photo: projectKinel,
    items: [
      "Строительство кабельных трасс",
      "Прокладка сетей электроснабжения и автоматизации",
      "Комплексные поставки шкафного оборудования",
      "Монтаж систем вентиляции, отопления, фундаментов",
    ],
    doc: { file: "/documents/case-kinel.pdf", title: "Кейс: канализационно-очистные сооружения, Кинель", size: "1,0 МБ" },
    services: ["elektro", "obshchestroy", "logistika"],
  },
  {
    slug: "bavly",
    client: "АО «ТРАНСНЕФТЬ – ПРИВОЛГА»",
    title: "ЛПДС «Бавлы», Бугурусланское РНУ",
    location: "Респ. Татарстан, г. Бавлы",
    photo: projectTransneft,
    items: [
      "Строительство лотковых трасс",
      "Прокладка внешних сетей электроснабжения",
      "Подключение вторичных и силовых цепей",
      "Реконструкция ВЛ, монтаж анкерных опор ЛЭП",
    ],
    doc: { file: "/documents/case-bavly.pdf", title: "Кейс: ЛПДС «Бавлы», Бугурусланское РНУ", size: "1,4 МБ" },
    services: ["elektro", "obshchestroy"],
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const galleryFor = (p: Project): GalleryPhoto[] => (p.galleryFrom ? galleries[p.galleryFrom] ?? [] : []);
export const projectsForService = (serviceSlug: string) => PROJECTS.filter((p) => p.services.includes(serviceSlug));
