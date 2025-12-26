module.exports = {
  root: true,
  extends: [
    "expo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-native",
    "prettier",
  ],
  env: {
    "react-native/react-native": true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Prettier
    "prettier/prettier": "error",

    // TypeScript
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",

    // React
    "react/react-in-jsx-scope": "off", // React 17+
    "react/prop-types": "off", // TypeScript já faz isso
    "react/display-name": "off",
    "react/no-unescaped-entities": "warn",

    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React Native
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "off", // Permitir inline para temas dinâmicos
    "react-native/no-color-literals": "off", // Permitir cores literais
    "react-native/no-raw-text": "off",

    // Geral
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
  },
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "android/",
    "ios/",
    "dist/",
    "build/",
  ],
};
