import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier"; // ✅ 추가!

export default defineConfig([
  {
    ignores: ["**/node_modules/**", "**/.meteor/local/**", "**/.deploy/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      js,
      prettier: prettierPlugin, // ✅ 여기에 등록
    },
    extends: ["js/recommended"],
    rules: {
      quotes: ["error", "double"], // ✅ double quote 강제
      semi: ["error", "always"], // ✅ 세미콜론 강제
      "prettier/prettier": "error", // ✅ Prettier 에러 ESLint에서 표시
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettier, // ✅ prettier와 충돌하는 룰 제거
]);
