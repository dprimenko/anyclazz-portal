/**
 * Normaliza URLs de imágenes importadas
 * En desarrollo, Vite devuelve objetos con .src
 * En producción, puede devolver strings directos
 * 
 * @param img - Import de imagen (puede ser string, objeto con .src, o undefined)
 * @returns URL de la imagen como string
 */
export function getImageUrl(img: any): string {
    if (!img) return '';
    if (typeof img === 'string') return img;
    return img?.src || img?.default || String(img);
}
