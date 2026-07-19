// Sprint 0: configuracion minima de ESLint.
// No se agregan reglas de negocio ni overrides especificos aun.
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
];
