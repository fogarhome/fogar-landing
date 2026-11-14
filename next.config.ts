import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Nombres antiguos, directos a su destino final (inglés sin prefijo, español en /es).
      { source: "/:en(en)?/diy/como-esta-hecho-jota", destination: "/diy/como-esta-hecho-fogar", permanent: true },
      { source: "/es/diy/como-esta-hecho-jota", destination: "/es/diy/como-esta-hecho-fogar", permanent: true },
      { source: "/:en(en)?/jota-screen", destination: "/fogar-tv", permanent: true },
      { source: "/es/jota-screen", destination: "/es/fogar-tv", permanent: true },
      // Los fotogramas salieron de /lab: enlaces y cachés antiguos siguen funcionando.
      { source: "/lab/secuencia/v6/:path*", destination: "/media/secuencia/v6/:path*", permanent: true },
      // El laboratorio ya no se publica. Temporal (307) para poder volver a usar /lab sin redirecciones cacheadas en los navegadores.
      { source: "/lab/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      // La carpeta lleva versión: si cambian los fotogramas se crea v7, así que estos nunca cambian.
      { source: "/media/secuencia/v6/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default withNextIntl(nextConfig);
