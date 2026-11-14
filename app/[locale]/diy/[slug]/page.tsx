import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Articulo } from "@/components/fogar/diy/Articulo";
import { Cabecera } from "@/components/fogar/sitio/Cabecera";
import { Pie } from "@/components/fogar/sitio/Pie";
import { JsonLd } from "@/components/fogar/sitio/JsonLd";
import { diyArticulo, diySlugs } from "@/content/fogar/diy";
import { routing } from "@/i18n/routing";
import { jsonLdArticulo } from "@/lib/jsonld";
import { paginaMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Solo existen los artículos del registro en ese idioma; cualquier otro slug da 404.
export const dynamicParams = false;
export const generateStaticParams = ({ params }: { params: { locale: string } }) => diySlugs(params.locale).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = diyArticulo(locale, slug);
  if (!e) return {};
  const t = await getTranslations({ locale, namespace: "diy" });
  return paginaMetadata({
    locale, href: `/diy/${slug}`, ...e.c.meta, idiomas: e.meta.idiomas,
    articulo: {
      publishedTime: e.meta.publicado,
      modifiedTime: e.meta.actualizado,
      authors: [t(`autores.${e.meta.autor}`)],
      section: t(`temas.${e.meta.tema}`),
    },
  });
}

export default async function DiyArticuloPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const e = diyArticulo(locale, slug);
  if (!e) notFound();
  const t = await getTranslations("diy");
  // Si no existe en el otro idioma, el selector lleva al índice del DIY de ese idioma en vez de a un 404.
  const otro = routing.locales.find((l) => l !== locale)!;
  const idiomaHref = e.meta.idiomas.includes(otro) ? undefined : "/diy";
  return (
    <>
      <a href="#texto" className="f-saltar">{t("saltar")}</a>
      <Cabecera actual="diy" idiomaHref={idiomaHref} />
      {/* key: al cambiar de idioma se remonta entero y el hilo y la casa no arrastran estado */}
      <main key={locale}>
        <Articulo e={e} locale={locale} />
      </main>
      <Pie idiomaHref={idiomaHref} />
      <JsonLd data={jsonLdArticulo(locale, e)} />
    </>
  );
}
