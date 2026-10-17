import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.ts'],
        exclude: ['test/save-concurrency.test.ts'],
        mockReset: true,
        restoreMocks: true,
    },
});
