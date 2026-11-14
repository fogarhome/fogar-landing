import { notFound } from "next/navigation";

// Cualquier ruta que no exista dentro de un idioma cae aquí para pintar app/[locale]/not-found.tsx (patrón de next-intl).
export default function CatchAll() {
  notFound();
}
