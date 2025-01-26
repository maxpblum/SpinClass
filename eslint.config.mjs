import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import jsdoc from "eslint-plugin-jsdoc";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { settings: { react: { version: "detect" } } },
  jsdoc.configs["flat/recommended-typescript"],
  {
    rules: {
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true, // only report exports
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: false,
          },
          contexts: [
            "ArrowFunctionExpression",
            "ClassDeclaration",
            "ClassExpression",
            "ClassProperty",
            "FunctionDeclaration", // function
            "FunctionExpression",
            "MethodDefinition",
            "TSDeclareFunction", // function without body
            "TSEnumDeclaration",
            "TSInterfaceDeclaration",
            "TSModuleDeclaration", // namespace
            "TSTypeAliasDeclaration",
            "VariableDeclaration",
          ],
        },
      ],
    },
  },
];
