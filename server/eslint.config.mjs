import eslint from '@eslint/js';
import ts_eslint from 'typescript-eslint';

export default ts_eslint.config(
    eslint.configs.recommended,
    ts_eslint.configs.recommended,
    { ignores: ['dist/', 'jest.config.js', 'webpack.config.js', '.prettierrc.js'] },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
);
