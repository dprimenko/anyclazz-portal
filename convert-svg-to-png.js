#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgDir = './src/assets/images/landing';

const svgFiles = [
  { input: 'booking-preview-1.svg', maxWidth: 800 },
  { input: 'booking-preview-2.svg', maxWidth: 800 },
  { input: 'growing-preview.svg', maxWidth: 1200 }
];

async function convertSvgToPng() {
  for (const file of svgFiles) {
    const inputPath = path.join(svgDir, file.input);
    const outputPng = path.join(svgDir, file.input.replace('.svg', '.png'));

    try {
      // Obtener información del SVG original
      const originalStats = await fs.stat(inputPath);
      const originalSizeKB = (originalStats.size / 1024).toFixed(2);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);

      // Convertir SVG a PNG con transparencia
      await sharp(inputPath, { density: 300 })
        .resize(file.maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .png({ 
          quality: 90,
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: false // Mantener canal alpha para transparencia
        })
        .toFile(outputPng);

      const pngStats = await fs.stat(outputPng);
      const pngSizeKB = (pngStats.size / 1024).toFixed(2);
      const pngSizeMB = (pngStats.size / (1024 * 1024)).toFixed(2);
      
      const comparison = originalStats.size > pngStats.size ? 'reducción' : 'aumento';
      const difference = Math.abs(((pngStats.size - originalStats.size) / originalStats.size) * 100).toFixed(1);
    } catch (error) {
      console.error(`   ❌ Error procesando ${file.input}:`, error.message);
    }
  }

  // Intentar optimizar adicionalmente con pngquant si está instalado
  try {
    const { execSync } = await import('child_process');
    
    for (const file of svgFiles) {
      const pngPath = path.join(svgDir, file.input.replace('.svg', '.png'));
      const pngOptPath = path.join(svgDir, file.input.replace('.svg', '-optimized.png'));
      
      try {
        console.log(`🔧 Optimizando ${file.input.replace('.svg', '.png')}...`);
        
        // Copiar primero para que pngquant no sobrescriba
        execSync(`cp "${pngPath}" "${pngOptPath}"`);
        
        // Intentar optimizar con pngquant (si está instalado)
        execSync(`pngquant --quality=80-95 --force --output "${pngOptPath}" "${pngOptPath}" 2>/dev/null || echo "pngquant no disponible, usando versión de sharp"`, {
          stdio: 'inherit'
        });
        
        const optStats = await fs.stat(pngOptPath);
        const origStats = await fs.stat(pngPath);
        const savings = ((1 - optStats.size / origStats.size) * 100).toFixed(1);
        
        console.log(`   ✅ ${(optStats.size / 1024).toFixed(2)} KB (${savings}% adicional)\n`);
      } catch (err) {
        // Si falla pngquant, solo usar la versión de sharp
        console.log(`   ℹ️  Usando versión de sharp (pngquant no disponible)\n`);
      }
    }
  } catch (err) {
    console.log('ℹ️  Optimización adicional omitida (solo sharp)');
  }

  console.log('\n✨ ¡Proceso completado!');
}

convertSvgToPng().catch(console.error);
