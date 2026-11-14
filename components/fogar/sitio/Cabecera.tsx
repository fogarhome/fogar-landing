"use client";

// Cliente para salir en el idioma correcto también dentro del 404 (ver NoEncontrada).
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Asoma, Seccion } from "./Asoma";
import { Idioma } from "./Idioma";
import { Logo } from "./Logo";

/**
 * Cabecera de las subpáginas (la portada no lleva: es la sala). `actual` marca la sección en la que se está;
 * `idiomaHref`, adónde lleva el selector si la página no existe en el otro idioma.
 */
export function Cabecera({ actual, idiomaHref }: { actual?: "tv" | "diy"; idiomaHref?: string }) {
  const t = useTranslations("sitio");
  const item = (href: "/fogar-tv" | "/diy", k: "tv" | "diy") => (
    <li><Seccion href={href} actual={actual === k}>{t(`nav.${k}`)}</Seccion></li>
  );
  return (
    <Asoma>
      <header className="f-ancho flex items-center justify-between gap-6 py-4">
        <Link href="/" aria-label={t("marca")} className="f-foco inline-flex min-h-11 min-w-11 items-center text-[color:var(--hueso)]"><Logo /></Link>
        <nav aria-label={t("nav.label")}>
          <ul className="flex items-center gap-6 text-[15px] text-[color:var(--hueso-suave)]">
            {item("/fogar-tv", "tv")}
            {item("/diy", "diy")}
            <li><Idioma href={idiomaHref} /></li>
          </ul>
        </nav>
      </header>
    </Asoma>
  );
}
