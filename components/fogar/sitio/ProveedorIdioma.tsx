"use client";

import type { ComponentProps } from "react";
import { NextIntlClientProvider } from "next-intl";

/** El proveedor de cliente tal cual: el de servidor lee la configuración de la petición (ver app/not-found.tsx). */
export function ProveedorIdioma(props: ComponentProps<typeof NextIntlClientProvider>) {
  return <NextIntlClientProvider {...props} />;
}
