import { describe, expect, it } from "vitest";
import en from "@/messages/diy.en.json";
import es from "@/messages/diy.es.json";
import {
  ARTICULOS, AUTORES, DIFICULTADES, ESTADOS, TEMAS, TIPOS,
  articuloDe, entradasDe, plantillaDe, relacionadosDe, type Articulo, type Contenido,
} from "./registro";

// Fixture solo de test (no se publica): un artículo de prosa que solo existe en español.
const contenido: Contenido = { meta: { title: "Prueba", description: "d" }, h1: "Prueba", lede: "l", secciones: [{ id: "a", toc: "A", html: "<h2>A</h2>" }], registro: [] };
const soloEs: Articulo = {
  meta: {
    slug: "prueba-prosa", idiomas: ["es"], autor: "equipo", tipo: "guia", tema: "electronica", dificultad: 1, estado: "experimental",
    publicado: "2030-01-01", actualizado: "2030-01-01", minutos: 3, portada: "/x.avif", instalar: false,
  },
  contenido: { es: contenido },
};
const lista = [...ARTICULOS, soloEs];

describe("registro de DIY", () => {
  it("los slugs son únicos y la URL del artículo actual no cambia", () => {
    const slugs = ARTICULOS.map((a) => a.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain("como-esta-hecho-fogar");
  });

  it("cada idioma declarado tiene contenido, y no hay contenido sin declarar", () => {
    for (const { meta, contenido } of ARTICULOS) {
      expect(Object.keys(contenido).sort()).toEqual([...meta.idiomas].sort());
      expect(meta.publicado <= meta.actualizado).toBe(true);
    }
  });

  it("los ids de sección son iguales en todos los idiomas", () => {
    for (const { contenido } of ARTICULOS) {
      const ids = Object.values(contenido).map((c) => c!.secciones.map((s) => s.id).join());
      expect(new Set(ids).size).toBe(1);
    }
  });

  it("un artículo que solo existe en un idioma no aparece ni se sirve en el otro", () => {
    expect(articuloDe(lista, "es", "prueba-prosa")?.c).toBe(contenido);
    expect(articuloDe(lista, "en", "prueba-prosa")).toBeUndefined();
    expect(entradasDe(lista, "en").map((e) => e.meta.slug)).not.toContain("prueba-prosa");
    expect(articuloDe(lista, "es", "no-existe")).toBeUndefined();
  });

  it("ordena de más nuevo a más antiguo y «Sigue leyendo» excluye el actual", () => {
    expect(entradasDe(lista, "es")[0].meta.slug).toBe("prueba-prosa");
    const rel = relacionadosDe(lista, "es", "como-esta-hecho-fogar").map((e) => e.meta.slug);
    expect(rel).toEqual(["prueba-prosa"]);
    expect(relacionadosDe(lista, "en", "como-esta-hecho-fogar")).toEqual([]);
  });

  it("la plantilla por defecto es prosa; el artículo de Fogar usa escenario", () => {
    expect(plantillaDe(soloEs.meta)).toBe("prosa");
    expect(plantillaDe(ARTICULOS.find((a) => a.meta.slug === "como-esta-hecho-fogar")!.meta)).toBe("escenario");
  });

  it("cada clave cerrada tiene texto en los dos idiomas", () => {
    for (const { diy } of [es, en]) {
      for (const k of TEMAS) expect(diy.temas[k]).toBeTruthy();
      for (const k of ESTADOS) expect(diy.estados[k]).toBeTruthy();
      for (const k of TIPOS) expect(diy.tipos[k]).toBeTruthy();
      for (const k of AUTORES) expect(diy.autores[k]).toBeTruthy();
      for (const k of DIFICULTADES) expect(diy.dificultades[k]).toBeTruthy();
    }
  });
});
