"use client";

import { useState } from 'react';
import Layout from '../../src/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Modal from '../../src/components/common/Modal';
import Loading from '../../src/components/common/Loading';
import ErrorMessage from '../../src/components/common/ErrorMessage';
import MedicationForm from '../../src/components/pages/MedicationForm';
import { useMedications } from '../../src/hooks/useMedications';
import { MedicationFormData } from '../../src/utils/validation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Medication } from '../../src/types';

export default function MedicationsPage() {
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { medications, isLoading, error, createMedication, updateMedication, deleteMedication } = useMedications();

  const handleCreateMedication = async (data: MedicationFormData) => {
    setIsSubmitting(true);
    try {
      await createMedication(data);
      setActiveModal(null);
    } catch (error) {
      console.error('Error creating medication:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMedication = async (data: MedicationFormData) => {
    if (!selectedMedication) return;
    setIsSubmitting(true);
    try {
      await updateMedication(selectedMedication.id, data);
      setActiveModal(null);
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error updating medication:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedication = async () => {
    if (!selectedMedication) return;
    setIsSubmitting(true);
    try {
      await deleteMedication(selectedMedication.id);
      setActiveModal(null);
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error deleting medication:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (medication: Medication) => {
    setSelectedMedication(medication);
    setActiveModal('edit');
  };

  const openDeleteModal = (medication: Medication) => {
    setSelectedMedication(medication);
    setActiveModal('delete');
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading size="lg" text="Loading medications..." />
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
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="text-gray-600">Manage medication inventory and information</p>
          </div>
          <Button onClick={() => setActiveModal('create')}>
            💊 Add New Medication
          </Button>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{medications.length}</div>
            <p className="text-sm text-gray-600">Available medications in the system</p>
          </CardContent>
        </Card>

        {/* Medications List */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first medication</p>
                <Button onClick={() => setActiveModal('create')}>
                  Add New Medication
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map((medication) => (
                  <Card key={medication.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">💊</span>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                              <p className="text-sm text-gray-500">ID: {medication.id}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Dosage:</span>
                              <span className="text-sm text-gray-900">{medication.dosage}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Frequency:</span>
                              <span className="text-sm text-gray-900">{medication.frequency}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Usage:</span>
                              <span className="text-sm text-gray-900">
                                {medication.assignments?.length || 0} assignments
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(medication)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(medication)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
        title="Add New Medication"
        size="md"
      >
        <MedicationForm
          onSubmit={handleCreateMedication}
          onCancel={() => setActiveModal(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        title="Edit Medication"
        size="md"
      >
        <MedicationForm
          onSubmit={handleUpdateMedication}
          onCancel={() => setActiveModal(null)}
          initialData={selectedMedication ? {
            name: selectedMedication.name,
            dosage: selectedMedication.dosage,
            frequency: selectedMedication.frequency,
          } : undefined}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Medication"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedMedication?.name}</strong>? 
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
              onClick={handleDeleteMedication}
              isLoading={isSubmitting}
            >
              Delete Medication
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
