// Sprint 1: configuracion de ESLint usando flat config nativo.
// Next.js 16 elimino "next lint"; ESLint se ejecuta directo via "eslint .".
// eslint-config-next expone sus presets ya adaptados a flat config
// (no se requiere FlatCompat en esta version).
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);
