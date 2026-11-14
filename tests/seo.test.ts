import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { ARTICULOS, entradasDe, type Articulo } from "@/content/fogar/diy/registro";
import { jsonLdArticulo, jsonLdPortada } from "@/lib/jsonld";
import { idiomasDe, paginaMetadata, SITIO, urlDe } from "@/lib/seo";

const vacios = (v: unknown, ruta = "$"): string[] =>
  v === undefined || v === null || v === "" ? [ruta]
    : Array.isArray(v) ? (v.length ? v.flatMap((x, i) => vacios(x, `${ruta}[${i}]`)) : [ruta])
    : typeof v === "object" ? Object.entries(v).flatMap(([k, x]) => vacios(x, `${ruta}.${k}`))
    : [];

describe("URLs por idioma", () => {
  it("inglés sin prefijo, español en /es", () => {
    expect(urlDe("en", "/")).toBe(`${SITIO}/`);
    expect(urlDe("es", "/")).toBe(`${SITIO}/es`);
    expect(urlDe("es", "/diy/x")).toBe(`${SITIO}/es/diy/x`);
  });

  it("hreflang incluye la propia página y x-default en inglés", () => {
    expect(idiomasDe("/diy")).toEqual({ en: `${SITIO}/diy`, es: `${SITIO}/es/diy`, "x-default": `${SITIO}/diy` });
  });

  it("un artículo solo en español no anuncia inglés y su x-default es el español", () => {
    const m = paginaMetadata({ locale: "es", href: "/diy/solo", title: "t", description: "d", idiomas: ["es"] });
    expect(m.alternates).toEqual({ canonical: `${SITIO}/es/diy/solo`, languages: { es: `${SITIO}/es/diy/solo`, "x-default": `${SITIO}/es/diy/solo` } });
    expect(m.openGraph).toMatchObject({ locale: "es_ES", alternateLocale: [] });
  });
});

describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);
  it("lista portada, Fogar TV y DIY en los dos idiomas", () => {
    for (const u of ["/", "/es", "/fogar-tv", "/es/fogar-tv", "/diy", "/es/diy"]) expect(urls).toContain(new URL(u, SITIO).href);
  });
  it("cada artículo solo en los idiomas que tiene, con su fecha de actualización", () => {
    for (const a of ARTICULOS) for (const l of a.meta.idiomas) {
      const e = sitemap().find((x) => x.url === urlDe(l, `/diy/${a.meta.slug}`));
      expect(e?.lastModified).toBe(a.meta.actualizado);
      expect(Object.keys(e?.alternates?.languages ?? {}).sort()).toEqual([...a.meta.idiomas, "x-default"].sort());
    }
  });
  it("sin URLs repetidas", () => expect(new Set(urls).size).toBe(urls.length));
});

describe("JSON-LD", () => {
  it("portada sin campos vacíos", () => expect(vacios(jsonLdPortada("es", "descripción"))).toEqual([]));
  it.each(["es", "en"])("artículos (%s) sin campos vacíos", (l) => {
    for (const e of entradasDe(ARTICULOS, l)) expect(vacios(jsonLdArticulo(l, e))).toEqual([]);
  });
  it("artículo: fechas y autor salen del registro", () => {
    const a: Articulo = ARTICULOS[0];
    const [art] = jsonLdArticulo("es", entradasDe([a], "es")[0])["@graph"];
    expect(art).toMatchObject({ datePublished: a.meta.publicado, dateModified: a.meta.actualizado, author: { name: "Equipo Fogar" } });
  });
});
