import apiClient from './apiClient';
import { ENDPOINTS } from './constants';
import type {
  ApiResponse,
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  Medication,
  CreateMedicationDto,
  UpdateMedicationDto,
  Assignment,
  AssignmentWithRemainingDays,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from '../types';

// Patient API functions
export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get<ApiResponse<Patient[]>>(ENDPOINTS.patients);
    return response.data.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await apiClient.get<ApiResponse<Patient>>(`${ENDPOINTS.patients}/${id}`);
    return response.data.data;
  },

  create: async (data: CreatePatientDto): Promise<Patient> => {
    const response = await apiClient.post<ApiResponse<Patient>>(ENDPOINTS.patients, data);
    return response.data.data;
  },

  update: async (id: number, data: UpdatePatientDto): Promise<Patient> => {
    const response = await apiClient.patch<ApiResponse<Patient>>(`${ENDPOINTS.patients}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.patients}/${id}`);
  },
};

// Medication API functions
export const medicationsApi = {
  getAll: async (): Promise<Medication[]> => {
    const response = await apiClient.get<ApiResponse<Medication[]>>(ENDPOINTS.medications);
    return response.data.data;
  },

  getById: async (id: number): Promise<Medication> => {
    const response = await apiClient.get<ApiResponse<Medication>>(`${ENDPOINTS.medications}/${id}`);
    return response.data.data;
  },

  create: async (data: CreateMedicationDto): Promise<Medication> => {
    const response = await apiClient.post<ApiResponse<Medication>>(ENDPOINTS.medications, data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateMedicationDto): Promise<Medication> => {
    const response = await apiClient.patch<ApiResponse<Medication>>(`${ENDPOINTS.medications}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.medications}/${id}`);
  },
};

// Assignment API functions
export const assignmentsApi = {
  getAll: async (): Promise<Assignment[]> => {
    const response = await apiClient.get<ApiResponse<Assignment[]>>(ENDPOINTS.assignments);
    return response.data.data;
  },

  getAllWithRemainingDays: async (): Promise<AssignmentWithRemainingDays[]> => {
    const response = await apiClient.get<ApiResponse<AssignmentWithRemainingDays[]>>(
      ENDPOINTS.assignmentsWithRemainingDays
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Assignment> => {
    const response = await apiClient.get<ApiResponse<Assignment>>(`${ENDPOINTS.assignments}/${id}`);
    return response.data.data;
  },

  getByIdWithRemainingDays: async (id: number): Promise<AssignmentWithRemainingDays> => {
    const response = await apiClient.get<ApiResponse<AssignmentWithRemainingDays>>(
      `${ENDPOINTS.assignments}/${id}/with-remaining-days`
    );
    return response.data.data;
  },

  create: async (data: CreateAssignmentDto): Promise<Assignment> => {
    const response = await apiClient.post<ApiResponse<Assignment>>(ENDPOINTS.assignments, data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateAssignmentDto): Promise<Assignment> => {
    const response = await apiClient.patch<ApiResponse<Assignment>>(`${ENDPOINTS.assignments}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.assignments}/${id}`);
  },
};
