import eslint from "@eslint/js";
import typeScriptLint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default typeScriptLint.config(
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...typeScriptLint.configs.recommended
  //   eslintConfigPrettier
);
