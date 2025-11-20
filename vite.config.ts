import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env.API_KEY so the existing code works without changes.
    // In Vercel settings, you will name your variable "VITE_API_KEY".
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY'
  }
});
