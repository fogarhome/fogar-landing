import en from "@/messages/diy.en.json";
import es from "@/messages/diy.es.json";
import { idiomaDe, type Entrada } from "@/content/fogar/diy/registro";
import { GITHUB_ORG } from "@/lib/github";
import { SITIO, urlDe } from "@/lib/seo";

// Solo datos que existen en el sitio y en el registro: nada de valoraciones, precios ni cifras inventadas.

const organizacion = { "@type": "Organization", name: "Fogar", url: `${SITIO}/`, logo: `${SITIO}/icon.svg`, sameAs: [GITHUB_ORG] };

/** Portada: quién publica (Organization) y el sitio (WebSite). */
export const jsonLdPortada = (locale: string, description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    { ...organizacion, "@id": `${SITIO}/#organizacion` },
    {
      "@type": "WebSite",
      "@id": `${SITIO}/#sitio`,
      name: "Fogar",
      url: urlDe(locale, "/"),
      description,
      inLanguage: locale,
      publisher: { "@id": `${SITIO}/#organizacion` },
    },
  ],
});

/** Artículo del DIY: TechArticle y su BreadcrumbList (DIY › artículo: los temas aún no tienen página propia). */
export function jsonLdArticulo(locale: string, { meta, c }: Entrada) {
  const m = (idiomaDe(locale) === "es" ? es : en).diy;
  const url = urlDe(locale, `/diy/${meta.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: c.h1,
        description: c.meta.description,
        url,
        mainEntityOfPage: url,
        // La imagen de opengraph-image.tsx siempre lleva el idioma en la ruta (también /en), como la publica Next.
        image: `${SITIO}/${locale}/diy/${meta.slug}/opengraph-image`,
        inLanguage: locale,
        datePublished: meta.publicado,
        dateModified: meta.actualizado,
        articleSection: m.temas[meta.tema],
        author: { "@type": "Organization", name: m.autores[meta.autor], url: `${SITIO}/` },
        publisher: organizacion,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "DIY", item: urlDe(locale, "/diy") },
          { "@type": "ListItem", position: 2, name: c.meta.title, item: url },
        ],
      },
    ],
  };
}
