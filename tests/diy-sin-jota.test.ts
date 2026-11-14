import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICULOS } from "@/content/fogar/diy/registro";

// Todo se llama Fogar: ni en el fuente ni en lo que queda tras interpolar enlaces (REPOS, PROTOCOLO).
const raiz = path.resolve(__dirname, "..");
const dir = path.join(raiz, "content/fogar/diy");
const fuentes = [
  ...readdirSync(dir, { recursive: true, withFileTypes: true }).filter((f) => f.isFile()).map((f) => path.join(f.parentPath, f.name)),
  path.join(raiz, "messages/diy.es.json"),
  path.join(raiz, "messages/diy.en.json"),
];

describe("DIY sin Jota", () => {
  it.each(fuentes.map((f) => [path.relative(raiz, f), f]))("%s no nombra a Jota", (_, f) => {
    expect(readFileSync(f, "utf8")).not.toMatch(/jota/i);
  });

  it("el contenido resuelto tampoco", () => {
    const todo = JSON.stringify(ARTICULOS);
    expect(todo).not.toMatch(/jota/i);
    expect(todo).toContain("fogar-gateway");
  });

  it("«Cómo está hecho Fogar» tiene las mismas secciones en los dos idiomas y la de #casa (la landing enlaza ahí)", () => {
    const { es, en } = ARTICULOS.find((a) => a.meta.slug === "como-esta-hecho-fogar")!.contenido;
    const ids = (c: typeof es) => c!.secciones.map((s) => s.id);
    expect(ids(en)).toEqual(ids(es));
    expect(ids(es)).toContain("casa");
  });
});
