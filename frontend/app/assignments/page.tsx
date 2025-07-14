"use client";

import { useState } from 'react';
import Layout from '../../src/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Badge from '../../src/components/ui/Badge';
import Modal from '../../src/components/common/Modal';
import Loading from '../../src/components/common/Loading';
import ErrorMessage from '../../src/components/common/ErrorMessage';
import AssignmentForm from '../../src/components/pages/AssignmentForm';
import { useAssignments } from '../../src/hooks/useAssignments';
import { usePatients } from '../../src/hooks/usePatients';
import { useMedications } from '../../src/hooks/useMedications';
import { formatDate, formatRemainingDays, calculateAge } from '../../src/utils/formatters';
import { AssignmentFormData } from '../../src/utils/validation';
import { PencilIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import type { AssignmentWithRemainingDays } from '../../src/types';

export default function AssignmentsPage() {
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithRemainingDays | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { assignments, isLoading: assignmentsLoading, error: assignmentsError, createAssignment, updateAssignment, deleteAssignment } = useAssignments();
  const { patients, isLoading: patientsLoading } = usePatients();
  const { medications, isLoading: medicationsLoading } = useMedications();

  const handleCreateAssignment = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      await createAssignment(data);
      setActiveModal(null);
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAssignment = async (data: AssignmentFormData) => {
    if (!selectedAssignment) return;
    setIsSubmitting(true);
    try {
      await updateAssignment(selectedAssignment.id, data);
      setActiveModal(null);
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error updating assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!selectedAssignment) return;
    setIsSubmitting(true);
    try {
      await deleteAssignment(selectedAssignment.id);
      setActiveModal(null);
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error deleting assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (assignment: AssignmentWithRemainingDays) => {
    setSelectedAssignment(assignment);
    setActiveModal('edit');
  };

  const openDeleteModal = (assignment: AssignmentWithRemainingDays) => {
    setSelectedAssignment(assignment);
    setActiveModal('delete');
  };

  const getRemainingDaysBadgeVariant = (days: number) => {
    if (days === 0) return 'secondary';
    if (days <= 3) return 'danger';
    if (days <= 7) return 'warning';
    return 'success';
  };

  const getStatusCounts = () => {
    const active = assignments.filter(a => a.remainingDays > 0).length;
    const completed = assignments.filter(a => a.remainingDays === 0).length;
    const urgent = assignments.filter(a => a.remainingDays > 0 && a.remainingDays <= 3).length;
    return { active, completed, urgent };
  };

  const isLoading = assignmentsLoading || patientsLoading || medicationsLoading;
  const error = assignmentsError;

  if (isLoading) {
    return (
      <Layout>
        <Loading size="lg" text="Loading assignments..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  const { active, completed, urgent } = getStatusCounts();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treatment Assignments</h1>
            <p className="text-gray-600">Manage patient medication assignments and track treatment progress</p>
          </div>
          <Button onClick={() => setActiveModal('create')}>
            <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{assignments.length}</div>
              <p className="text-sm text-gray-600">All assignments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Treatments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{active}</div>
              <p className="text-sm text-gray-600">Ongoing treatments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{urgent}</div>
              <p className="text-sm text-gray-600">≤3 days remaining</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{completed}</div>
              <p className="text-sm text-gray-600">Finished treatments</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                <p className="text-gray-600 mb-4">Create your first treatment assignment to get started</p>
                <Button onClick={() => setActiveModal('create')}>
                  Create Assignment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-6">
                          {/* Patient Info */}
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">👤</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{assignment.patient?.name}</h3>
                              <p className="text-sm text-gray-600">
                                Age: {calculateAge(assignment.patient?.dateOfBirth || '')} • ID: {assignment.patient?.id}
                              </p>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="text-gray-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>

                          {/* Medication Info */}
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">💊</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{assignment.medication?.name}</h3>
                              <p className="text-sm text-gray-600">
                                {assignment.medication?.dosage} • {assignment.medication?.frequency}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Treatment Details */}
                        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Started:</span> {formatDate(assignment.startDate)}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {assignment.days} days
                          </div>
                          <div>
                            <span className="font-medium">Assignment ID:</span> {assignment.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge variant={getRemainingDaysBadgeVariant(assignment.remainingDays)}>
                            {formatRemainingDays(assignment.remainingDays)}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(assignment)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(assignment)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        title="Create New Assignment"
        size="lg"
      >
        <AssignmentForm
          onSubmit={handleCreateAssignment}
          onCancel={() => setActiveModal(null)}
          patients={patients}
          medications={medications}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        title="Edit Assignment"
        size="lg"
      >
        <AssignmentForm
          onSubmit={handleUpdateAssignment}
          onCancel={() => setActiveModal(null)}
          patients={patients}
          medications={medications}
          initialData={selectedAssignment ? {
            patientId: selectedAssignment.patientId,
            medicationId: selectedAssignment.medicationId,
            startDate: selectedAssignment.startDate,
            days: selectedAssignment.days,
          } : undefined}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Assignment"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this assignment for <strong>{selectedAssignment?.patient?.name}</strong> 
            taking <strong>{selectedAssignment?.medication?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setActiveModal(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAssignment}
              isLoading={isSubmitting}
            >
              Delete Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
