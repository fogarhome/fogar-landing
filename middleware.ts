import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Aplica a todo excepto API, _next, _vercel, archivos con extensión y las imágenes de opengraph-image.tsx
    // (Next las publica con el idioma en la ruta, también /en/…: sin esto, as-needed las redirigiría).
    "/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)",
  ],
};
