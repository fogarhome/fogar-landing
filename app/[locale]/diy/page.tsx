import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Indice } from "@/components/fogar/diy/Indice";
import { Cabecera } from "@/components/fogar/sitio/Cabecera";
import { Pie } from "@/components/fogar/sitio/Pie";
import { paginaMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "diy.indice.meta" });
  return paginaMetadata({ locale, href: "/diy", title: t("title"), description: t("description") });
}

export default async function DiyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("diy");
  return (
    <>
      <a href="#contenido" className="f-saltar">{t("saltar")}</a>
      <Cabecera actual="diy" />
      <main>
        <Indice locale={locale} />
      </main>
      <Pie />
    </>
  );
}
