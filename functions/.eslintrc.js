module.exports = {
  env: {
    node: true, // Enable Node.js globals (module, require, exports)
    es2021: true, // Support ES2021 syntax
  },
  parserOptions: {
    ecmaVersion: 2021, // Support ES2021
    sourceType: "module", // Treat files as ES modules
  },
  extends: [
    "eslint:recommended", // Standard ESLint rules
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"], // Keep your custom rule
    "quotes": ["error", "double", { allowTemplateLiterals: true }], // Enforce double quotes
    "no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }], // Warn on unused variables
    "prefer-arrow-callback": "off", // Allow regular functions
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true, // Support Mocha for test files
      },
      rules: {},
    },
  ],
};