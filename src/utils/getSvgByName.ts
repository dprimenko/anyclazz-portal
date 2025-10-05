
const svgModules = import.meta.glob('../assets/images/**/*.svg', { 
  import: 'default', 
  query: '?raw', 
  eager: true 
});

const svgMap: Record<string, string> = {};

Object.entries(svgModules).forEach(([path, content]) => {
  const relativePath = path
    .replace('../assets/images/', '') 
    .replace('.svg', ''); 
    
  if (relativePath && typeof content === 'string') {
    svgMap[relativePath.toLowerCase()] = content;
    
    const fileName = relativePath.split('/').pop() || '';
    if (fileName) {
      svgMap[fileName.toLowerCase()] = content;
    }
  }
});

/**
 * Get SVG content by name from the assets/images folder (synchronous)
 * @param name - The name/path of the SVG file (without .svg extension)
 *               Examples: 'chat', 'menu/chat', 'menu/dashboard'
 * @returns The raw SVG content as string, or empty string if not found
 */
export function getSvgByName(name: string): string {
  const svgName = name.toLowerCase();
  const svg = svgMap[svgName];
  
  if (!svg) {
    const availableSvgs = Object.keys(svgMap).join(', ');
    console.warn(`SVG "${name}" not found. Available: ${availableSvgs}`);
    return '';
  }
  
  return svg;
}

/**
 * Get all available SVG names
 * @returns Array of available SVG names
 */
export function getAvailableSvgs(): string[] {
  return Object.keys(svgMap);
}

/**
 * Check if an SVG exists
 * @param name - The name of the SVG file (without .svg extension)
 * @returns True if the SVG exists, false otherwise
 */
export function svgExists(name: string): boolean {
  return name.toLowerCase() in svgMap;
}