"use client";

import { useState } from 'react';
import Layout from '../../src/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Modal from '../../src/components/common/Modal';
import Loading from '../../src/components/common/Loading';
import ErrorMessage from '../../src/components/common/ErrorMessage';
import PatientForm from '../../src/components/pages/PatientForm';
import { usePatients } from '../../src/hooks/usePatients';
import { formatDate, calculateAge } from '../../src/utils/formatters';
import { PatientFormData } from '../../src/utils/validation';
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import type { Patient } from '../../src/types';

export default function PatientsPage() {
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { patients, isLoading, error, createPatient, updatePatient, deletePatient } = usePatients();

  const handleCreatePatient = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      await createPatient(data);
      setActiveModal(null);
    } catch (error) {
      console.error('Error creating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePatient = async (data: PatientFormData) => {
    if (!selectedPatient) return;
    setIsSubmitting(true);
    try {
      await updatePatient(selectedPatient.id, data);
      setActiveModal(null);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error updating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;
    setIsSubmitting(true);
    try {
      await deletePatient(selectedPatient.id);
      setActiveModal(null);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveModal('edit');
  };

  const openDeleteModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveModal('delete');
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading size="lg" text="Loading patients..." />
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600">Manage patient information and records</p>
          </div>
          <Button onClick={() => setActiveModal('create')}>
            <UserIcon className="h-4 w-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{patients.length}</div>
            <p className="text-sm text-gray-600">Active patients in the system</p>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first patient</p>
                <Button onClick={() => setActiveModal('create')}>
                  Add New Patient
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              <div className="text-sm text-gray-500">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {calculateAge(patient.dateOfBirth)} years old
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(patient.dateOfBirth)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {patient.assignments?.length || 0} active
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(patient)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteModal(patient)}
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={activeModal === 'create'}
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

      {/* Edit Modal */}
      <Modal
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        title="Edit Patient"
        size="md"
      >
        <PatientForm
          onSubmit={handleUpdatePatient}
          onCancel={() => setActiveModal(null)}
          initialData={selectedPatient ? {
            name: selectedPatient.name,
            dateOfBirth: selectedPatient.dateOfBirth,
          } : undefined}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Patient"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedPatient?.name}</strong>? 
            This action cannot be undone and will also remove all associated assignments.
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
              onClick={handleDeletePatient}
              isLoading={isSubmitting}
            >
              Delete Patient
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
