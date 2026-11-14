import { diyEntradas } from "@/content/fogar/diy";
import { routing } from "@/i18n/routing";
import { urlDe } from "@/lib/seo";

export const dynamic = "force-static";

/** llms.txt (llmstxt.org): qué es Fogar y sus páginas públicas, en texto plano, en los dos idiomas. */
export function GET() {
  const seccion = (locale: string, titulo: string, paginas: [string, string][]) => [
    `## ${titulo}`, "",
    ...paginas.map(([nombre, href]) => `- [${nombre}](${urlDe(locale, href)})`),
    ...diyEntradas(locale).map((e) => `- [${e.c.h1}](${urlDe(locale, `/diy/${e.meta.slug}`)}): ${e.c.meta.description}`),
    "",
  ];
  const texto = [
    "# Fogar", "",
    "> Fogar is an open-source AI voice assistant for your home: a gateway that connects your voice clients, your TV and your smart home, built from open pieces you choose.", "",
    ...seccion(routing.defaultLocale, "English", [["Home", "/"], ["Fogar TV", "/fogar-tv"], ["DIY", "/diy"]]),
    ...seccion("es", "Español", [["Inicio", "/"], ["Fogar TV", "/fogar-tv"], ["DIY", "/diy"]]),
  ].join("\n");
  return new Response(texto, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
