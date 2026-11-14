import { defineRouting } from "next-intl/routing";

// Cada URL sirve un solo idioma (inglés sin prefijo, español en /es): lo que ve Googlebot es lo que ve cualquiera.
// Sin detección ni cookie: el idioma solo cambia con el selector, que cambia de URL. Las hreflang van en la metadata
// de cada página (un artículo puede no existir en los dos idiomas), no en la cabecera Link del middleware.
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
