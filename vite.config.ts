import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/deployment-notifier/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
