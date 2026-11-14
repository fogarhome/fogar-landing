import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Imagen para compartir: el título de la página sobre --noche, y la marca en --llama. Fuente por defecto de next/og. */
export function ogImagen(titulo: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0b1012", color: "#ece6dc" }}>
        <div style={{ fontSize: 40, letterSpacing: "-0.02em", color: "#ee6a2c" }}>Fogar</div>
        <div style={{ fontSize: titulo.length > 60 ? 60 : 72, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 1000 }}>{titulo}</div>
      </div>
    ),
    ogSize,
  );
}
