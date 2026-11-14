# fogar-landing

La web de Fogar: Next 16, React 19, Tailwind 4 y next-intl (inglés en `/`, español en `/es`).

```bash
pnpm install
pnpm dev
pnpm test
```

- `app/[locale]/`: la página pública.
- `public/media/secuencia/v6/`: fotogramas de la escena de la portada (si cambian, van a una carpeta `v7`: se sirven con caché inmutable).
- `app/fogar-tokens.css`: copia de los tokens de `fogar-brand`; no se edita aquí.

Specs, decisiones y estado del proyecto están en el vault de Obsidian, no en este repo.
