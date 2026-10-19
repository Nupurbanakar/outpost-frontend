/**
 * Format large numbers in lakhs and crores (Indian numbering system)
 * @param amount Number to format
 * @returns Formatted string (e.g., "10L", "1.5Cr")
 */
export function formatAmount(amount: number): string {
  if (amount >= 10000000) {
    // Crores
    const crores = amount / 10000000;
    return crores % 1 === 0 ? `${crores}Cr` : `${crores.toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    // Lakhs
    const lakhs = amount / 100000;
    return lakhs % 1 === 0 ? `${lakhs}L` : `${lakhs.toFixed(1)}L`;
  } else if (amount >= 1000) {
    // Thousands
    const thousands = amount / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  } else {
    return amount.toString();
  }
}

/**
 * Format currency with Indian Rupee symbol
 * @param amount Number to format
 * @returns Formatted currency string (e.g., "₹10,00,000")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with Indian numbering system (lakhs/crores separators)
 * @param num Number to format
 * @returns Formatted number with commas (e.g., "10,00,000")
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Truncate text to specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Pluralize a word based on count
 * @param count Number
 * @param singular Singular form
 * @param plural Plural form (optional, defaults to singular + 's')
 * @returns Pluralized word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Format file size in bytes to human readable format
 * @param bytes File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format percentage
 * @param value Decimal value (0-1)
 * @param decimals Number of decimal places
 * @returns Formatted percentage (e.g., "75.5%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
