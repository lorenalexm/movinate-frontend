import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,vue}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			globals: globals.browser
		},
		rules: {
			indent: ["error", "tab"],
			"no-mixed-spaces-and-tabs": "error",
			curly: ["error", "all"],
			quotes: ["error", "double"]
		}
	},
	pluginVue.configs["flat/essential"],
	{
		files: ["**/*.css"],
		plugins: { css },
		language: "css/css",
		extends: ["css/recommended"]
	},
]);
