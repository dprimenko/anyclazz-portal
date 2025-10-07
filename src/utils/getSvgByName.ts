
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

export function getAvailableSvgs(): string[] {
  return Object.keys(svgMap);
}

export function svgExists(name: string): boolean {
  return name.toLowerCase() in svgMap;
}