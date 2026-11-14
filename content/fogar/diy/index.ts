import en from "@/messages/diy.en.json";
import es from "@/messages/diy.es.json";
import { ARTICULOS, articuloDe, entradasDe, fechaCorta, idiomaDe, relacionadosDe } from "./registro";

export { fechaCorta, fechaLarga, plantillaDe, type Entrada, type Meta } from "./registro";

export const diyEntradas = (locale: string) => entradasDe(ARTICULOS, locale);
export const diySlugs = (locale: string) => diyEntradas(locale).map((e) => e.meta.slug);
export const diyArticulo = (locale: string, slug: string) => articuloDe(ARTICULOS, locale, slug);
export const diyRelacionados = (locale: string, slug: string) => relacionadosDe(ARTICULOS, locale, slug);

/** Fichas en texto plano para quien no tiene getTranslations a mano (la portada del sitio las lee así). */
export const diyIndice = (locale: string) => {
  const m = idiomaDe(locale) === "es" ? es : en;
  return {
    entradas: diyEntradas(locale).map(({ meta, c }) => ({
      slug: meta.slug,
      titulo: c.h1,
      resumen: c.meta.description,
      tipo: m.diy.tipos[meta.tipo],
      iso: meta.publicado,
      fecha: fechaCorta(locale, meta.publicado),
    })),
  };
};
