import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HeroGrid } from "@/components/HeroGrid";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";
import { url } from "@/lib/url";
import { useTheme } from "@/contexts/ThemeContext";
import slide2Bg from "@assets/slide2-bg_1774954436350.jpg";
import docSro from "../assets/docs/sro-1.jpg";
import docCert from "../assets/docs/cert-1.jpg";
import bankAlfa from "@assets/bank-alfa_1774953840831.png";
import bankKreditEuropa from "@assets/bank-kredit-europa_1774953840832.png";
import bankMig from "@assets/bank-mig_1774953840833.png";
import bankMts from "@assets/bank-mts_1774953840833.png";
import bankOtp from "@assets/bank-otp_1774953840833.png";
import bankRenaissance from "@assets/bank-renaissance_1774953840833.png";
import bankRusstandart from "@assets/bank-russtandart_1774953840834.png";
import bankSovkom from "@assets/bank-sovkom_1774953840834.png";
import bankTbank from "@assets/bank-tbank_1774953840834.png";
import logoForDark from "@assets/ites-group-logo_dark-theme.png";
import logoForLight from "@assets/ites-group-logo_light-theme.png";
import {
  CreditCard, DollarSign, ArrowUpRight, ChevronLeft, ChevronRight, MapPin
} from "lucide-react";
import { SiVk, SiTelegram } from "react-icons/si";

const contactSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email"),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, { message: "Необходимо ваше согласие на обработку данных" })
});
type ContactFormValues = z.infer<typeof contactSchema>;

const BANKS = [
  { src: bankMts, alt: "МТС Банк" },
  { src: bankAlfa, alt: "Альфа-Банк" },
  { src: bankSovkom, alt: "Совкомбанк" },
  { src: bankRenaissance, alt: "Ренессанс Банк" },
  { src: bankRusstandart, alt: "Русский Стандарт" },
  { src: bankKreditEuropa, alt: "КредитЕвропаБанк" },
  { src: bankTbank, alt: "Т-Банк" },
  { src: bankOtp, alt: "ОТП Банк" },
  { src: bankMig, alt: "МИГ Кредит" },
];

