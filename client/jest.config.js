/** @type {import('ts-jest').JestConfigWithTsJest} */
/* eslint-env node */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'test.tsx?': [
			'ts-jest',
			{
				/* ts-jest config goes here in Jest */
			},
		],
	},
	// globals: {
	// 	'ts-jest': {
	// 		tsconfig: './tsconfig.jest.json',
	// 	},
	// },
};
