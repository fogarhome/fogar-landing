import type { ReactNode } from "react";

/*
 * Interfaz anclada a la escena del vídeo. Todo se escribe en «coordenadas de escena»: píxeles del fotograma de 1920×1080.
 * La conversión a pantalla es la misma que la del canvas (cover, centrado) y es solo CSS: el escenario es un contenedor
 * de tamaño y la escala --s = max(ancho/1920, alto/1080). Sin JS, sin medir y sin saltos al cambiar de tamaño.
 */

/** Coloca a sus hijos con la esquina superior izquierda en (x, y) de escena; `w` limita el ancho, también en escena. */
export function Anclado({ x, y, w, children, className = "" }: { x: number; y: number; w?: number; children: ReactNode; className?: string }) {
  return (
    <div
      className={`pointer-events-auto absolute ${className}`}
      style={{
        // Con ancho conocido, nunca se sale de la pantalla aunque el recorte «cover» se coma los lados.
        left: w
          ? `clamp(24px, calc(50% + ${x - 960} * var(--s)), calc(100% - 24px - ${w} * var(--s)))`
          : `calc(50% + ${x - 960} * var(--s))`,
        top: `calc(50% + ${y - 540} * var(--s))`,
        width: w ? `calc(${w} * var(--s))` : undefined,
      }}
    >
      {children}
    </div>
  );
}

/** Tamaño de letra en px de escena, con un mínimo legible en pantalla. */
export const letra = (px: number, min = 14) => `max(${min}px, calc(${px} * var(--s)))`;
