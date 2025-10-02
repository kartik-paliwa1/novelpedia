/**
 * Format a date string to a human-readable relative time format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted relative date string
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'Not published'
  
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  } catch {
    return 'Invalid date'
  }
}

/**
 * Alternative name for formatDate - formats relative date
 */
export const formatRelativeDate = formatDate
