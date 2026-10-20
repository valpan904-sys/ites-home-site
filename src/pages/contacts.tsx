/** Контакты компании: адрес, телефон, почта, карты и соцсети */
import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiTelegram, SiVk } from "react-icons/si";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHeading } from "@/components/Breadcrumbs";
import { COMPANY, SOCIALS } from "@/content/site";

export default function Contacts() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-24 space-y-12 sm:space-y-16 w-full flex-1">
        <PageHeading
          eyebrow="— Контакты"
          title="Свяжитесь с нами"
          lead="Ответим на вопросы по объекту, посчитаем стоимость работ и сроки. Работаем с юридическими лицами и частными заказчиками."
          crumbs={[{ name: "Главная", href: "/" }, { name: "Контакты" }]}
        />

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
          <div className="space-y-8">
            <div>
              <p className="text-primary text-xs uppercase tracking-widest font-medium mb-5">Реквизиты</p>
              <div className="space-y-3 text-base">
                <p className="text-foreground font-medium">{COMPANY.name}</p>
                <p>
                  <a href={COMPANY.phoneHref} className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors">
                    <Phone className="w-4 h-4" /> {COMPANY.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors break-all">
                    <Mail className="w-4 h-4 shrink-0" /> {COMPANY.email}
                  </a>
                </p>
                <p className="inline-flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" /> {COMPANY.address}
                </p>
              </div>
            </div>

            <div>
              <p className="text-primary text-xs uppercase tracking-widest font-medium mb-5">На картах и в соцсетях</p>
              <div className="flex flex-wrap items-center gap-6">
                {SOCIALS.slice(0, 2).map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
                  >
                    {s.label}
                  </a>
                ))}
                <a href={SOCIALS[2].href} target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="text-muted-foreground hover:text-[#0077FF] transition-colors">
                  <SiVk className="w-5 h-5" />
                </a>
                <a href={SOCIALS[3].href} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-muted-foreground hover:text-[#2AABEE] transition-colors">
                  <SiTelegram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="border border-border p-6 bg-card/40">
              <p className="font-bold text-foreground mb-2">Реквизиты для договора</p>
              <p className="text-sm text-muted-foreground">
                Карточку предприятия, реквизиты и разрешительные документы вышлем по запросу на {COMPANY.email}.
                Выписка из реестра СРО и сертификат дистрибьютера доступны в разделе{" "}
                <Link href="/documents/" className="text-primary hover:text-foreground transition-colors">
                  Документы
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="border border-border p-6 sm:p-8 space-y-5 bg-card/40">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Оставить заявку</h2>
            <p className="text-muted-foreground leading-relaxed">
              Заполните форму на главной странице — она уйдёт напрямую в отдел по работе с заказчиками. Обычно отвечаем
              в течение рабочего дня.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>— описание объекта и адрес;</li>
              <li>— какие работы нужны (отделка, монолит, электрика, генподряд);</li>
              <li>— ориентировочные сроки;</li>
              <li>— контакты для ответа.</li>
            </ul>
            <Link
              href="/#contacts"
              className="inline-flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-5 py-3 text-sm font-medium w-full"
            >
              Перейти к форме заявки
            </Link>
            <p className="text-xs text-muted-foreground/70">
              Отправляя заявку, вы соглашаетесь с{" "}
              <a
                href="/privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                политикой в отношении обработки персональных данных
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
