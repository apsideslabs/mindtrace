import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Relative base so the static build works from any path (GitHub Pages project site included).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep the (large, rarely changing) content library and vendor code in their
        // own chunks so app-code edits don't invalidate them, and vice versa.
        // Note: @xyflow/dagre are deliberately NOT grouped, so the lazy map chunk
        // stays lazy instead of being pulled into an eager vendor chunk.
        manualChunks(id) {
          if (id.includes('/src/content/')) return 'content';
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion';
          return undefined;
        },
      },
    },
  },
});
