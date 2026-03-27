export function categoryIcon(name?: string): string {
  const n = name?.toLowerCase() ?? '';
  if (n.includes('btp') || n.includes('chantier')) return 'construction';
  if (n.includes('audio') || n.includes('son')) return 'videocam';
  if (n.includes('info') || n.includes('pc')) return 'computer';
  if (n.includes('tablet')) return 'tablet_mac';
  return 'inventory_2';
}

export function categoryBg(name?: string): string {
  const n = name?.toLowerCase() ?? '';
  if (n.includes('btp')) return 'bg-amber-50';
  if (n.includes('audio')) return 'bg-blue-50';
  if (n.includes('info')) return 'bg-purple-50';
  return 'bg-bg';
}

/**
 * Retourne une URL valide pour l'image.
 * - Si l'URL commence par http, on la garde.
 * - Si elle commence par /, on ajoute l'URL de l'API.
 * - Sinon (ex: mock data "Aliquip..."), on retourne null pour afficher le placeholder.
 */
export function getImageUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;

  if (url.startsWith('http')) return url;

  if (url.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Éviter de doubler le slash si baseUrl finit par /
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${url}`;
  }

  return null;
}