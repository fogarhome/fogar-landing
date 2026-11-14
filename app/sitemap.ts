import type { MetadataRoute } from "next";
import { ARTICULOS } from "@/content/fogar/diy/registro";
import { idiomasDe, urlDe } from "@/lib/seo";
import { routing } from "@/i18n/routing";

/** Todas las URLs públicas, una entrada por idioma, cada una con sus hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pagina = (href: string, idiomas: readonly string[], lastModified?: string) =>
    idiomas.map((l) => ({ url: urlDe(l, href), ...(lastModified && { lastModified }), alternates: { languages: idiomasDe(href, idiomas) } }));
  // Fecha de las páginas fijas: la del artículo más reciente (el índice del DIY y la portada lo listan).
  const ultima = ARTICULOS.map((a) => a.meta.actualizado).sort().at(-1);
  return [
    ...pagina("/", routing.locales, ultima),
    ...pagina("/fogar-tv", routing.locales),
    ...pagina("/diy", routing.locales, ultima),
    ...ARTICULOS.flatMap((a) => pagina(`/diy/${a.meta.slug}`, a.meta.idiomas.filter((l) => a.contenido[l]), a.meta.actualizado)),
  ];
}
