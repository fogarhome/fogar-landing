import { notFound } from "next/navigation";
import { diyArticulo, diySlugs } from "@/content/fogar/diy";
import { routing } from "@/i18n/routing";
import { ogImagen } from "@/lib/og";

export { ogSize as size, ogContentType as contentType } from "@/lib/og";
// Una imagen por artículo e idioma, generada en el build.
export const generateStaticParams = () => routing.locales.flatMap((locale) => diySlugs(locale).map((slug) => ({ locale, slug })));
export const alt = "Fogar DIY";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const e = diyArticulo(locale, slug);
  if (!e) notFound();
  return ogImagen(e.c.h1);
}
