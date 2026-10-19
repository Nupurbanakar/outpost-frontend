import { GrantsFilters } from '@/api/endpoints/grants';

/**
 * Build GrantsFilters object from URL search params
 */
export function buildGrantsFilters(
  searchParams: URLSearchParams,
  page: number,
  size: number = 12
): GrantsFilters {
  const filters: GrantsFilters = {
    page,
    size,
  };

  const issuingBodyType = searchParams.get('issuingBodyType');
  const type = searchParams.get('type');
  const stageId = searchParams.get('stageId');
  const sectorId = searchParams.get('sectorId');
  const amountBand = searchParams.get('amountBand');
  const deadline = searchParams.get('deadline');
  const query = searchParams.get('q');
  const ai = searchParams.get('ai');

  if (issuingBodyType) filters.issuingBodyType = issuingBodyType as any;
  if (type) filters.type = type as any;
  if (stageId) filters.stageId = stageId;
  if (sectorId) filters.sectorId = sectorId;
  if (amountBand) filters.amountBand = amountBand as any;
  if (deadline) filters.deadline = deadline as any;
  if (query) filters.q = query;
  if (ai === 'true') filters.ai = true;

  return filters;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(searchParams: URLSearchParams): boolean {
  const filterKeys = [
    'issuingBodyType',
    'type',
    'stageId',
    'sectorId',
    'amountBand',
    'deadline',
    'q',
    'ai',
  ];

  return filterKeys.some((key) => searchParams.has(key));
}

/**
 * Update a single filter parameter
 */
export function updateFilterParam(
  searchParams: URLSearchParams,
  key: string,
  value: string
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams);
  
  if (value) {
    newParams.set(key, value);
  } else {
    newParams.delete(key);
  }
  
  // Reset to first page when filter changes
  newParams.delete('page');
  
  return newParams;
}

/**
 * Update page parameter
 */
export function updatePageParam(
  searchParams: URLSearchParams,
  page: number
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams);
  newParams.set('page', page.toString());
  return newParams;
}

/**
 * Toggle AI parameter
 */
export function toggleAIParam(searchParams: URLSearchParams): URLSearchParams {
  const newParams = new URLSearchParams(searchParams);
  const aiEnabled = searchParams.get('ai') === 'true';
  
  if (aiEnabled) {
    newParams.delete('ai');
  } else {
    newParams.set('ai', 'true');
  }
  
  // Reset to first page
  newParams.delete('page');
  
  return newParams;
}
