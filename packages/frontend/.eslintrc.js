module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'sort-imports-es6-autofix'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	rules: {
		'no-duplicate-imports': 'error',
		'sort-imports-es6-autofix/sort-imports-es6': [
			2,
			{
				ignoreCase: false,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
			},
		],
		'@typescript-eslint/explicit-module-boundary-types': 0,
	},
};
