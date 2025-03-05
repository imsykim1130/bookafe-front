import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vitest/config';

const options = {
  key: fs.readFileSync('./cert/localhost-key.pem'),
  cert: fs.readFileSync('./cert/localhost.pem'),
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '/src/test/setup.ts',
  },
  server: {
    https: options,
  },
});
