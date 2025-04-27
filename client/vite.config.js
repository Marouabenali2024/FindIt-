import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Forward requests to the backend
    },
  },
  build: {
    sourcemap: mode === 'development', // Enable source maps only in development
  },

  optimizeDeps: {
    exclude: [
      'chunk-RLJ2RCJQ', // Exclude these problematic chunks
      'chunk-DC5AMYBS',
      'chunk-KDCVS43I',
      'chunk-S725DACQ',
    ],
  },
}));

// console.log('NODE_ENV:', process.env.NODE_ENV);
