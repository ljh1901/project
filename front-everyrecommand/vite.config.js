import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: Number(env.FRONTEND_DEV_PORT || 5446),
      strictPort: true,
      proxy: {
        '/api': {
          target: env.BACKEND_PROXY_TARGET || `http://127.0.0.1:${env.SERVER_PORT || 8081}`,
          changeOrigin: true,
        },
      },
    },
  };
});
