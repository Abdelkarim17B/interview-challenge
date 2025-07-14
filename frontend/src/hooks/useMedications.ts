import { useState, useEffect } from 'react';
import { medicationsApi } from '../lib/api';
import type { Medication } from '../types';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await medicationsApi.getAll();
      setMedications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch medications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const createMedication = async (medicationData: { name: string; dosage: string; frequency: string }) => {
    try {
      const newMedication = await medicationsApi.create(medicationData);
      setMedications(prev => [newMedication, ...prev]);
      return newMedication;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create medication');
    }
  };

  const updateMedication = async (id: number, medicationData: Partial<{ name: string; dosage: string; frequency: string }>) => {
    try {
      const updatedMedication = await medicationsApi.update(id, medicationData);
      setMedications(prev => prev.map(m => m.id === id ? updatedMedication : m));
      return updatedMedication;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update medication');
    }
  };

  const deleteMedication = async (id: number) => {
    try {
      await medicationsApi.delete(id);
      setMedications(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete medication');
    }
  };

  return {
    medications,
    isLoading,
    error,
    fetchMedications,
    createMedication,
    updateMedication,
    deleteMedication,
  };
};
