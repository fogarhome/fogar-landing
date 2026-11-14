"use client";

// Cliente para tomar el idioma del NextIntlClientProvider: en el 404 de [locale] los componentes de servidor no lo
// conocen (Next pinta not-found sin params y antes que el layout) y saldrían siempre en inglés.
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Cabecera } from "./Cabecera";
import { Pie } from "./Pie";

/** Página 404 del sitio, en el idioma de la URL, con salidas a las tres secciones. */
export function NoEncontrada() {
  const t = useTranslations("sitio");
  const enlace = "f-enlace f-foco inline-flex min-h-11 items-center";
  return (
    <>
      <Cabecera />
      <main className="f-ancho flex-1 py-24 md:py-36">
        <p className="font-display text-[15px] uppercase tracking-[0.08em] text-[color:var(--hueso-suave)]">404</p>
        <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(36px,6.4vw,84px)] leading-[1.02] tracking-[-0.035em] text-[color:var(--hueso)] [text-wrap:balance]">
          {t("noEncontrada.titulo")}
        </h1>
        <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.5] text-[color:var(--hueso-suave)]">{t("noEncontrada.texto")}</p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-1 text-[17px]">
          <li><Link href="/" className={enlace}>{t("nav.inicio")}</Link></li>
          <li><Link href="/diy" className={enlace}>{t("nav.diy")}</Link></li>
          <li><Link href="/fogar-tv" className={enlace}>{t("nav.tv")}</Link></li>
        </ul>
      </main>
      <Pie />
    </>
  );
}
