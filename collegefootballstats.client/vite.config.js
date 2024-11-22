import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '^/api/.*': {
                target: 'https://localhost:7161/',
                secure: false,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        port: 5173
    },
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.jsx?$/
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            }
        }
    }
});