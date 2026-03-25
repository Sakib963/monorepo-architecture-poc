import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@poc/types':         resolve(__dirname, '../../packages/types/src/index.ts'),
      '@poc/validators':    resolve(__dirname, '../../packages/validators/src/index.ts'),
      '@poc/events':        resolve(__dirname, '../../packages/events/src/index.ts'),
      '@poc/feature-flags': resolve(__dirname, '../../packages/feature-flags/src/index.ts'),
      '@poc/api-client':    resolve(__dirname, '../../packages/api-client/src/index.ts'),
      '@poc/ui-components/react': resolve(__dirname, '../../packages/ui-components/src/react.tsx'),
      '@poc/ui-components/shared-elements': resolve(__dirname, '../../packages/ui-components/src/shared-elements.ts'),
      '@poc/ui-components': resolve(__dirname, '../../packages/ui-components/src/index.ts'),
      '@poc/config':        resolve(__dirname, '../../packages/config/src/index.ts'),
    },
  },
  server: {
    port: 4201,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
    },
  },
});
