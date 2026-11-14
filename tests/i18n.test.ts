import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing", () => {
  it("declares English and Spanish as supported locales", () => {
    expect(routing.locales).toEqual(["en", "es"]);
  });

  it("defaults to English", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("serves one language per URL: English unprefixed, Spanish under /es, no detection", () => {
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.localeDetection).toBe(false);
  });
});
