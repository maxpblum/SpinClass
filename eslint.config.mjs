import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

const reactSettings = pluginReact.configs.flat.recommended;
reactSettings.settings = { react: { version: "detect" } };

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  reactSettings,
];
