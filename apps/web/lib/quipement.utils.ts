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