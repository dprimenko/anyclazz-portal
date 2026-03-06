#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = './src/assets/images/landing';

const images = [
  { input: 'hero.jpg', maxWidth: 1920 },
  { input: 'anyclazz-works-1.jpg', maxWidth: 1440 },
  { input: 'anyclazz-works-2.jpg', maxWidth: 1440 },
  { input: 'anyclazz-works-3.jpg', maxWidth: 1440 }
];

async function optimizeImages() {
  console.log('🎨 Optimizando imágenes...\n');

  for (const img of images) {
    const inputPath = path.join(imagesDir, img.input);
    const outputWebP = path.join(imagesDir, img.input.replace('.jpg', '.webp'));
    const outputJpg = path.join(imagesDir, img.input.replace('.jpg', '-optimized.jpg'));

    try {
      // Obtener información de la imagen original
      const originalStats = await fs.stat(inputPath);
      const originalSizeKB = (originalStats.size / 1024).toFixed(2);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);

      console.log(`📁 ${img.input}`);
      console.log(`   Tamaño original: ${originalSizeMB} MB (${originalSizeKB} KB)`);

      // Generar WebP con calidad 85%
      await sharp(inputPath)
        .resize(img.maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 85 })
        .toFile(outputWebP);

      const webpStats = await fs.stat(outputWebP);
      const webpSizeKB = (webpStats.size / 1024).toFixed(2);
      const webpSavings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

      console.log(`   ✅ WebP: ${webpSizeKB} KB (${webpSavings}% reducción)`);

      // Generar JPG optimizado con calidad 80%
      await sharp(inputPath)
        .resize(img.maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputJpg);

      const jpgStats = await fs.stat(outputJpg);
      const jpgSizeKB = (jpgStats.size / 1024).toFixed(2);
      const jpgSavings = ((1 - jpgStats.size / originalStats.size) * 100).toFixed(1);

      console.log(`   ✅ JPG optimizado: ${jpgSizeKB} KB (${jpgSavings}% reducción)\n`);

    } catch (error) {
      console.error(`   ❌ Error procesando ${img.input}:`, error.message);
    }
  }

  console.log('✨ Optimización completada!');
}

optimizeImages().catch(console.error);
