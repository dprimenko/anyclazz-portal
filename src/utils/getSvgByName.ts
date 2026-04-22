
// URL map: just path→URL strings (a few KB, not the SVG content).
// Vite emits each SVG as a separate cacheable file in /_astro/.
const svgUrlModules = import.meta.glob('../assets/images/**/*.svg', {
  import: 'default',
  query: '?url',
  eager: true,
});

// Raw content map: only icons (not the large landing SVGs).
// Used for synchronous color transformation without a fetch round-trip.
const svgRawModules = import.meta.glob('../assets/images/icons/*.svg', {
  import: 'default',
  query: '?raw',
  eager: true,
});

const svgUrlMap: Record<string, string> = {};
const svgRawMap: Record<string, string> = {};

Object.entries(svgUrlModules).forEach(([path, url]) => {
  const relativePath = path
    .replace('../assets/images/', '')
    .replace('.svg', '');

  if (relativePath && typeof url === 'string') {
    svgUrlMap[relativePath.toLowerCase()] = url;

    const fileName = relativePath.split('/').pop() || '';
    if (fileName) {
      svgUrlMap[fileName.toLowerCase()] = url;
    }
  }
});

Object.entries(svgRawModules).forEach(([path, content]) => {
  const relativePath = path
    .replace('../assets/images/', '')
    .replace('.svg', '');

  if (relativePath && typeof content === 'string') {
    svgRawMap[relativePath.toLowerCase()] = content;

    const fileName = relativePath.split('/').pop() || '';
    if (fileName) {
      svgRawMap[fileName.toLowerCase()] = content;
    }
  }
});

/**
 * Returns the SVG URL (no color applied). Works synchronously — safe for SSR.
 */
export function getSvgUrl(name: string): string {
  return svgUrlMap[name.toLowerCase()] || '';
}

/**
 * Returns a data URI with the requested color applied, or the plain URL as fallback.
 * Uses the pre-loaded raw SVG content map — no fetch needed.
 */
export function getSvgByName(name: string, options?: { color?: string }): string {
  const svgName = name.toLowerCase();
  const rawContent = svgRawMap[svgName];

  if (!rawContent) {
    // Fall back to URL (e.g. for non-icon SVGs or icons not in the raw map)
    return getSvgUrl(name);
  }

  if (!options?.color) {
    return `data:image/svg+xml,${encodeURIComponent(rawContent)}`;
  }

  let svg = rawContent;
  svg = svg.replace(/fill="(?!none)[^"]*"/g, `fill="${options.color}"`);
  svg = svg.replace(/stroke="(?!none)[^"]*"/g, `stroke="${options.color}"`);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Async variant kept for backwards-compat. Delegates to the synchronous getSvgByName.
 */
export async function getSvgByNameAsync(
  name: string,
  options?: { color?: string },
): Promise<string> {
  return getSvgByName(name, options);
}

export function getAvailableSvgs(): string[] {
  return Object.keys(svgUrlMap);
}

export function svgExists(name: string): boolean {
  return name.toLowerCase() in svgUrlMap;
}