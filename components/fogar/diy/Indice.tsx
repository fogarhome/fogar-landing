import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { diyEntradas, plantillaDe } from "@/content/fogar/diy";
import { INSTALL, REPOS } from "@/lib/repos";
import { Comando } from "./Comando";
import { Datos } from "./Datos";
import { Ficha } from "./Ficha";
import "./diy.css";

/**
 * Portada de /diy: el artículo más nuevo como destacado, una tarjeta pequeña para instalar Fogar y el resto en lista densa.
 * Sin filtros ni paginación todavía.
 */
export async function Indice({ locale }: { locale: string }) {
  const t = await getTranslations("diy.indice");
  const td = await getTranslations("diy");
  const hilo = (await getTranslations("diy.articulo.hilo")).raw("nodos") as { n: string }[];
  const [destacada, ...resto] = diyEntradas(locale);
  const fila = "grid grid-cols-[9.5rem_minmax(0,1fr)] gap-4 border-t border-[color:var(--veta)] py-3";

  return (
    <div className="diy f-ancho pb-24 pt-10 md:pt-16">
      <div>
        <p className="text-[15px] text-[color:var(--hueso-tenue)]">{t("seccion")}</p>
        <h1 id="contenido" tabIndex={-1} className="mt-4 max-w-[18ch] font-display text-[clamp(36px,6.4vw,84px)] leading-[1.02] tracking-[-0.035em] text-[color:var(--hueso)] [text-wrap:balance] md:mt-5">
          {t("h1")}
        </h1>
        <p className="mt-5 max-w-[50ch] text-[18px] leading-[1.5] text-[color:var(--hueso-suave)] md:mt-7 md:text-[19px]">{t("lede")}</p>
      </div>

      <section aria-labelledby="entradas" className="mt-8 md:mt-14">
        <h2 id="entradas" className="text-[13px] text-[color:var(--hueso-tenue)]">{t("entradas")}</h2>
        {destacada && (
          // los nodos del hilo (cliente, gateway, orquestador) solo para artículos del ecosistema Fogar
          <Ficha portada={destacada.meta.portada} nodos={plantillaDe(destacada.meta) === "escenario" ? [hilo[0].n, hilo[1].n, hilo[3].n] : []}>
            <div className="flex flex-col">
              <Datos meta={destacada.meta} locale={locale} tema nuevo />
              <h3 className="mt-3 font-display text-[clamp(24px,2.8vw,34px)] leading-[1.12] tracking-[-0.035em] text-[color:var(--hueso)] [text-wrap:balance]">
                <Link href={`/diy/${destacada.meta.slug}`} className="f-foco after:absolute after:inset-0 after:content-['']">{destacada.c.h1}</Link>
              </h3>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.55] text-[color:var(--hueso-suave)]">{destacada.c.meta.description}</p>
              <dl className="mt-7 text-[14px] leading-[1.5]">
                <div className={fila}><dt className="text-[color:var(--hueso-tenue)]">{t("filas.estado")}</dt><dd>{td(`estados.${destacada.meta.estado}`)}</dd></div>
                {destacada.c.montar && <div className={fila}><dt className="text-[color:var(--hueso-tenue)]">{t("filas.montar")}</dt><dd>{destacada.c.montar}</dd></div>}
              </dl>
              {destacada.meta.probado && (
                // encima del enlace que cubre la ficha, para poder abrirlo
                <details className="diy-desplegable relative z-10 border-t border-[color:var(--veta)] text-[14px] text-[color:var(--hueso-tenue)]">
                  <summary className="f-foco inline-flex min-h-11 cursor-pointer items-center">{t("filas.probado")}&nbsp;<span className="text-[color:var(--hueso-suave)]">{destacada.meta.probado[0]}</span></summary>
                  <ul className="grid gap-0.5 pb-3 pl-4 text-[color:var(--hueso-suave)]">{destacada.meta.probado.map((p) => <li key={p}>{p}</li>)}</ul>
                </details>
              )}
              <span className="leer mt-6 inline-flex items-center gap-2 text-[15px] text-[color:var(--hueso)]" aria-hidden="true">
                {t("leer")} <span className="flecha">→</span>
              </span>
            </div>
          </Ficha>
        )}
      </section>

      <section aria-labelledby="instala" className="diy-instala mt-14">
        <h2 id="instala" className="font-display text-[22px] leading-[1.15] tracking-[-0.035em] text-[color:var(--hueso)]">{t("instala.titulo")}</h2>
        <p className="mt-2 text-[15px] leading-[1.5] text-[color:var(--hueso-suave)]">{t("instala.cuerpo")}</p>
        <Comando texto={INSTALL} copiar={t("instala.copiar")} copiado={t("instala.copiado")} />
        <p className="mt-4 text-[14px] leading-[1.5] text-[color:var(--hueso-tenue)]">{t("instala.requisitos")}: {t("instala.linux")} {t("instala.openclaw")}</p>
        <p className="mt-3 text-[14px]">
          <a href={`${REPOS.gateway}#readme`} className="f-enlace f-foco inline-flex min-h-11 items-center text-[color:var(--hueso-suave)]">{t("instala.readme")}</a>
        </p>
      </section>

      {resto.length > 0 && (
        <section aria-labelledby="mas" className="mt-16">
          <h2 id="mas" className="text-[13px] text-[color:var(--hueso-tenue)]">{t("mas")}</h2>
          <ul className="diy-lista mt-3">
            {resto.map(({ meta, c }) => (
              <li key={meta.slug}>
                <Datos meta={meta} locale={locale} tema nuevo className="text-[13px]" />
                <h3><Link href={`/diy/${meta.slug}`} className="f-foco">{c.h1}</Link></h3>
                <p className="resumen">{c.meta.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-14 grid gap-2 border-t border-[color:var(--veta)] pt-6 text-[16px] leading-[1.55] text-[color:var(--hueso-suave)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20">
        <strong className="font-semibold text-[color:var(--hueso)]">{t("regla.titulo")}</strong>
        <span className="max-w-[52ch]">{t("regla.cuerpo")}</span>
      </p>
    </div>
  );
}
