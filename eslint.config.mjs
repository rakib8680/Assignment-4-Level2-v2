import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      eqeqeq: "off",
      "no-unused-vars": "warn",
      "no-unused-expressions": "warn",
      "prefer-const": "error",
      "no-console": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/", "dist/", "**/config/"],
  },
];
