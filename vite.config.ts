import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Original SHP Organics logo image (used exactly as uploaded, unedited in local env; SVG fallback for cloud builds)
const BRAND_LOGO_DIR = 'C:/Users/vasan/.gemini/antigravity/brain/12c3f357-223d-4149-a11d-89533bfe0029/.user_uploaded';
const localLogo = `${BRAND_LOGO_DIR}/media_1793905711535_5c379682.png`;
const hasLocalLogo = fs.existsSync(localLogo);

// User-uploaded login hero image (sweets on silver plate)
const USER_HERO_DIR = 'C:/Users/vasan/.gemini/antigravity/brain/af8c94f3-31d8-4fb5-b7d3-dec0719fb76c/.user_uploaded';
const localHero = `${USER_HERO_DIR}/media_1795504831913_9a992432.jpg`;
const destHeroAsset = path.resolve(__dirname, 'src/assets/login-hero.jpg');
const destHeroPublic = path.resolve(__dirname, 'public/login-hero.jpg');

if (fs.existsSync(localHero)) {
  try {
    const assetsDir = path.resolve(__dirname, 'src/assets');
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
    if (!fs.existsSync(destHeroAsset)) fs.copyFileSync(localHero, destHeroAsset);

    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(destHeroPublic)) fs.copyFileSync(localHero, destHeroPublic);
  } catch (err) {
    console.error('Failed to copy login hero image:', err);
  }
}

const hasHero = fs.existsSync(destHeroAsset) || fs.existsSync(localHero);
const heroPath = fs.existsSync(destHeroAsset) ? destHeroAsset : localHero;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@brand-logo': hasLocalLogo ? localLogo : path.resolve(__dirname, 'src/assets/logo.svg'),
      '@login-hero': hasHero ? heroPath : path.resolve(__dirname, 'src/assets/logo.svg'),
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' http: https: 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:;",
    },
    fs: {
      allow: [
        '.',
        ...(hasLocalLogo ? [BRAND_LOGO_DIR] : []),
        ...(fs.existsSync(localHero) ? [USER_HERO_DIR] : []),
      ],
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
