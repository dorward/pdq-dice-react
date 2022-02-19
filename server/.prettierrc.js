module.exports = {
	printWidth: 96,
	tabWidth: 4,
	trailingComma: 'all',
	singleQuote: true,
	semi: true,
	importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
};
