/**
 * Safely cleans HTML tags from a given text string.
 * @param text - The input string, potentially containing HTML.
 * @returns The text with HTML tags removed, or an empty string if input is undefined/null.
 */
export const cleanHtml = (text?: string): string => {
  if (!text) return '';

  // Replace any character between < and > with an empty string
  return text.replace(/<[^>]*>/g, '');
};

/**
 * Formats a date string into a localized date string (e.g., MM/DD/YYYY).
 * Returns the original string if formatting fails.
 * @param dateStr - The date string to format.
 * @returns The formatted date string or the original string on error.
 */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    // Use default locale and date style
    return new Date(dateStr).toLocaleDateString();
  } catch {
    // Return original string if parsing or formatting fails
    return dateStr;
  }
};

/**
 * Truncates a string to a specified maximum length, adding ellipsis if truncated.
 * @param text - The string to truncate.
 * @param maxLength - The maximum allowed length before truncation.
 * @returns The truncated string with ellipsis, or the original string if within length.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  // Substring to maxLength and append ellipsis
  return text.substring(0, maxLength) + '...';
};