export default function Home() {
  const { theme } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [_hpField, _setHpField] = useState("");
  const formLoadTime = useRef<number>(Date.now());
  const consentMeta = useRef<{
    checked_at: number | null;
    ms_since_load: number | null;
    input_type: "mouse" | "keyboard" | "touch" | "unknown";
    client_x: number | null;
    client_y: number | null;
    unchecked_count: number;
  }>({
    checked_at: null,
    ms_since_load: null,
    input_type: "unknown",
    client_x: null,
    client_y: null,
    unchecked_count: 0,
  });
  const touchStartX = useRef<number>(0);
  const projectsSectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: projectsScroll } = useScroll({
    target: projectsSectionRef,
    offset: ["start 0.92", "start 0.0"],
  });
  const card0Opacity = useTransform(projectsScroll, [0, 0.22], [0, 1]);
  const card0Y = useTransform(projectsScroll, [0, 0.22], [40, 0]);
  const card1Opacity = useTransform(projectsScroll, [0.38, 0.62], [0, 1]);
  const card1Y = useTransform(projectsScroll, [0.38, 0.62], [40, 0]);
  const card2Opacity = useTransform(projectsScroll, [0.76, 1.0], [0, 1]);
  const card2Y = useTransform(projectsScroll, [0.76, 1.0], [40, 0]);
  const cardScrollStyles = [
    { opacity: card0Opacity, y: card0Y },
    { opacity: card1Opacity, y: card1Y },
    { opacity: card2Opacity, y: card2Y },
  ];

  const nextSlide = () => {
    setSlideDirection(1);
    setCarouselIndex(i => (i + 1) % PROJECTS.length);
  };
  const prevSlide = () => {
    setSlideDirection(-1);
    setCarouselIndex(i => (i - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const visibleProjects = [0, 1, 2].map(offset =>
    PROJECTS[(carouselIndex + offset) % PROJECTS.length]
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", message: "", consent: false }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setIsSubmitError(false);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}send_form.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: _hpField,
          _load_time: formLoadTime.current,
          _consent_meta: consentMeta.current,
          _ua: navigator.userAgent,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setIsSubmitted(true);
        form.reset();
        setTimeout(() => setIsSubmitted(false), 6000);
      } else {
        setIsSubmitError(true);
      }
    } catch {
      setIsSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const inputCls = "w-full bg-transparent border border-border px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors text-sm";

  return (
    <div className="min-h-screen bg-background text-foreground w-full font-sans selection:bg-primary/30">
      <Navbar />
      <HeroGrid />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-24 space-y-14 sm:space-y-28">

        {/* О КОМПАНИИ */}
        <motion.section
          id="about"
          className="scroll-m-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <p className="text-primary text-sm uppercase tracking-widest font-medium mb-8">— О компании</p>

          {/* Grid: left = title+text+links, right = photo spanning full height */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-16">
            <div className="flex flex-col gap-7">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                Строительно-монтажная компания<br />полного цикла
              </h1>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  ООО «ИТЭС-Хоум» входит в группу компаний ИТЭС. Выполняем строительно-монтажные и отделочные работы под ключ — от подготовки площадки до сдачи объекта.
                </p>
                <p>
                  Переносим стандарты промышленного качества в гражданское строительство. Используем современные инструменты цифровизации и технологии искусственного интеллекта для управления проектами.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <a
                  href={url("/documents/presentation-company.pdf")}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors group text-sm font-medium"
                >
                  ИТЭС-Хоум <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href={url("/documents/project-management.pdf")}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors group text-sm font-medium"
                >
                  Мы управляем проектами <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href={url("/documents/presentation-monolit.pdf")}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors group text-sm font-medium"
                >
                  Монолитные работы <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Photo — same height as left column, right side of image preferred */}
            <div className="relative overflow-hidden min-h-[320px]">
              <img
                src={slide2Bg}
                alt="Строительство жилых комплексов"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-right"
              />
            </div>
          </div>

          {/* Services — Mobile: 12×1 описание/фото в порядке, с анимацией */}
          <div className="md:hidden">
            {SERVICES.map((srv, i) => (
              <div key={i}>
                <motion.div
                  className="bg-[#00b4c8] flex flex-col justify-center px-6 py-7"
                  style={{ minHeight: "185px" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${theme === "light" ? "text-white" : "text-black"}`}>
                    {srv.title}
                  </h3>
                  <p className={`leading-relaxed text-xs whitespace-pre-line ${theme === "light" ? "text-white/85" : "text-black/75"}`}>
                    {srv.desc}
                  </p>
                </motion.div>
                <motion.div
                  className="bg-muted overflow-hidden relative"
                  style={{ minHeight: "185px" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
                  viewport={{ once: true, margin: "-40px" }}
                >
                  {srv.photo && (
                    <img src={srv.photo} alt={srv.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center" />
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Services — Desktop: 6×2 chess grid */}
          <div
            className="hidden md:grid grid-cols-2"
            style={{ gridTemplateRows: `repeat(${SERVICES.length}, minmax(185px, auto))` }}
          >
            {SERVICES.map((srv, i) => {
              const isTextLeft = i % 2 === 0;
              const row = i + 1;

              return (
                <React.Fragment key={i}>

                  {/* Text cell */}
                  <motion.div
                    className="bg-[#00b4c8] flex flex-col justify-center px-12 py-9"
                    style={{ gridColumn: isTextLeft ? 1 : 2, gridRow: row }}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-60px" }}
                  >
                    <h3 className={`text-xl font-bold uppercase tracking-wide mb-4 ${theme === "light" ? "text-white" : "text-black"}`}>
                      {srv.title}
                    </h3>
                    <p className={`leading-relaxed text-sm whitespace-pre-line ${theme === "light" ? "text-white/85" : "text-black/75"}`}>
                      {srv.desc}
                    </p>
                  </motion.div>

                  {/* Photo cell */}
                  <motion.div
                    className="bg-muted overflow-hidden relative"
                    style={{ gridColumn: isTextLeft ? 2 : 1, gridRow: row }}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
                    viewport={{ once: true, margin: "-60px" }}
                  >
                    {srv.photo && (
                      <img src={srv.photo} alt={srv.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center" />
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </motion.section>

        {/* ПРОЕКТЫ — carousel step by 1, counter 1/6 to 6/6 */}
        <motion.section
          id="projects"
          ref={projectsSectionRef}
          className="scroll-m-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="space-y-4 mb-10">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">— Проекты</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Реализованные объекты</h2>
          </div>

          {/* Animated carousel — 3 visible, step by 1 */}
          <div
            className="overflow-hidden h-[600px] sm:h-[580px]"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
              }
            }}
          >
          <AnimatePresence mode="popLayout" custom={slideDirection}>
            <motion.div
              key={carouselIndex}
              custom={slideDirection}
              variants={{
                enter: (dir: number) => ({ x: dir > 0 ? "33.33%" : "-33.33%", opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir: number) => ({ x: dir > 0 ? "-33.33%" : "33.33%", opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full"
            >
              {visibleProjects.map((project, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col self-start sm:self-auto ${i > 0 ? "hidden sm:flex" : ""}`}
                  style={cardScrollStyles[i]}
                >
                  {/* Photo with zoom on hover */}
                  <div className="h-52 w-full overflow-hidden relative group/photo">
                    {project.photo ? (
                      <img
                        src={project.photo}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs uppercase tracking-widest">Фото</span>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="border-t border-border pt-5 flex flex-col">
                    <p className="text-[11px] text-primary uppercase tracking-widest font-medium min-h-[32px] leading-tight">
                      {project.client}
                    </p>
                    <h3 className="text-lg font-bold text-foreground mt-2 min-h-[56px] leading-snug">
                      {project.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 min-h-[24px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {project.location}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1.5 mt-4">
                      {project.items.filter(item => item !== "\u00a0").map((item, j) => (
                        <li key={j}>— {item}</li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      {project.page ? (
                        <Link
                          href={`/projects/${project.slug}/`}
                          className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors text-sm font-medium group/link"
                        >
                          Подробнее об объекте
                          <ArrowUpRight className="w-4 h-4 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors text-sm font-medium group/link"
                      >
                        {project.linkText}
                        <ArrowUpRight className="w-4 h-4 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Controls — bottom right, counter 1/6 to 6/6 */}
          <div className="flex justify-end items-center gap-3 mt-8">
            <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">
              {carouselIndex + 1} / {PROJECTS.length}
            </span>
            <button
              onClick={prevSlide}
              className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Предыдущий"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Следующий"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.section>

        {/* ПАРТНЁРЫ */}
        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <p className="text-primary text-sm uppercase tracking-widest font-medium">— Партнёры</p>

          <div className="grid md:grid-cols-2 gap-px bg-border">
            <div className="bg-background py-6 px-6 md:py-8 md:pl-0 md:pr-12 flex flex-col">
              <h3 className="text-base font-bold text-foreground tracking-wider mb-3">ESTIMA</h3>
              <p className="text-sm text-muted-foreground mb-1 min-h-[20px]">Первый производитель керамогранита в России</p>
              <p className="text-sm text-muted-foreground mb-5 min-h-[20px]">ИТЭС-Хоум — официальный дистрибьютор керамогранита ТМ ESTIMA</p>
              <a href="https://estima.ru" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors text-sm font-medium group mt-auto">
                estima.ru <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            <div className="bg-background py-6 px-6 md:py-8 md:pr-0 md:pl-12 flex flex-col">
              <h3 className="text-base font-bold text-foreground tracking-wider mb-3">LAGOMHOUSE</h3>
              <p className="text-sm text-muted-foreground mb-1 min-h-[20px]">Элитная отделка квартир и частных домов</p>
              <p className="text-sm text-muted-foreground mb-5 min-h-[20px]">Индивидуальные решения</p>
              <a href="https://vk.com/cdomc" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors text-sm font-medium group mt-auto">
                ВКонтакте <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* ДОКУМЕНТЫ */}
        <motion.section
          className="space-y-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <p className="text-primary text-sm uppercase tracking-widest font-medium">— Документы</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Выписка СРО */}
            <div className="flex flex-col gap-4">
              <a
                href={`${import.meta.env.BASE_URL}sro.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <img
                  src={docSro}
                  alt="Выписка СРО — первая страница"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                />
              </a>
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-sm">Выписка из реестра СРО</p>
                <a
                  href={`${import.meta.env.BASE_URL}sro.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors text-sm font-medium group shrink-0"
                >
                  Открыть PDF <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Сертификат */}
            <div className="flex flex-col gap-4">
              <a
                href={`${import.meta.env.BASE_URL}cert.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <img
                  src={docCert}
                  alt="Сертификат дистрибьютера — первая страница"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                />
              </a>
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-sm">Сертификат дистрибьютера</p>
                <a
                  href={`${import.meta.env.BASE_URL}cert.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-foreground transition-colors text-sm font-medium group shrink-0"
                >
                  Открыть PDF <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ФИНАНСИРОВАНИЕ */}
        <motion.section
          className="space-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="space-y-4 max-w-3xl">
            <p className="text-primary text-sm uppercase tracking-widest font-medium">— Финансирование</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              Специальные условия финансирования
            </h2>
            <p className="text-muted-foreground leading-relaxed pt-2">
              Мы сотрудничаем с надёжными банками и готовы предложить уникальные условия финансирования на Ваш проект по отделке квартиры
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <div className="flex flex-col justify-between">
              <div className="flex gap-5 items-center py-5 sm:py-7 border-b border-border/60">
                <CreditCard className="text-primary w-5 h-5 shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Беспроцентная рассрочка</h3>
                  <p className="text-muted-foreground text-sm">На 6 месяцев без переплат</p>
                </div>
              </div>
              <div className="flex gap-5 items-center py-5 sm:py-7">
                <DollarSign className="text-primary w-5 h-5 shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Кредит на специальных условиях</h3>
                  <p className="text-muted-foreground text-sm">От 6 до 24 месяцев · Сумма до 900 000 руб.</p>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="grid grid-cols-3 gap-x-2 sm:gap-x-8 h-full" style={{ alignContent: "space-between" }}>
                {BANKS.map((bank) => (
                  <div key={bank.alt} className="flex items-center justify-center py-2">
                    <img src={bank.src} alt={bank.alt} loading="lazy" decoding="async" className="h-7 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* КОНТАКТЫ */}
        <motion.section
          id="contacts"
          className="scroll-m-24 pt-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <p className="text-primary text-sm uppercase tracking-widest font-medium mb-4">— Контакты</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8 sm:mb-12">Свяжитесь с нами</h2>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left */}
            <div className="flex flex-col">
              <div className="py-8 border-b border-border/60">
                <p className="text-primary text-xs uppercase tracking-widest font-medium mb-5">Реквизиты</p>
                <div className="space-y-3 text-base">
                  <p className="text-foreground font-medium">ООО «ИТЭС-Хоум»</p>
                  <p><a href="tel:+78463331188" className="text-primary hover:text-foreground transition-colors">8 (846) 333-11-88</a></p>
                  <p><a href="mailto:ites-home@ltd-ites.com" className="text-primary hover:text-foreground transition-colors">ites-home@ltd-ites.com</a></p>
                  <p className="text-muted-foreground">г. Самара, ул. Льва Толстого, 14</p>
                </div>
              </div>
              <div className="py-8">
                <p className="text-primary text-xs uppercase tracking-widest font-medium mb-5">На картах и в соцсетях</p>
                <div className="flex items-center gap-6">
                  <a href="https://yandex.ru/maps/-/CPVBNO38" target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Яндекс</a>
                  <a href="https://go.2gis.com/XABZ3" target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">2ГИС</a>
                  <a href="https://vk.ru/ltdites" target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#0077FF] transition-colors" aria-label="VK">
                    <SiVk className="w-5 h-5" />
                  </a>
                  <a href="https://t.me/itesgroup" target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#2AABEE] transition-colors" aria-label="Telegram">
                    <SiTelegram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <p className="text-primary text-xs uppercase tracking-widest font-medium mb-7">Форма обратной связи</p>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-14 h-14 bg-primary/15 flex items-center justify-center mb-1">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Спасибо за заявку!</h3>
                  <p className="text-muted-foreground text-sm">Мы свяжемся с вами в ближайшее время.</p>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Honeypot: скрыто от людей, видно ботам */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={_hpField} onChange={e => _setHpField(e.target.value)} />
                  </div>
                  {/* 2-column: fields left, textarea right — equal height */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 items-stretch">
                    {/* Left sub-column */}
                    <div className="flex flex-col gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" htmlFor="name">Имя *</label>
                        <input {...form.register("name")} id="name" className={inputCls} data-testid="input-name" />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" htmlFor="phone">Телефон *</label>
                        <input {...form.register("phone")} id="phone" placeholder="+7 (___) ___-__-__" className={inputCls} data-testid="input-phone" />
                        {form.formState.errors.phone && (
                          <p className="text-destructive text-xs">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" htmlFor="email">Email *</label>
                        <input {...form.register("email")} id="email" type="email" className={inputCls} data-testid="input-email" />
                        {form.formState.errors.email && (
                          <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Right sub-column — textarea full height */}
                    <div className="flex flex-col">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5" htmlFor="message">Текст обращения</label>
                      <textarea
                        {...form.register("message")}
                        id="message"
                        className={`${inputCls} flex-1 resize-none`}
                        data-testid="input-message"
                      />
                    </div>
                  </div>

                  <div className="pt-5 space-y-4">
                    {/* Чекбокс согласия */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...form.register("consent")}
                          className="mt-0.5 w-4 h-4 shrink-0 accent-primary cursor-pointer"
                          data-testid="checkbox-consent"
                          onClick={(e) => {
                            const now = Date.now();
                            const checked = (e.target as HTMLInputElement).checked;
                            if (checked) {
                              const nativeEvent = e.nativeEvent as MouseEvent | PointerEvent;
                              consentMeta.current = {
                                checked_at: now,
                                ms_since_load: now - formLoadTime.current,
                                input_type: nativeEvent.pointerType === "touch" ? "touch"
                                  : nativeEvent.pointerType === "mouse" ? "mouse"
                                  : nativeEvent.clientX === 0 && nativeEvent.clientY === 0 ? "keyboard"
                                  : "mouse",
                                client_x: nativeEvent.clientX || null,
                                client_y: nativeEvent.clientY || null,
                                unchecked_count: consentMeta.current.unchecked_count,
                              };
                            } else {
                              consentMeta.current.unchecked_count += 1;
                              consentMeta.current.checked_at = null;
                            }
                          }}
                        />
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          Я ознакомлен(а) с{" "}
                          <a
                            href={`${import.meta.env.BASE_URL}privacy-policy.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            Политикой в отношении обработки персональных данных
                          </a>{" "}
                          и даю согласие на обработку моих персональных данных
                        </span>
                      </label>
                      {form.formState.errors.consent && (
                        <p className="text-destructive text-xs mt-1.5 ml-7">
                          {form.formState.errors.consent.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-medium py-3.5 transition-colors uppercase tracking-widest text-xs"
                      data-testid="button-submit"
                    >
                      {isSubmitting ? "Отправка…" : "Отправить"}
                    </button>
                    {isSubmitError && (
                      <p className="text-destructive text-xs text-center">
                        Не удалось отправить заявку. Пожалуйста, позвоните нам напрямую.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs">
              © 2026 ООО «ИТЭС-Хоум». Все права защищены.
            </p>
            <a
              href={`${import.meta.env.BASE_URL}privacy-policy.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-primary underline underline-offset-2 transition-colors w-fit"
            >
              Политика в отношении обработки персональных данных
            </a>
          </div>
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img
              src={theme === "dark" ? logoForDark : logoForLight}
              alt="ИТЭС group"
              loading="lazy"
              decoding="async"
              className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              draggable={false}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
