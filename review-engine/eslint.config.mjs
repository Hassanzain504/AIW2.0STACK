import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

/*
 * eslint-config-next 16 ships flat config arrays, so they are spread directly.
 * The FlatCompat bridge the older apps in this stack use throws on this
 * version pairing.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  { ignores: [".next/**", "node_modules/**"] },
]

export default eslintConfig
