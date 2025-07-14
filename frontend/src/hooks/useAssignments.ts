import { useState, useEffect } from 'react';
import { assignmentsApi } from '../lib/api';
import type { Assignment, AssignmentWithRemainingDays } from '../types';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<AssignmentWithRemainingDays[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await assignmentsApi.getAllWithRemainingDays();
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assignments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const createAssignment = async (assignmentData: { patientId: number; medicationId: number; startDate: string; days: number }) => {
    try {
      const newAssignment = await assignmentsApi.create(assignmentData);
      // Fetch the new assignment with remaining days
      const assignmentWithRemainingDays = await assignmentsApi.getByIdWithRemainingDays(newAssignment.id);
      setAssignments(prev => [assignmentWithRemainingDays, ...prev]);
      return assignmentWithRemainingDays;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create assignment');
    }
  };

  const updateAssignment = async (id: number, assignmentData: Partial<{ patientId: number; medicationId: number; startDate: string; days: number }>) => {
    try {
      await assignmentsApi.update(id, assignmentData);
      // Fetch the updated assignment with remaining days
      const updatedAssignment = await assignmentsApi.getByIdWithRemainingDays(id);
      setAssignments(prev => prev.map(a => a.id === id ? updatedAssignment : a));
      return updatedAssignment;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update assignment');
    }
  };

  const deleteAssignment = async (id: number) => {
    try {
      await assignmentsApi.delete(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete assignment');
    }
  };

  return {
    assignments,
    isLoading,
    error,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};
