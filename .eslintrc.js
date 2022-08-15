module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "plugin:react/jsx-runtime"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "sort-imports-es6-autofix",
    "prettier",
    "import",
  ],
  rules: {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".js", ".jsx", ".tsx"] },
    ],
    "sort-imports-es6-autofix/sort-imports-es6": [
      "error",
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-var": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
    "import/no-duplicates": ["error", { considerQueryString: true }],
    "no-console": "off",
  },
  settings: {
    react: {
      version: "18",
    },
  },
}
