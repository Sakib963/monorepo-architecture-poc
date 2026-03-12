import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@monorepo/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@monorepo/auth-client': path.resolve(__dirname, '../../packages/auth-client/src/index.ts'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
