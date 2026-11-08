import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /retrace-app/, so assets must use that base path.
export default defineConfig({
  base: '/retrace-app/',
  plugins: [react()],
});
