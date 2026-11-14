// Registro de artículos de DIY. Publicar uno = su carpeta (meta + un fichero por idioma) y una línea en ARTICULOS.
// Los textos visibles de tipo, tema, estado, dificultad y autor salen de messages/diy.*.json por clave.
import { comoEstaHechoFogar } from "./como-esta-hecho-fogar";

export const IDIOMAS = ["es", "en"] as const;
export const TEMAS = ["fogar", "voz", "electronica", "orquestadores", "domotica", "pantallas"] as const;
export const ESTADOS = ["estable", "pruebas", "experimental"] as const;
export const TIPOS = ["nota", "guia"] as const;
export const DIFICULTADES = [1, 2, 3] as const;
export const AUTORES = ["equipo"] as const;

export type Idioma = (typeof IDIOMAS)[number];
export type Plantilla = "prosa" | "escenario";

export type Meta = {
  slug: string;
  idiomas: Idioma[];
  autor: (typeof AUTORES)[number];
  tipo: (typeof TIPOS)[number];
  tema: (typeof TEMAS)[number];
  etiquetas?: string[];
  dificultad: (typeof DIFICULTADES)[number];
  estado: (typeof ESTADOS)[number];
  /** AAAA-MM-DD */
  publicado: string;
  /** AAAA-MM-DD; igual a `publicado` si no ha cambiado */
  actualizado: string;
  minutos: number;
  /** Imagen de la ficha destacada del índice */
  portada: string;
  /** «escenario»: línea viva, mapa del gateway y casa (ecosistema Fogar). Sin poner: «prosa». */
  plantilla?: Plantilla;
  probado?: string[];
  /** Cierra con «Móntalo» y el instalador de Fogar */
  instalar: boolean;
};

export type Seccion = { id: string; toc: string; estado?: string; html: string };
export type Contenido = {
  /** title y description de la página; description es también el resumen de la ficha */
  meta: { title: string; description: string };
  h1: string;
  lede: string;
  /** markup propio que va tras la entradilla */
  antes?: string;
  /** «Hay que montar» en la ficha destacada */
  montar?: string;
  /** ids estables entre idiomas: se enlazan desde fuera */
  secciones: Seccion[];
  /** [AAAA-MM-DD, texto], del más nuevo al más antiguo */
  registro: [string, string][];
};
export type Articulo = { meta: Meta; contenido: Partial<Record<Idioma, Contenido>> };
export type Entrada = { meta: Meta; c: Contenido };

export const ARTICULOS: Articulo[] = [
  comoEstaHechoFogar,
];

export const idiomaDe = (locale: string): Idioma => (locale === "es" ? "es" : "en");
export const plantillaDe = (m: Meta): Plantilla => m.plantilla ?? "prosa";

/** Entradas que existen en ese idioma, de la más nueva a la más antigua. */
export function entradasDe(lista: Articulo[], locale: string): Entrada[] {
  const idioma = idiomaDe(locale);
  return lista
    .filter((a) => a.meta.idiomas.includes(idioma) && a.contenido[idioma])
    .map((a) => ({ meta: a.meta, c: a.contenido[idioma]! }))
    .sort((x, y) => y.meta.publicado.localeCompare(x.meta.publicado));
}

/** El artículo en ese idioma, o undefined si no existe en él (la página da notFound; nunca cae a otro idioma). */
export const articuloDe = (lista: Articulo[], locale: string, slug: string) =>
  entradasDe(lista, locale).find((e) => e.meta.slug === slug);

/** «Sigue leyendo»: hasta `n` del mismo idioma, sin el actual. */
export const relacionadosDe = (lista: Articulo[], locale: string, slug: string, n = 3) =>
  entradasDe(lista, locale).filter((e) => e.meta.slug !== slug).slice(0, n);

const fmt = (locale: string, iso: string, month: "short" | "long") =>
  new Intl.DateTimeFormat(idiomaDe(locale), { day: "numeric", month, year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
export const fechaCorta = (locale: string, iso: string) => fmt(locale, iso, "short");
export const fechaLarga = (locale: string, iso: string) => fmt(locale, iso, "long");
