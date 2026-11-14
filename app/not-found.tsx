import { getMessages } from "next-intl/server";
import { Documento } from "@/components/fogar/sitio/Documento";
import { NoEncontrada } from "@/components/fogar/sitio/NoEncontrada";
import { ProveedorIdioma } from "@/components/fogar/sitio/ProveedorIdioma";
import { routing } from "@/i18n/routing";
import { TIME_ZONE } from "@/i18n/request";

// Solo para lo que no pasa por el middleware (rutas con punto, p. ej. /x.php): todo lo demás llega a [locale]/not-found.
// Next pinta este 404 dentro de cada página, antes que su layout: nada aquí puede leer el idioma de la petición
// (ni setRequestLocale ni el proveedor de servidor de next-intl), o fijaría el inglés para la página entera.
export default async function GlobalNotFound() {
  const locale = routing.defaultLocale;
  return (
    <Documento lang={locale}>
      <ProveedorIdioma locale={locale} timeZone={TIME_ZONE} messages={await getMessages({ locale })}>
        <NoEncontrada />
      </ProveedorIdioma>
    </Documento>
  );
}
