import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Dominio de producción: canonical, hreflang, sitemap y JSON-LD apuntan siempre aquí (también en desarrollo). */
export const SITIO = "https://jota-project.com";

type Locale = (typeof routing.locales)[number];

/** URL absoluta de `href` en ese idioma: el de por defecto sin prefijo, el resto con el suyo (localePrefix "as-needed"). */
export const urlDe = (locale: string, href: string) =>
  new URL(locale === routing.defaultLocale ? href : `/${locale}${href === "/" ? "" : href}`, SITIO).href;

/** hreflang: los idiomas en que existe la página (ella incluida) y x-default en inglés si existe. */
export function idiomasDe(href: string, idiomas: readonly string[] = routing.locales): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(idiomas.map((l) => [l, urlDe(l, href)]));
  languages["x-default"] = urlDe(idiomas.includes(routing.defaultLocale) ? routing.defaultLocale : idiomas[0], href);
  return languages;
}

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_ES" };
const ogLocale = (l: string) => OG_LOCALE[l as Locale] ?? OG_LOCALE.en;

type Articulo = { publishedTime: string; modifiedTime: string; authors: string[]; section: string };

/**
 * Metadata completa de una página. Next no fusiona openGraph, alternates ni twitter entre segmentos (cada uno
 * sustituye entero al del layout), así que todas las páginas pasan por aquí. og:image la añade opengraph-image.tsx.
 */
export function paginaMetadata({
  locale, href, title, description, idiomas = routing.locales, absoluto = false, articulo,
}: {
  locale: string;
  href: string;
  title: string;
  description: string;
  /** Idiomas en que existe la página (artículos: meta.idiomas) */
  idiomas?: readonly string[];
  /** Sin la plantilla «%s · Fogar» (la portada ya empieza por Fogar) */
  absoluto?: boolean;
  articulo?: Articulo;
}): Metadata {
  const url = urlDe(locale, href);
  const comun = {
    title, description, url, siteName: "Fogar",
    locale: ogLocale(locale),
    alternateLocale: idiomas.filter((l) => l !== locale).map(ogLocale),
  };
  return {
    title: absoluto ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: idiomasDe(href, idiomas) },
    openGraph: articulo ? { ...comun, type: "article", ...articulo } : { ...comun, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
