import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), ['VITE_', 'API_URL']);

    return {
        plugins: [react()],
        // Keep existing .env files and Docker API_URL settings working.
        define: {
            'import.meta.env.VITE_API_URL': JSON.stringify(
                process.env.VITE_API_URL ??
                    env.VITE_API_URL ??
                    process.env.API_URL ??
                    env.API_URL ??
                    '/api/',
            ),
        },
        server: {
            port: 5100,
            strictPort: true,
            watch: {
                usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
            },
        },
    };
});
