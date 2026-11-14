import type { ReactNode } from "react";

// <html> lo pinta app/[locale]/layout.tsx con el idioma de la URL (patrón de next-intl): así no hace falta leer
// cabeceras y las páginas se generan estáticas. Este layout existe porque lo pide app/not-found.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
