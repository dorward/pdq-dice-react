// import eslint from "@eslint/js";
// import tseslint from "typescript-eslint";
// // import eslintConfigPrettier from "eslint-config-prettier";
// // import importPlugin from "eslint-plugin-import";

// export default tseslint.config(
//   // {
//   //   files: ["**/*.ts", "**/*.tsx"],
//   // },
//   eslint.configs.recommended,
//   tseslint.configs.recommended
//   // importPlugin.flatConfigs.recommended,
//   // eslintConfigPrettier,
//   // {
//   //   files: ["**/*.ts", "**/*.tsx"],

//   //   rules: {
//   //     "no-var": "error",
//   //   },
//   // }
// );

import eslint from '@eslint/js';
import ts_eslint from 'typescript-eslint';

export default ts_eslint.config(eslint.configs.recommended, ts_eslint.configs.recommended, {
    ignores: ['dist/', 'jest.config.js', 'webpack.config.js', '.prettierrc.js'],
});
