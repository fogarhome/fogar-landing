/*
 * Planificador de ScrollSequence, sin DOM: qué fotograma decodificar, cuál pintar y cuál liberar.
 * Todo se planifica contra el fotograma OBJETIVO del scroll (no contra el suavizado), sesgado en la dirección del scroll.
 */

/** Fotogramas decodificados por detrás y por delante del objetivo, en la dirección del scroll. */
export const ATRAS = 3;
export const DELANTE = 10;
/** Decodificaciones a la vez como mucho; el esqueleto ocupa una como mucho, para no frenar la ventana tras un salto. */
export const MAX_DEC = 3;
export const MAX_DEC_CLAVES = 1;
/** Esqueleto: uno de cada CLAVE se decodifica (a menos resolución) y no se libera nunca. Así lo pintado cae a ≤ CLAVE/2 del correcto. */
export const CLAVE = 8;
export const esClave = (i: number) => i % CLAVE === 0;

/** Ventana [lo, hi] alrededor del objetivo `t`, sesgada hacia `dir` (+1 bajando, −1 subiendo). */
export function ventana(t: number, dir: number, count: number): [number, number] {
  const c = Math.round(t);
  const [atras, delante] = dir < 0 ? [DELANTE, ATRAS] : [ATRAS, DELANTE];
  return [Math.max(0, c - atras), Math.min(count - 1, c + delante)];
}

/** El índice de [lo, hi] más cercano a `t` que cumple `ok`; a igual distancia, el que queda hacia `dir`. −1 si no hay. */
export function cercano(t: number, dir: number, lo: number, hi: number, ok: (i: number) => boolean) {
  const c = Math.min(hi, Math.max(lo, Math.round(t))), s = dir < 0 ? -1 : 1;
  for (let d = 0; c - d >= lo || c + d <= hi; d++) {
    for (const i of d ? [c + d * s, c - d * s] : [c]) if (i >= lo && i <= hi && ok(i)) return i;
  }
  return -1;
}

/**
 * La siguiente decodificación: primero lo pendiente de la ventana (lo más cercano al objetivo), después las claves del
 * esqueleto (también desde el objetivo hacia fuera). `pendiente(i)`: tiene blob y ni está decodificado ni en curso.
 */
export function siguiente(
  t: number, dir: number, count: number,
  pendiente: (i: number) => boolean, pendienteClave: (i: number) => boolean, claveLibre: boolean,
): { i: number; clave: boolean } | null {
  const [lo, hi] = ventana(t, dir, count);
  const i = cercano(t, dir, lo, hi, pendiente);
  if (i >= 0) return { i, clave: false };
  if (!claveLibre) return null;
  const k = cercano(t, dir, 0, count - 1, (j) => esClave(j) && pendienteClave(j));
  return k >= 0 ? { i: k, clave: true } : null;
}

/** Fotogramas completos que sobran: fuera de la ventana y que no son el que se va a pintar (siempre queda algo más cerca). */
export function sobran(decodificados: Iterable<number>, t: number, dir: number, count: number, pintado: number) {
  const [lo, hi] = ventana(t, dir, count);
  return [...decodificados].filter((i) => (i < lo || i > hi) && i !== pintado);
}
