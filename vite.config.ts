import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**'],
    },
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['tailwind.config.js'],
  },
  resolve: {
    alias: {
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },

  plugins: [solidPlugin({ typescript: { onlyRemoveTypeImports: true } })],
  server: {
    host: true,
    port: 8080,
  },
});
