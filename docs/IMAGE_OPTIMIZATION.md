# Optimización de Imágenes - AnyClazz Portal

## Resumen de Resultados

### Imágenes del Landing Page

Se optimizaron 4 imágenes del landing con reducciones significativas de peso:

| Imagen | Original | WebP | JPG Optimizado | Reducción WebP |
|--------|----------|------|----------------|----------------|
| hero.jpg | 7.7 MB | 196 KB | 272 KB | 97.5% |
| anyclazz-works-1.jpg | 8.7 MB | 156 KB | 184 KB | 98.3% |
| anyclazz-works-2.jpg | 8.1 MB | 88 KB | 116 KB | 99.0% |
| anyclazz-works-3.jpg | 5.3 MB | 80 KB | 148 KB | 98.6% |

**Total:** ~30 MB → ~520 KB (WebP) o ~720 KB (JPG optimizado)

**Reducción global:** 98.3% con WebP

## Implementación

### Componentes Actualizados

1. **Hero.tsx** - Usa `hero.webp` con fallback a `hero-optimized.jpg`
2. **SectionWorks.tsx** - Usa versiones WebP de las 3 imágenes con fallback a JPG optimizado

### Formato Usado

Los componentes ahora importan ambas versiones (WebP y JPG optimizado) y el navegador selecciona automáticamente la mejor opción:

```tsx
import heroImageWebP from "@/assets/images/landing/hero.webp";
import heroImageJpg from "@/assets/images/landing/hero-optimized.jpg";
```

## Scripts Disponibles

### Optimizar nuevas imágenes

```bash
npm run optimize-images
```

Este script (`optimize-images.js`) procesa automáticamente las imágenes del landing y genera:
- Versiones WebP con calidad 85%
- Versiones JPG optimizadas con calidad 80%
- Redimensionamiento inteligente (máx. 1920px para hero, 1440px para otras)

## Siguientes Pasos Recomendados

### 1. Configurar Astro Image (Largo Plazo)

Para aprovechar al máximo las capacidades de Astro:

```bash
npm install sharp
```

Luego convertir los componentes React a usar el componente `<Image>` de Astro para:
- Lazy loading automático
- Responsive images con srcset
- Placeholder blur effect
- Optimización on-build

### 2. Optimización Adicional

Otras imágenes grandes detectadas:
- `booking-preview-2.svg` (12 MB) - Considerar optimizar SVG
- `booking-preview-1.svg` (5.6 MB) - Considerar optimizar SVG
- `growing-preview.svg` (1.1 MB) - Considerar optimizar SVG

### 3. CDN (Opcional)

Para producción, considerar usar CDN con optimización automática:
- Bunny.net (ya en uso para videos)
- Cloudflare Images
- Cloudinary

## Notas Técnicas

- **Sharp:** Instalado como dependencia de desarrollo
- **Formato WebP:** Soportado por 96%+ de navegadores modernos
- **Fallback JPG:** Para navegadores antiguos (legacy)
- **Quality Settings:** WebP 85%, JPG 80% (balance óptimo calidad/tamaño)

## Archivos Generados

- `optimize-images.js` - Script Node.js para optimización batch
- Imágenes WebP en `src/assets/images/landing/*.webp`
- Imágenes JPG optimizadas en `src/assets/images/landing/*-optimized.jpg`

---

**Fecha:** 6 de marzo de 2026  
**Reducción total de peso:** ~29.5 MB (98.3%)
