export function countWords(text: string): number {
  if (!text) {
    return 0;
  }

  // Strip HTML tags
  const plainText = text.replace(/<[^>]*>/g, '');

  // Normalize text and split into words
  const words = plainText
    .trim()
    .replace(/—/g, ' ') // Replace em dashes with spaces
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .split(' ');

  return words.filter(word => word.length > 0).length;
}