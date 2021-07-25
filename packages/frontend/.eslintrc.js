module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'sort-imports-es6-autofix'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	rules: {
		// 'sort-imports': [
		// 	'error',
		// 	{
		// 		ignoreCase: false,
		// 		ignoreDeclarationSort: false,
		// 		ignoreMemberSort: false,
		// 		memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
		// 		allowSeparatedGroups: false,
		// 	},
		// ],
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
