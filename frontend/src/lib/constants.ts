// Global constants for the application
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API endpoints
export const ENDPOINTS = {
  patients: '/patients',
  medications: '/medications',
  assignments: '/assignments',
  assignmentsWithRemainingDays: '/assignments/with-remaining-days',
} as const;

// Form validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidDate: 'Please enter a valid date',
  minLength: (length: number) => `Must be at least ${length} characters`,
  maxLength: (length: number) => `Must not exceed ${length} characters`,
  positiveNumber: 'Must be a positive number',
} as const;
