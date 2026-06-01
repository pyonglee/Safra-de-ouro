/**
 * Format number to BRL currency string: R$ 1.234,56
 */
export function formatCurrency(value: number | null | undefined): string {
  const num = value ?? 0;
  return `R$ ${num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/**
 * Format ISO date string to dd/MM/yyyy
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '-';
  }
}

/**
 * Format number with Brazilian locale
 */
export function formatNumber(value: number | null | undefined): string {
  const num = value ?? 0;
  return num.toLocaleString('pt-BR');
}

/**
 * Get category label in pt-BR
 */
export function getCategoryLabel(category: string | null | undefined): string {
  switch (category) {
    case 'FERTILIZER': return 'Adubo';
    case 'SPRAYING': return 'Pulverização';
    case 'OTHER': return 'Outros';
    default: return category ?? 'Outros';
  }
}

/**
 * Get category icon name
 */
export function getCategoryIcon(category: string | null | undefined): string {
  switch (category) {
    case 'FERTILIZER': return 'leaf';
    case 'SPRAYING': return 'spray';
    case 'OTHER': return 'dots-horizontal-circle';
    default: return 'help-circle';
  }
}
