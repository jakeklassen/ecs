import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        basic: resolve(__dirname, 'src/demos/basic/index.html'),
        bouncyRectangles: resolve(
          __dirname,
          'src/demos/bouncy-rectangles/index.html',
        ),
      },
    },
  },
  resolve: {
    // https://github.com/vitejs/vite/issues/88#issuecomment-784441588
    alias: {
      '#': resolve(__dirname, 'src'),
    },
  },
});
