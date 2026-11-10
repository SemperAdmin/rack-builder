// Flat config. Next 16 removed `next lint`, so ESLint runs directly.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Findings in existing code, surfaced the first time lint ran under
    // Next 16. Kept visible as warnings so this dependency upgrade does not
    // also rewrite component logic. Fix them, then delete this block.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
    "downloaded_ribbons/**",
  ]),
]);
