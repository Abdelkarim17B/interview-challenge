// response structure
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  assignments?: Assignment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  name: string;
  dateOfBirth: string;
}

export interface UpdatePatientDto {
  name?: string;
  dateOfBirth?: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  assignments?: Assignment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationDto {
  name: string;
  dosage: string;
  frequency: string;
}

export interface UpdateMedicationDto {
  name?: string;
  dosage?: string;
  frequency?: string;
}

export interface Assignment {
  id: number;
  startDate: string;
  days: number;
  patientId: number;
  medicationId: number;
  patient?: Patient;
  medication?: Medication;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentWithRemainingDays extends Assignment {
  remainingDays: number;
}

export interface CreateAssignmentDto {
  patientId: number;
  medicationId: number;
  startDate: string;
  days: number;
}

export interface UpdateAssignmentDto {
  patientId?: number;
  medicationId?: number;
  startDate?: string;
  days?: number;
}

export interface PatientFormData {
  name: string;
  dateOfBirth: string;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
}

export interface AssignmentFormData {
  patientId: number;
  medicationId: number;
  startDate: string;
  days: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[]>;
}
