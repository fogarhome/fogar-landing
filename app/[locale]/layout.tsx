import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITIO } from "@/lib/seo";
import { Documento } from "@/components/fogar/sitio/Documento";

// Solo en y es: cualquier otro primer segmento (p. ej. /x.php, que no pasa por el middleware) es 404 sin generarse.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Solo lo común: canonical, hreflang y openGraph los pone cada página (aquí los heredarían el 404 y [...rest]).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    metadataBase: new URL(SITIO),
    title: { default: t("title"), template: "%s · Fogar" },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <Documento lang={locale}>
      <NextIntlClientProvider messages={await getMessages()}>{children}</NextIntlClientProvider>
    </Documento>
  );
}
