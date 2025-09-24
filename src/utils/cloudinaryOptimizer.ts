/**
 * Optimiza URLs de videos de Cloudinary según el tamaño del dispositivo
 * Aplica transformaciones para mejorar la carga y calidad sin perder demasiada resolución
 */

interface DeviceDimensions {
  width: number;
  height: number;
  density: number;
}

function getDeviceDimensions(): DeviceDimensions {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const density = window.devicePixelRatio || 1;
  
  return { width, height, density };
}

function getOptimalVideoWidth(deviceWidth: number, density: number): number {
  // Ajustar según el tamaño del dispositivo y densidad de píxeles
  const effectiveWidth = deviceWidth * density;
  
  // Definir breakpoints para diferentes tamaños de dispositivo
  if (effectiveWidth <= 480) return 480;   // Móviles pequeños
  if (effectiveWidth <= 768) return 720;   // Móviles grandes/tablets pequeñas
  if (effectiveWidth <= 1024) return 1080; // Tablets
  if (effectiveWidth <= 1440) return 1280; // Laptops
  return 1920; // Desktop/pantallas grandes
}

function getQualityLevel(deviceWidth: number): string {
  // Ajustar calidad según el tamaño del dispositivo
  if (deviceWidth <= 480) return 'q_70';   // Móviles: calidad moderada
  if (deviceWidth <= 1024) return 'q_80';  // Tablets: buena calidad
  return 'q_85'; // Desktop: alta calidad
}

export function optimizeCloudinaryVideo(originalUrl: string): string {
  try {
    // Verificar si es una URL de Cloudinary
    if (!originalUrl.includes('cloudinary.com') && !originalUrl.includes('res.cloudinary.com')) {
      return originalUrl;
    }

    const { width, density } = getDeviceDimensions();
    const optimalWidth = getOptimalVideoWidth(width, density);
    const quality = getQualityLevel(width);
    
    // Construir las transformaciones de Cloudinary
    const transformations = [
      `w_${optimalWidth}`,     // Ancho adaptativo
      'c_limit',               // Limitar sin distorsionar
      quality,                 // Calidad adaptativa
      'f_auto',                // Formato automático (WebM en navegadores compatibles)
      'fl_progressive'         // Carga progresiva
    ].join(',');
    
    // Insertar transformaciones en la URL de Cloudinary
    if (originalUrl.includes('/upload/')) {
      return originalUrl.replace('/upload/', `/upload/${transformations}/`);
    } else if (originalUrl.includes('/video/upload/')) {
      return originalUrl.replace('/video/upload/', `/video/upload/${transformations}/`);
    }
    
    return originalUrl;
  } catch (error) {
    console.warn('Error optimizing Cloudinary video URL:', error);
    return originalUrl;
  }
}

// Hook para usar la optimización de manera reactiva
export function useCloudinaryOptimization(originalUrl: string): string {
  // En un entorno real, podrías usar useState y useEffect para recalcular
  // cuando cambie el tamaño de la ventana, pero para simplificar mantenemos estático
  return optimizeCloudinaryVideo(originalUrl);
}
