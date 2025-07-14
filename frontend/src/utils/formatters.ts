/**
 * Format date to display format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format date to input format (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get remaining days color based on count
 */
export const getRemainingDaysColor = (days: number): string => {
  if (days === 0) return 'text-gray-500';
  if (days <= 3) return 'text-red-600';
  if (days <= 7) return 'text-yellow-600';
  return 'text-green-600';
};

/**
 * Get remaining days badge style
 */
export const getRemainingDaysBadgeStyle = (days: number): string => {
  if (days === 0) return 'bg-gray-100 text-gray-800';
  if (days <= 3) return 'bg-red-100 text-red-800';
  if (days <= 7) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

/**
 * Format remaining days text
 */
export const formatRemainingDays = (days: number): string => {
  if (days === 0) return 'Treatment completed';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string to specified length
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};
