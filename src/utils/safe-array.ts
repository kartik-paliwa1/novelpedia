// utils/safe-array.ts
export function ensureArray<T>(value: any): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === 'object' && Array.isArray(value.results)) {
    return value.results;
  }
  if (value && typeof value === 'object' && Array.isArray(value.data)) {
    return value.data;
  }
  return [];
}

export function safeMap<T, R>(
  items: any,
  mapFn: (item: T, index: number) => R,
  fallback: R[] = []
): R[] {
  const safeItems = ensureArray<T>(items);
  try {
    return safeItems.map(mapFn);
  } catch (error) {
    console.warn('safeMap failed:', error);
    return fallback;
  }
}