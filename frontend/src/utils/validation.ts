import { z } from 'zod';

// Patient validation schema
export const patientSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'Date of birth cannot be in the future'),
});

// Medication validation schema
export const medicationSchema = z.object({
  name: z
    .string()
    .min(1, 'Medication name is required')
    .min(2, 'Medication name must be at least 2 characters')
    .max(100, 'Medication name must not exceed 100 characters'),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage must not exceed 50 characters'),
  frequency: z
    .string()
    .min(1, 'Frequency is required')
    .max(50, 'Frequency must not exceed 50 characters'),
});

// Assignment validation schema
export const assignmentSchema = z.object({
  patientId: z
    .number()
    .min(1, 'Please select a patient'),
  medicationId: z
    .number()
    .min(1, 'Please select a medication'),
  startDate: z
    .string()
    .min(1, 'Start date is required'),
  days: z
    .number()
    .min(1, 'Treatment duration must be at least 1 day')
    .max(365, 'Treatment duration cannot exceed 365 days'),
});

// Export types
export type PatientFormData = z.infer<typeof patientSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
