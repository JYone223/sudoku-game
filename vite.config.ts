import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      // emitFile: true,
      // filename: "stats.html",
      open: true, // 打包后自动打开页面
      gzipSize: true, // 查看 gzip 压缩大小
      brotliSize: true, // 查看 brotli 压缩大小
    }),
  ],
});
