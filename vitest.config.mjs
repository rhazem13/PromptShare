import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: {
    "@models": fileURLToPath(new URL("./models", import.meta.url)),
    "@utils": fileURLToPath(new URL("./utils", import.meta.url)),
  } },
  test: { environment: "node" },
});
