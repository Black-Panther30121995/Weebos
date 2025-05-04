import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node, // Includes module, require, exports
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-restricted-globals": ["error", "name", "length"], // Your custom rule
      "quotes": ["error", "double", { allowTemplateLiterals: true }], // Double quotes
      "no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }], // Warn on unused vars
    },
  },
  {
    files: ["**/*.spec.*"],
    languageOptions: {
      globals: {
        ...globals.mocha, // Support Mocha for test files
      },
    },
  },
];