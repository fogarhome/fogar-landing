import type { ReactNode } from "react";
import { Figtree, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], display: "swap" });

/** <html> y <body> del sitio. Lo pinta el layout de [locale] (lang sin JS) y el 404 de fuera de idioma. */
export function Documento({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang} className={`${unbounded.variable} ${figtree.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
