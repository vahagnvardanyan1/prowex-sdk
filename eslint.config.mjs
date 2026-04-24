import { dirname } from "path";
import { fileURLToPath } from "url";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "tests/"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Prettier
      "prettier/prettier": ["error", {}, { usePrettierrc: true }],

      // General quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: "error",
      curly: ["error", "multi-line"],
      "no-nested-ternary": "error",

      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // Import ordering
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          "newlines-between": "always",
        },
      ],
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
);
