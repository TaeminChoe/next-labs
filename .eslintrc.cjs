/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    // any/unused 끄기
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",

    // Next 관용 규칙(원하면 유지/삭제)
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": "off",
  },
  settings: {
    react: { version: "detect" },
  },
};
