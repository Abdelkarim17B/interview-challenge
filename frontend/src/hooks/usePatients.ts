import { useState, useEffect } from 'react';
import { patientsApi } from '../lib/api';
import type { Patient } from '../types';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const createPatient = async (patientData: { name: string; dateOfBirth: string }) => {
    try {
      const newPatient = await patientsApi.create(patientData);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create patient');
    }
  };

  const updatePatient = async (id: number, patientData: Partial<{ name: string; dateOfBirth: string }>) => {
    try {
      const updatedPatient = await patientsApi.update(id, patientData);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update patient');
    }
  };

  const deletePatient = async (id: number) => {
    try {
      await patientsApi.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete patient');
    }
  };

  return {
    patients,
    isLoading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
};
