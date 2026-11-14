"use client";

import { useEffect, useRef, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Cambiar [locale] remonta la página entera (y este botón): lo que hay que reponer al llegar vive fuera del componente.
let vuelta: { ancla: string; boton: number } | null = null;

/**
 * Cambia de idioma: la misma página en la URL del otro (inglés sin prefijo, español en /es).
 * `href`: adónde ir si esta página no existe en el otro idioma (un artículo sin traducir lleva al índice del DIY).
 */
export function Idioma({ className = "", href }: { className?: string; href?: string }) {
  const t = useTranslations("sitio");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pendiente, start] = useTransition();
  const otro = routing.locales.find((l) => l !== locale) ?? "es";
  const yo = useRef<HTMLButtonElement>(null);
  // Al llegar el idioma nuevo: el #ancla y el foco en el mismo botón. <html lang> lo pinta el layout de [locale].
  useEffect(() => {
    const v = vuelta, botones = [...document.querySelectorAll("button[data-idioma]")];
    if (!v || botones.indexOf(yo.current!) !== v.boton) return;
    vuelta = null;
    yo.current!.focus({ preventScroll: true });
    if (v.ancla) setTimeout(() => history.replaceState(history.state, "", v.ancla)); // después de que Next fije la URL
  }, [locale]);
  return (
    <button
      ref={yo} data-idioma type="button" lang={otro} aria-label={t("idioma")} aria-busy={pendiente || undefined}
      onClick={() => {
        if (pendiente) return; // sin `disabled`: desactivarlo le quitaba el foco al botón
        if (href) { start(() => router.push(href, { locale: otro })); return; } // otra página: arriba, sin ancla
        // Misma página y misma posición; el #ancla y el foco se reponen al llegar (efecto de arriba).
        vuelta = { ancla: location.hash, boton: [...document.querySelectorAll("button[data-idioma]")].indexOf(yo.current!) };
        start(() => router.replace(pathname, { locale: otro, scroll: false }));
      }}
      className={`f-enlace f-foco min-h-11 text-[14px] uppercase tracking-[0.08em] aria-busy:opacity-50 ${className}`}
    >
      {otro}
    </button>
  );
}
