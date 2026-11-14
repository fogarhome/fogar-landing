import type { ComponentType } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { diyRelacionados, fechaLarga, plantillaDe, type Entrada } from "@/content/fogar/diy";
import { INSTALL, PROTOCOLO, REPOS } from "@/lib/repos";
import { Casa } from "./Casa";
import { Comando } from "./Comando";
import { Datos } from "./Datos";
import { Escenario } from "./Escenario";
import { Hilo } from "./Hilo";
import "./diy.css";

// Markup fijo y propio (content/fogar/diy), no entrada de usuarios.
const Html = ({ html }: { html: string }) => <div className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
// Figuras del ecosistema Fogar, solo en la plantilla «escenario»: van donde la sección marca <!--figura-->.
const FIGURA: Record<string, ComponentType> = { resumen: Hilo, casa: Casa };

/**
 * /diy/[slug]: columna de lectura con un hilo en el margen que nace del titular e índice lateral de secciones.
 * Plantilla «escenario» (ecosistema Fogar): el lateral lleva además línea viva y mapa de piezas, y van las figuras.
 * `instalar` cierra con «Móntalo». Al final, «Sigue leyendo» si hay otros artículos en el mismo idioma.
 */
export async function Articulo({ e: { meta, c }, locale }: { e: Entrada; locale: string }) {
  const t = await getTranslations("diy.articulo");
  const td = await getTranslations("diy");
  const ti = await getTranslations("diy.indice.instala");
  const escenario = plantillaDe(meta) === "escenario";
  const items = c.secciones.map(({ id, toc }) => ({ id, toc }));
  const relacionados = diyRelacionados(locale, meta.slug);
  const puertas = [
    { href: `${REPOS.gateway}#readme`, label: t("montalo.readme") },
    { href: `${REPOS.voice}#readme`, label: t("montalo.voice") },
    { href: PROTOCOLO, label: t("montalo.protocolo") },
    { href: REPOS.wakeTrainer, label: t("montalo.wake") },
  ];

  return (
    <div className="diy">
      <Escenario items={items} mapa={escenario}>
        <article className="min-w-0">
          <nav aria-label={t("migas")} className="diy-migas">
            <ol>
              <li><Link href="/diy" className="f-enlace f-foco">DIY</Link></li>
              {/* el tema, sin enlace hasta que haya páginas de tema */}
              <li>{td(`temas.${meta.tema}`)}</li>
              <li aria-current="page">{c.meta.title}</li>
            </ol>
          </nav>
          <h1 id="texto" tabIndex={-1} className="mt-5 max-w-[22ch] font-display text-[clamp(34px,5vw,60px)] leading-[1.04] tracking-[-0.035em] text-[color:var(--hueso)] [text-wrap:balance]">
            {c.h1}
          </h1>

          <div className="diy-cuerpo">
            <Datos meta={meta} locale={locale} actualizado className="pt-6" />
            {meta.probado && (
              <details className="diy-desplegable mt-3 text-[14px] text-[color:var(--hueso-tenue)]">
                <summary className="f-foco inline-flex min-h-11 cursor-pointer items-center">
                  {t("probadoCon")}&nbsp;<span className="text-[color:var(--hueso-suave)]">{meta.probado[0]}</span>
                  {meta.probado.length > 1 && <>&nbsp;{t("piezasMas", { n: meta.probado.length - 1 })}</>}
                </summary>
                <ul className="mt-1 grid gap-1 pl-4 text-[color:var(--hueso-suave)]">{meta.probado.map((p) => <li key={p}>{p}</li>)}</ul>
              </details>
            )}

            <div className="diy-prosa mt-10">
              <p className="text-[20px] leading-[1.6] text-[color:var(--hueso)]">{c.lede}</p>
              {c.antes && <p dangerouslySetInnerHTML={{ __html: c.antes }} />}

              {c.secciones.map((s) => {
                const [antes, despues] = s.html.split("<!--figura-->");
                const Figura = escenario ? FIGURA[s.id] : undefined;
                return (
                  <section key={s.id} id={s.id} data-estado={s.estado ?? "rest"}>
                    <Html html={antes} />
                    {Figura && despues !== undefined && <Figura />}
                    {despues && <Html html={despues} />}
                  </section>
                );
              })}

              {meta.instalar && (
                <section id="montalo" data-estado="speak" aria-labelledby="montalo-h" className="diy-montalo">
                  <h2 id="montalo-h">{t("montalo.titulo")}</h2>
                  <p>{ti("cuerpo")}</p>
                  <Comando texto={INSTALL} copiar={ti("copiar")} copiado={ti("copiado")} />
                  <p className="requisitos">{ti("requisitos")}: {ti("linux")} {ti("openclaw")}</p>
                  <h3 className="puertas-h">{t("montalo.puertas")}</h3>
                  <ul className="puertas">
                    {puertas.map((p) => (
                      <li key={p.href}><a href={p.href} rel="noopener">{p.label}<span aria-hidden="true">→</span></a></li>
                    ))}
                  </ul>
                </section>
              )}

              {meta.tema === "fogar" && <p className="mt-12">{t.rich("queEs", { enlace: (txt) => <Link href="/">{txt}</Link> })}</p>}

              {relacionados.length > 0 && (
                <section aria-labelledby="sigue-h" className="diy-sigue">
                  <h2 id="sigue-h">{t("sigue")}</h2>
                  <ul className="puertas">
                    {relacionados.map((r) => (
                      <li key={r.meta.slug}><Link href={`/diy/${r.meta.slug}`}>{r.c.h1}<span aria-hidden="true">→</span></Link></li>
                    ))}
                  </ul>
                </section>
              )}

              <details className="diy-registro diy-desplegable">
                <summary className="f-foco">{t("registro")}</summary>
                <ul>
                  {c.registro.map(([iso, texto]) => <li key={iso}><time dateTime={iso}>{fechaLarga(locale, iso)}</time> · {texto}</li>)}
                </ul>
              </details>

              <p className="mt-10">
                <Link href="/diy" className="inline-flex min-h-11 items-center gap-2">
                  <span aria-hidden="true">←</span>{t("volver")}
                </Link>
              </p>
            </div>
          </div>
        </article>
      </Escenario>
    </div>
  );
}
