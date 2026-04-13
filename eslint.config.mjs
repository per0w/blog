import nextConfig from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  ...nextTypescript,
  {
    name: "per0w/readability",
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      // Ясность и предсказуемость
      eqeqeq: ["error", "smart"],
      curly: ["warn", "multi-line", "consistent"],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-nested-ternary": "warn",
      "prefer-const": "error",
      "object-shorthand": ["warn", "always"],
      "prefer-template": "warn",

      // Импорты: группы и пустые строки (plugin уже в eslint-config-next)
      "import/first": "error",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-dom", group: "external", position: "before" },
            { pattern: "next/**", group: "external", position: "before" },
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // TypeScript: единообразные type-imports
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "warn",

      // React: читаемые пропсы и ключи в списках
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: "last",
          reservedFirst: true,
          locale: "ru",
        },
      ],
    },
  },
];

export default eslintConfig;
