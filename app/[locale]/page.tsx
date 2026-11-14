import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DireccionD } from "@/components/fogar/direcciones/d/DireccionD";
import { Resto } from "@/components/fogar/landing/Resto";
import { Esquina } from "@/components/fogar/sitio/Esquina";
import { Pie } from "@/components/fogar/sitio/Pie";
import { JsonLd } from "@/components/fogar/sitio/JsonLd";
import { paginaMetadata } from "@/lib/seo";
import { jsonLdPortada } from "@/lib/jsonld";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return paginaMetadata({ locale, href: "/", title: t("title"), description: t("description"), absoluto: true });
}

/** La portada: el recorrido por la sala (dirección D, «Hilo») y, debajo, instalar, privacidad, puertas y pie. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  return (
    <>
      {/* Lo primero al tabular: antes que la esquina y que el botón de pausa. */}
      <a href="#instala-t" className="f-saltar">{t("d.saltar")}</a>
      <Esquina />
      <main>
        <DireccionD />
        <Resto />
      </main>
      <Pie />
      <JsonLd data={jsonLdPortada(locale, t("meta.description"))} />
    </>
  );
}
