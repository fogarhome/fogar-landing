import { describe, expect, it } from "vitest";
import { ATRAS, CLAVE, DELANTE, MAX_DEC, MAX_DEC_CLAVES, cercano, esClave, siguiente, sobran, ventana } from "./secuencia";
import { ALTO_VH, ANCLA, ORDEN, estacionDe, fotogramaDe, pasoBalda } from "./direcciones/d/guion";

const N = 283;

describe("planificador de ScrollSequence", () => {
  it("la ventana se sesga hacia la dirección del scroll", () => {
    expect(ventana(100, 1, N)).toEqual([100 - ATRAS, 100 + DELANTE]);
    expect(ventana(100, -1, N)).toEqual([100 - DELANTE, 100 + ATRAS]);
    expect(ventana(1, -1, N)).toEqual([0, 1 + ATRAS]);
    expect(ventana(N - 1, 1, N)).toEqual([N - 1 - ATRAS, N - 1]);
  });

  it("tras un salto largo, lo pintado es la clave más cercana y no el póster", () => {
    // Decodificados: el póster y el esqueleto entero; el objetivo salta a 194 (balda).
    const hay = (i: number) => i === 0 || esClave(i);
    const i = cercano(194, 1, 0, N - 1, hay);
    expect(i).not.toBe(0);
    expect(Math.abs(i - 194)).toBeLessThanOrEqual(CLAVE / 2);
    // Ningún punto del recorrido queda a más de CLAVE/2 de una clave.
    for (let t = 0; t < N; t++) expect(Math.abs(cercano(t, 1, 0, N - 1, esClave) - t)).toBeLessThanOrEqual(CLAVE / 2);
  });

  it("decodifica primero lo más cercano al objetivo, hacia delante, y solo dentro de la ventana", () => {
    const todo = () => true;
    expect(siguiente(150, 1, N, todo, todo, true)).toEqual({ i: 150, clave: false });
    expect(siguiente(150, 1, N, (i) => i !== 150, todo, true)).toEqual({ i: 151, clave: false });
    expect(siguiente(150, -1, N, (i) => i !== 150, todo, true)).toEqual({ i: 149, clave: false });
    // Lo de fuera de la ventana no se lanza: si la ventana está hecha, toca el esqueleto (la clave más cercana).
    expect(siguiente(150, 1, N, (i) => i > 150 + DELANTE, todo, true)).toEqual({ i: 152, clave: true });
    expect(siguiente(150, 1, N, (i) => i > 150 + DELANTE, todo, false)).toBeNull();
  });

  it("nunca hay más de MAX_DEC decodificaciones a la vez ni más de MAX_DEC_CLAVES del esqueleto", () => {
    // Simula el bucle de ScrollSequence.plan con todo descargado y nada decodificado.
    const dec = new Set<number>(), decClave = new Set<number>();
    for (const t of [0, 40, 194, 250, 12]) {
      while (dec.size + decClave.size < MAX_DEC) {
        const n = siguiente(t, 1, N, (i) => !dec.has(i), (i) => !decClave.has(i), decClave.size < MAX_DEC_CLAVES);
        if (!n) break;
        (n.clave ? decClave : dec).add(n.i);
      }
      expect(dec.size + decClave.size).toBeLessThanOrEqual(MAX_DEC);
      expect(decClave.size).toBeLessThanOrEqual(MAX_DEC_CLAVES);
      for (const i of dec) expect(Math.abs(i - t)).toBeLessThanOrEqual(DELANTE);
      dec.clear(); // terminan
    }
  });

  it("libera lo de fuera de la ventana salvo lo que se pinta", () => {
    expect(sobran([0, 96, 100, 120, 200], 100, 1, N, 0)).toEqual([96, 120, 200]);
  });
});

describe("anclas de la navegación", () => {
  it("cada ancla cae dentro de su estación (con el texto puesto)", () => {
    for (const e of ORDEN) expect(estacionDe(Math.round(fotogramaDe(ANCLA[e] / ALTO_VH)))).toBe(e);
  });
  it("en la balda se llega con los cuatro objetos nombrados", () => {
    expect(pasoBalda(ANCLA.balda)).toBe(4);
  });
});
