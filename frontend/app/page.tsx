"use client";

import { useState } from 'react';
import Layout from '../src/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/Card';
import Badge from '../src/components/ui/Badge';
import Button from '../src/components/ui/Button';
import Modal from '../src/components/common/Modal';
import Loading from '../src/components/common/Loading';
import ErrorMessage from '../src/components/common/ErrorMessage';
import PatientForm from '../src/components/pages/PatientForm';
import MedicationForm from '../src/components/pages/MedicationForm';
import AssignmentForm from '../src/components/pages/AssignmentForm';
import { usePatients } from '../src/hooks/usePatients';
import { useMedications } from '../src/hooks/useMedications';
import { useAssignments } from '../src/hooks/useAssignments';
import { formatDate, formatRemainingDays, calculateAge } from '../src/utils/formatters';
import { PatientFormData, MedicationFormData, AssignmentFormData } from '../src/utils/validation';

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<'patient' | 'medication' | 'assignment' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { patients, isLoading: patientsLoading, error: patientsError, createPatient } = usePatients();
  const { medications, isLoading: medicationsLoading, error: medicationsError, createMedication } = useMedications();
  const { assignments, isLoading: assignmentsLoading, error: assignmentsError, createAssignment } = useAssignments();

  const handleCreatePatient = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      await createPatient(data);
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMedication = async (data: MedicationFormData) => {
    setIsSubmitting(true);
    try {
      await createMedication(data);
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAssignment = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      await createAssignment(data);
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRemainingDaysBadgeVariant = (days: number) => {
    if (days === 0) return 'secondary';
    if (days <= 3) return 'danger';
    if (days <= 7) return 'warning';
    return 'success';
  };

  const isLoading = patientsLoading || medicationsLoading || assignmentsLoading;
  const hasError = patientsError || medicationsError || assignmentsError;

  if (isLoading) {
    return (
      <Layout>
        <Loading size="lg" text="Loading dashboard..." />
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout>
        <ErrorMessage
          message={patientsError || medicationsError || assignmentsError || 'An error occurred'}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Dashboard</h1>
            <p className="text-gray-600">Manage patients, medications, and treatment assignments</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setActiveModal('patient')}>
              Add Patient
            </Button>
            <Button onClick={() => setActiveModal('medication')}>
              Add Medication
            </Button>
            <Button onClick={() => setActiveModal('assignment')}>
              New Assignment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{patients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{medications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{assignments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Treatment Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No assignments yet. Create your first assignment to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{assignment.patient?.name}</h3>
                          <p className="text-sm text-gray-600">
                            Age: {calculateAge(assignment.patient?.dateOfBirth || '')}
                          </p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div>
                          <p className="font-medium text-gray-900">{assignment.medication?.name}</p>
                          <p className="text-sm text-gray-600">
                            {assignment.medication?.dosage} • {assignment.medication?.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Started: {formatDate(assignment.startDate)}</p>
                        <p className="text-sm text-gray-600">{assignment.days} days total</p>
                      </div>
                      <Badge variant={getRemainingDaysBadgeVariant(assignment.remainingDays)}>
                        {formatRemainingDays(assignment.remainingDays)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'patient'}
        onClose={() => setActiveModal(null)}
        title="Add New Patient"
        size="md"
      >
        <PatientForm
          onSubmit={handleCreatePatient}
          onCancel={() => setActiveModal(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'medication'}
        onClose={() => setActiveModal(null)}
        title="Add New Medication"
        size="md"
      >
        <MedicationForm
          onSubmit={handleCreateMedication}
          onCancel={() => setActiveModal(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'assignment'}
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
    </Layout>
  );
}
