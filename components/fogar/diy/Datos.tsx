import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { fechaCorta, type Meta } from "@/content/fogar/diy";
import { esNueva } from "@/content/fogar/diy/nuevo";

/** La línea de datos de un artículo (ficha, lista y cabecera del artículo). Todo sale del meta; los textos, de messages. */
export async function Datos({ meta, locale, tema = false, actualizado = false, nuevo = false, className = "" }: {
  meta: Meta; locale: string; tema?: boolean; actualizado?: boolean; nuevo?: boolean; className?: string;
}) {
  const t = await getTranslations("diy");
  const partes = [
    <span key="tipo" className="text-[color:var(--hueso)]">{t(`tipos.${meta.tipo}`)}</span>,
    tema && <span key="tema">{t(`temas.${meta.tema}`)}</span>,
    <span key="autor">{t(`autores.${meta.autor}`)}</span>,
    <time key="pub" dateTime={meta.publicado}>{fechaCorta(locale, meta.publicado)}</time>,
    actualizado && meta.actualizado !== meta.publicado && (
      <time key="act" dateTime={meta.actualizado}>{t("articulo.actualizado", { fecha: fechaCorta(locale, meta.actualizado) })}</time>
    ),
    <span key="min">{t("minutos", { n: meta.minutos })}</span>,
    <span key="dif">{t(`dificultades.${meta.dificultad}`)}</span>,
  ].filter(Boolean);

  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[color:var(--hueso-tenue)] ${className}`}>
      {nuevo && esNueva(meta.publicado) && (
        <span className="rounded-full bg-[color:var(--hueso)] px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[color:var(--noche)]">{t("nuevo")}</span>
      )}
      {partes.map((p, i) => <Fragment key={i}>{i > 0 && <span aria-hidden="true">·</span>}{p}</Fragment>)}
    </p>
  );
}
