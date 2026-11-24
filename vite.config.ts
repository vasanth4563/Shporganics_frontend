import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Original SHP Organics logo image (used exactly as uploaded, unedited in local env; SVG fallback for cloud builds)
const BRAND_LOGO_DIR = 'C:/Users/vasan/.gemini/antigravity/brain/12c3f357-223d-4149-a11d-89533bfe0029/.user_uploaded';
const localLogo = `${BRAND_LOGO_DIR}/media_1793905711535_5c379682.png`;
const hasLocalLogo = fs.existsSync(localLogo);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@brand-logo': hasLocalLogo ? localLogo : path.resolve(__dirname, 'src/assets/logo.svg'),
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' http: https: 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:;",
    },
    fs: {
      allow: hasLocalLogo ? ['.', BRAND_LOGO_DIR] : ['.'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    headers: {
      'Content-Security-Policy': "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' http: https: 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:;",
    },
  },
});
