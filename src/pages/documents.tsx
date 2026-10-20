/** Страница документов: СРО, сертификат, политика, презентации, кейсы */
import { Download, FileText } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHeading } from "@/components/Breadcrumbs";
import { DOCUMENTS, documentsByGroup, type SiteDocument } from "@/content/documents";

const GROUP_TITLES: Record<SiteDocument["group"], { title: string; note?: string }> = {
  legal: { title: "Разрешительные документы", note: "Проверяются заказчиками перед заключением договора" },
  presentation: { title: "Презентации", note: "О компании, системе управления проектами и монолитных работах" },
  case: { title: "Кейсы по объектам", note: "Подробные материалы по реализованным объектам в формате PDF" },
};

function DocRow({ d }: { d: SiteDocument }) {
  return (
    <a
      href={d.file}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 border border-border hover:border-primary transition-colors p-5"
    >
      <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <span className="flex-1">
        <span className="block font-medium text-foreground leading-snug">{d.title}</span>
        {d.note && <span className="block text-sm text-muted-foreground mt-1">{d.note}</span>}
        <span className="block text-xs text-muted-foreground/70 mt-1">PDF · {d.size}</span>
      </span>
      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium shrink-0">
        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        Открыть
      </span>
    </a>
  );
}

export default function Documents() {
  const groups: SiteDocument["group"][] = ["legal", "presentation", "case"];
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader solid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-24 space-y-12 sm:space-y-16 w-full flex-1">
        <PageHeading
          eyebrow="— Документы"
          title="Документы и материалы"
          lead="Выписка из реестра СРО, сертификат дистрибьютера, презентации компании и кейсы по объектам. Все файлы размещены на нашем сайте."
          crumbs={[{ name: "Главная", href: "/" }, { name: "Документы" }]}
        />

        {groups.map((g) => {
          const items = documentsByGroup(g);
          if (!items.length) return null;
          return (
            <section key={g} className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{GROUP_TITLES[g].title}</h2>
                {GROUP_TITLES[g].note && <p className="text-sm text-muted-foreground mt-1">{GROUP_TITLES[g].note}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((d) => (
                  <DocRow key={d.file} d={d} />
                ))}
              </div>
            </section>
          );
        })}

        <p className="text-xs text-muted-foreground/70">
          Всего документов: {DOCUMENTS.length}. Если нужен документ, которого здесь нет, — напишите на{" "}
          <a href="mailto:ites-home@ltd-ites.com" className="text-primary hover:text-foreground transition-colors">
            ites-home@ltd-ites.com
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
