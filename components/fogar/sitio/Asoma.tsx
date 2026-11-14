"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/*
 * La cabecera de las subpáginas, pegada arriba: al bajar se esconde y al subir asoma, compacta y sobre noche translúcida.
 * Arriba del todo es la de siempre. No cambia de alto (sticky, en el flujo): nada salta. Con el foco dentro no se esconde.
 */
export function Asoma({ children }: { children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  const [lejos, setLejos] = useState(false);
  const [oculta, setOculta] = useState(false);

  useEffect(() => {
    const el = caja.current!;
    let antes = 0; // así, si la página llega ya bajada (recarga, #ancla), la primera mirada la esconde
    const mira = () => {
      const y = scrollY, alto = el.offsetHeight, d = y - antes;
      setLejos(y > 0);
      if (y <= alto) setOculta(false);
      else if (d > 6 && !el.contains(document.activeElement)) setOculta(true);
      else if (d < -6) setOculta(false);
      if (Math.abs(d) > 6 || y <= alto) antes = y;
    };
    const foco = () => setOculta(false);
    addEventListener("scroll", mira, { passive: true });
    el.addEventListener("focusin", foco);
    const raf = requestAnimationFrame(mira);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", mira); el.removeEventListener("focusin", foco); };
  }, []);

  return (
    <div ref={caja} data-lejos={lejos || undefined} data-oculta={oculta || undefined} className="f-asoma">
      {children}
    </div>
  );
}

/** Enlace de sección: `aria-current="page"` solo en la portada de la sección; dentro de ella (un artículo), "true". */
export function Seccion({ href, actual, children }: { href: "/fogar-tv" | "/diy"; actual: boolean; children: ReactNode }) {
  const ruta = usePathname();
  return (
    <Link href={href} aria-current={actual ? (ruta === href ? "page" : "true") : undefined} className={`f-enlace f-foco inline-flex min-h-11 items-center ${actual ? "text-[color:var(--hueso)]" : ""}`}>
      {children}
    </Link>
  );
}
