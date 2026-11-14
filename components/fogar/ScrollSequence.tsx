"use client";

import { useEffect, useRef } from "react";
import { MAX_DEC, MAX_DEC_CLAVES, cercano, siguiente, sobran, ventana } from "./secuencia";

type Props = {
  scrollId: string;
  count: number;
  src: (i: number) => string;
  /** Se llama cada vez que el canvas pinta un fotograma (índice pintado y el propio canvas, para capas WebGL encima). */
  onPaint?: (i: number, canvas: HTMLCanvasElement) => void;
  /** Progreso del scroll (0–1) → fotograma. Sin él, el reparto es lineal. */
  mapa?: (p: number) => number;
  /** Fotogramas que se descargan justo después del póster (p. ej. los de las anclas de la navegación). */
  prioridad?: number[];
};

/**
 * Secuencia de fotogramas pintada en un canvas según el scroll de `scrollId`.
 * Móvil, puntero táctil o «reducir movimiento»: solo el primer fotograma (póster), sin descargar el resto.
 */
export default function ScrollSequence({ scrollId, count, src, onPaint, mapa, prioridad }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onPaintRef = useRef(onPaint);
  useEffect(() => { onPaintRef.current = onPaint; });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px), (pointer: coarse)").matches;
    // Todos los fotogramas se guardan comprimidos (blobs, ~40 KB); solo se decodifican los cercanos al objetivo del scroll
    // (ImageBitmap, fuera del hilo principal) y un esqueleto fijo (1 de cada CLAVE, a media resolución) que nunca se libera.
    // Así pintar nunca obliga al navegador a decodificar en mitad del scroll y un salto cae como mucho a CLAVE/2 fotogramas.
    const blobs: (Blob | null)[] = Array(count).fill(null);
    const frames: (ImageBitmap | null)[] = Array(count).fill(null);
    const claves: (ImageBitmap | null)[] = Array(count).fill(null);
    const decoding = new Set<number>(), decodingClave = new Set<number>();
    const NEAR = 12; // más lejos que esto, el canvas corta al objetivo en vez de recorrer los intermedios
    const TAU = 33; // ms: el suavizado de antes (0,4 por tick a 60 Hz), ahora por tiempo
    const scrollEl = document.getElementById(scrollId);
    let cur = 0, target = 0, dir = 1, last = 0, raf = 0, alive = true, movido = false;
    let shownImg: ImageBitmap | null = null;

    const progress = () => {
      if (!scrollEl) return 0;
      const r = scrollEl.getBoundingClientRect();
      return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
    };

    const imagen = (i: number) => frames[i] ?? claves[i];
    // Lo decodificado más cercano al pedido, para no dejar el canvas vacío mientras decodifica.
    const nearest = (i: number) => cercano(i, dir, 0, count - 1, (j) => !!imagen(j));

    const paint = (i: number) => {
      const img = imagen(i);
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.width, ch / img.height); // cover (también escala las claves, que van a menos resolución)
      const w = img.width * s, h = img.height * s;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      shownImg = img;
      onPaintRef.current?.(i, canvas);
    };

    // resizeWidth: Chrome 54, Firefox 98, Safari 15 (MDN BCD). Donde no exista se ignora (diccionario WebIDL) y la clave
    // sale a resolución completa; si aun así fallara, se decodifica sin opciones.
    const decodeClave = (b: Blob) => createImageBitmap(b, { resizeWidth: 960, resizeQuality: "medium" }).catch(() => createImageBitmap(b));

    // Lanza decodificaciones hasta el tope, siempre la pendiente más cercana al objetivo en este momento.
    const plan = () => {
      while (decoding.size + decodingClave.size < MAX_DEC) {
        const n = siguiente(target, dir, count,
          (i) => !!blobs[i] && !frames[i] && !decoding.has(i),
          (i) => !!blobs[i] && !claves[i] && !decodingClave.has(i),
          decodingClave.size < MAX_DEC_CLAVES);
        if (!n) return;
        const { i, clave } = n, enCurso = clave ? decodingClave : decoding;
        enCurso.add(i);
        (clave ? decodeClave(blobs[i]!) : createImageBitmap(blobs[i]!)).then((bm) => {
          enCurso.delete(i);
          const [lo, hi] = ventana(target, dir, count);
          // Una completa que llega tarde (fuera de la ventana actual) no se guarda; las claves, siempre.
          if (!alive || (!clave && (i < lo || i > hi))) bm.close();
          else (clave ? claves : frames)[i] = bm;
          schedule();
        }, () => { enCurso.delete(i); blobs[i] = null; }); // un blob que no decodifica no se vuelve a intentar
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const t = still ? 0 : mapa ? mapa(progress()) : progress() * (count - 1);
      if (t !== target) { dir = Math.sign(t - target); target = t; movido = true; }
      const dt = last ? Math.min(now - last, 100) : 1000 / 60;
      // Un salto (navegación, Inicio/Fin, arrastre de la barra) corta: no se recorren ni se piden los intermedios.
      if (Math.abs(target - cur) > NEAR) cur = target;
      else cur += (target - cur) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(target - cur) < 0.05) cur = target;
      plan();
      const i = nearest(Math.round(cur));
      if (i >= 0 && imagen(i) !== shownImg) paint(i);
      // Libera lo lejano solo con algo más cercano ya decodificado (`i`, lo que se pinta, no se libera nunca).
      for (const j of sobran(frames.flatMap((f, k) => (f ? [k] : [])), target, dir, count, i)) { frames[j]!.close(); frames[j] = null; }
      if (cur !== target) { last = now; raf = requestAnimationFrame(tick); } else last = 0;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      shownImg = null;
      // Cambiar el tamaño borra el lienzo: se repinta ya, no en el siguiente fotograma, para que nadie lo vea (ni lo copie) en negro.
      const i = nearest(Math.round(cur));
      if (i >= 0) paint(i);
      schedule();
    };

    // Descargas: el póster; después `prioridad` (las anclas de la navegación); después pasadas cada vez más finas
    // (1 de cada 16, 8, 4, 2 y el resto). En cuanto hay scroll, primero lo que falte cerca del objetivo.
    const order: number[] = [];
    const seen = new Set<number>([0]);
    for (const i of prioridad ?? []) if (i >= 0 && i < count && !seen.has(i)) { seen.add(i); order.push(i); }
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    }
    const pedidos = new Set<number>();
    let k = 0, cargando = 0;
    const load = (i: number): Promise<void> => {
      pedidos.add(i); // un fallo no se reintenta
      cargando++;
      return fetch(src(i))
        .then((r) => (r.ok ? r.blob() : null))
        .then((b) => { if (alive && b) { blobs[i] = b; schedule(); } }, () => {})
        .finally(() => { cargando--; });
    };
    const bombea = () => {
      while (alive && cargando < 6) {
        const [lo, hi] = [Math.round(target) - NEAR * 2, Math.round(target) + NEAR * 2];
        let i = movido ? cercano(target, dir, Math.max(0, lo), Math.min(count - 1, hi), (j) => !pedidos.has(j)) : -1;
        if (i < 0) { while (k < order.length && pedidos.has(order[k])) k++; i = k < order.length ? order[k] : -1; }
        if (i < 0) return;
        load(i).then(bombea);
      }
    };
    load(0).then(() => { if (!still) bombea(); });

    resize();
    addEventListener("resize", resize);
    if (!still) addEventListener("scroll", schedule, { passive: true });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      frames.forEach((f) => f?.close());
      claves.forEach((f) => f?.close());
      removeEventListener("resize", resize);
      removeEventListener("scroll", schedule);
    };
  }, [scrollId, count, src, mapa, prioridad]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
