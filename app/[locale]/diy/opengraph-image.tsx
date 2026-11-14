import { getTranslations } from "next-intl/server";
import { ogImagen } from "@/lib/og";
import { routing } from "@/i18n/routing";

export { ogSize as size, ogContentType as contentType } from "@/lib/og";
// Sin esto la imagen se genera en cada petición (ƒ); así sale en el build, una por idioma.
export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));
export const alt = "Fogar DIY";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "diy.indice.meta" });
  return ogImagen(t("title"));
}
