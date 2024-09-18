/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "avoid",

  printWidth: 96,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
