import { resolve } from 'node:path';
import fs from 'node:fs/promises';
import { defineConfig } from 'vite';

const demoInputs = await fs
  .readdir(resolve(__dirname, './src/demos'))
  .then((directories) =>
    Object.fromEntries(
      directories.map((directory) => [
        directory,
        `src/demos/${directory}/index.html`,
      ]),
    ),
  );

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...demoInputs,
      },
    },
    target: 'esnext',
  },
  esbuild: {
    minifyIdentifiers: false,
  },
  resolve: {
    // https://github.com/vitejs/vite/issues/88#issuecomment-784441588
    alias: {
      '#/assets': resolve(__dirname, 'assets'),
      '#': resolve(__dirname, 'src'),
    },
  },
});
