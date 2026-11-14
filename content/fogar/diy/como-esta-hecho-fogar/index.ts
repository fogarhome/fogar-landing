import type { Articulo } from "../registro";
import { articuloEn } from "./en";
import { articuloEs } from "./es";

export const comoEstaHechoFogar: Articulo = {
  meta: {
    slug: "como-esta-hecho-fogar",
    idiomas: ["es", "en"],
    autor: "equipo",
    tipo: "nota",
    tema: "fogar",
    dificultad: 2,
    estado: "estable",
    publicado: "2026-10-27",
    actualizado: "2026-11-13",
    minutos: 9,
    // Fotograma real de la escena: la pared y la lámpara sobre la balda, sin altavoz ni radio.
    portada: "/media/secuencia/v6/1280/f_270.avif",
    plantilla: "escenario",
    instalar: true,
    // Versiones comprobadas el 2026-11-13 contra las releases de GitHub (fogarhome y openclaw).
    // fogar-voice no tiene release publicada: no se cita.
    probado: [
      "fogar-gateway v1.29.0", // pendiente: revalidar con v2.0.0 (es la que instala hoy el instalador)
      "fogar-transcriber v1.4.2",
      "fogar-speaker v1.1.6",
      "fogar-wake-trainer v1.0.1",
      "OpenClaw 2026.10.5",
    ],
  },
  contenido: { es: articuloEs, en: articuloEn },
};
