import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@monorepo/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@monorepo/auth-client': path.resolve(__dirname, '../../packages/auth-client/src/index.ts'),
    },
  },
  server: {
    port: 3002,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
