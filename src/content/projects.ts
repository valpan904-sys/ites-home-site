/**
 * Объекты компании.
 *
 * Своя страница пока у одного объекта — Куйбышевская отопительная котельная (ПАО Т+).
 * Остальные, как и на исходном сайте, ведут на внешние альбомы: по мере готовности
 * страниц включается поле `page`, а ссылка `link` убирается.
 */
import galleriesJson from "./galleries.json";
import heroKotelnaya from "./hero-kotelnaya.json";

import projectSpa from "@assets/spa-kompleks-glava_1792067002111.jpg";
import projectKireevsk from "@assets/project-kireevsk_1792406108146.jpg";
import projectViktor from "@assets/project-viktor2_1774953877091.jpg";
import projectMonolith from "@assets/project-monolith_1774953877090.jpg";
import projectKinel from "@assets/project-kinel_1774953877089.jpg";
import projectNovatek from "@assets/project-novatek_1774953877090.jpg";
import projectTPlus from "@assets/project-t-plus_1774953877090.jpg";
import projectTransneft from "@assets/project-transneft_1774953877090.jpg";

export type GalleryPhoto = { src: string; thumb: string; w: number; h: number; alt: string };
export type WorkGroup = { title: string; items: string[] };

export type Project = {
  slug: string;
  client: string;
  title: string;
  location: string;
  photo: string;
  /** Короткий состав работ на карточке главной страницы */
  items: string[];
  /** Есть ли у объекта своя страница */
  page?: boolean;
  /** Пока страницы нет — внешний альбом, как на исходном сайте */
  linkText?: string;
  link?: string;
  /* ниже — данные страницы объекта */
  hero?: { src: string; w: number; h: number; alt: string };
  subtitle?: string;
  about?: string[];
  facts?: { label: string; value: string }[];
  workGroups?: WorkGroup[];
  tech?: { name: string; note: string }[];
  unique?: string;
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
    linkText: "Смотреть фото",
    link: "https://www.dropbox.com/scl/fo/dzq6o61x9uynero3vmqxm/AOAVRlg4lIbYhkIp9bza8HM?rlkey=rhxrd5kj68pl5xb6xc6p25o8p&st=65f1kfgr&dl=0",
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
    linkText: "Смотреть фото",
    link: "https://www.dropbox.com/scl/fo/b5iq0yxpnssxk6fo3s56v/ANHK23gD_mD4Yu7LQblSPAE?rlkey=qq8ym9xs1un8ykh83wsbsud2z&st=0j8etckn&dl=0",
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
    linkText: "Смотреть фото",
    link: "https://www.dropbox.com/scl/fo/urqdtl9px6s4onsbj4h3i/AF8_qCS5Nn1NAX2sOmAHjLs?rlkey=xhztp5lim07i31le8cwllls7b&st=95bq69mo&dl=0",
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
    linkText: "Смотреть фото",
    link: "https://www.dropbox.com/scl/fo/9juefvhij2hx1bs3bnm80/AAYYrvpJamwostl_HhJVZ5I?rlkey=u6obj4d4t3xx9w2paevmuqypd&st=ue27dccj&dl=0",
  },
  {
    slug: "kotelnaya-tplus",
    client: "ПАО Т+",
    title: "Куйбышевская отопительная котельная",
    location: "г. Самара, п. 116 км",
    photo: projectTPlus,
    page: true,
    items: [
      "Электрическое освещение, автоматизация",
      "Кабельные трассы в котельной",
      "СКУД и видеонаблюдение",
      "Электроснабжение 6 кВ / 0,4 кВ",
      "Пожарная сигнализация",
      "Пусконаладочные работы",
    ],
    hero: heroKotelnaya as Project["hero"],
    subtitle: "Электроснабжение, автоматизация и охранные системы котельной",
    about: [
      "Куйбышевская отопительная котельная — объект ПАО Т+ в Самаре, посёлок 116 км. ИТЭС-Хоум выполнила здесь комплекс электромонтажных работ: кабельные трассы, электроснабжение 6 кВ и 0,4 кВ, электрическое освещение, комплексную автоматизацию, охранные системы и пусконаладочные работы.",
      "Особенность объекта — весь объём собран в одном договоре. Силовое оборудование, освещение, автоматику, систему контроля и управления доступом, видеонаблюдение и инженерно-технические средства охраны выполняла одна команда, а завершилась работа пусконаладкой и проверкой систем под нагрузкой.",
    ],
    facts: [
      { label: "Заказчик", value: "ПАО Т+" },
      { label: "Объект", value: "Куйбышевская отопительная котельная" },
      { label: "Локация", value: "г. Самара, п. 116 км" },
      { label: "Направление", value: "Электроснабжение, автоматизация, охранные системы" },
      { label: "Состав работ", value: "9 видов работ по одному договору" },
    ],
    workGroups: [
      {
        title: "Электроснабжение и кабельные сети",
        items: [
          "Электроснабжение. Сети 6 кВ",
          "Сети 0,4 кВ",
          "Кабельные трассы в котельной",
          "Электрическое освещение",
        ],
      },
      { title: "Автоматизация", items: ["Комплексная автоматизация оборудования котельной"] },
      {
        title: "Охранные системы",
        items: [
          "Система контроля и управления доступом (СКУД)",
          "Видеонаблюдение",
          "Инженерно-технические средства охраны (ИТСО)",
        ],
      },
      { title: "Пусконаладка", items: ["Пусконаладочные работы и сдача систем в эксплуатацию"] },
    ],
    tech: [
      { name: "Сети 6 кВ и 0,4 кВ", note: "Питание оборудования котельной от двух уровней напряжения" },
      { name: "Кабельные трассы", note: "Прокладка силовых и контрольных кабелей по объекту" },
      { name: "Комплексная автоматизация", note: "Автоматика котельной как единая система" },
      { name: "СКУД", note: "Контроль и управление доступом в помещения объекта" },
      { name: "Видеонаблюдение и ИТСО", note: "Охрана периметра и внутренних зон" },
      { name: "ПНР", note: "Пусконаладочные работы, проверка и сдача систем" },
    ],
    unique:
      "Комплексность: один подрядчик закрыл весь объём — от кабельных трасс и питания 6 кВ / 0,4 кВ до автоматизации, охранных систем и пусконаладки. Заказчик получил объект, готовый к эксплуатации, без стыков между исполнителями.",
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
    linkText: "Смотреть кейс (PDF)",
    link: "https://www.dropbox.com/scl/fi/fwiw54rk5skx20xbetv56/.pdf?rlkey=ihlsj1j2jzz72mkuuuyer6ntt&st=p5vi65az&dl=0",
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
    linkText: "Смотреть кейс (PDF)",
    link: "https://www.dropbox.com/scl/fi/tfu0eg9ab57rcey9emw3q/.pdf?rlkey=7rxuf4n40vwfcs9umynsy2x76&st=rg6cmjg5&dl=0",
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
    linkText: "Смотреть кейс (PDF)",
    link: "https://www.dropbox.com/scl/fi/kmmytxl960guvt7hbsvk4/.pdf?rlkey=ntrj4jznfauz3016kequav9lb&st=crwtm725&dl=0",
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const projectsWithPages = () => PROJECTS.filter((p) => p.page);
export const galleryFor = (p: Project): GalleryPhoto[] => galleries[p.slug] ?? [];
