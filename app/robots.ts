import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/seo";

// Todo abierto, también a los rastreadores de IA.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITIO}/sitemap.xml` };
}
