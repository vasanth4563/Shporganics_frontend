import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const destLogoPng = path.resolve(__dirname, 'src/assets/logo.png');
const destLogoSvg = path.resolve(__dirname, 'src/assets/logo.svg');
const resolvedBrandLogo = fs.existsSync(destLogoPng) ? destLogoPng : destLogoSvg;

const destHeroAsset = path.resolve(__dirname, 'src/assets/login-hero.jpg');
const resolvedHero = fs.existsSync(destHeroAsset) ? destHeroAsset : destLogoSvg;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@brand-logo': resolvedBrandLogo,
      '@login-hero': resolvedHero,
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' http: https: 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:;",
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
