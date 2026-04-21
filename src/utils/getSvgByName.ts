
// URL map: just path→URL strings (a few KB, not the SVG content).
// Vite emits each SVG as a separate cacheable file in /_astro/.
const svgUrlModules = import.meta.glob('../assets/images/**/*.svg', {
  import: 'default',
  query: '?url',
  eager: true,
});

const svgUrlMap: Record<string, string> = {};

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

// Cache for already-fetched colored variants so we only fetch once per color.
const colorCache: Record<string, string> = {};

/**
 * Returns the SVG URL (no color applied). Works synchronously — safe for SSR.
 */
export function getSvgUrl(name: string): string {
  return svgUrlMap[name.toLowerCase()] || '';
}

/**
 * Returns the SVG as a data URI with the requested color applied.
 * Fetches the file once and caches the result per (name, color) pair.
 * Falls back to the plain URL if fetching fails.
 */
export async function getSvgByNameAsync(
  name: string,
  options?: { color?: string },
): Promise<string> {
  const svgName = name.toLowerCase();
  const url = svgUrlMap[svgName];

  if (!url) {
    console.warn(`SVG "${name}" not found.`);
    return '';
  }

  if (!options?.color) {
    return url;
  }

  const cacheKey = `${svgName}__${options.color}`;
  if (colorCache[cacheKey]) return colorCache[cacheKey];

  try {
    const response = await fetch(url);
    let svg = await response.text();
    svg = svg.replace(/fill="(?!none)[^"]*"/g, `fill="${options.color}"`);
    svg = svg.replace(/stroke="(?!none)[^"]*"/g, `stroke="${options.color}"`);
    const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    colorCache[cacheKey] = dataUri;
    return dataUri;
  } catch {
    return url;
  }
}

/**
 * Synchronous helper kept for backwards-compat. Returns the plain URL.
 * Color is NOT applied here — use getSvgByNameAsync when color is needed.
 */
export function getSvgByName(name: string, _options?: { color?: string }): string {
  return getSvgUrl(name);
}

export function getAvailableSvgs(): string[] {
  return Object.keys(svgUrlMap);
}

export function svgExists(name: string): boolean {
  return name.toLowerCase() in svgUrlMap;
}