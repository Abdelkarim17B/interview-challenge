import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema, AssignmentFormData } from '../../utils/validation';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { formatDateForInput } from '../../utils/formatters';
import type { Patient, Medication } from '../../types';

interface AssignmentFormProps {
  onSubmit: (data: AssignmentFormData) => Promise<void>;
  onCancel: () => void;
  patients: Patient[];
  medications: Medication[];
  initialData?: Partial<AssignmentFormData>;
  isLoading?: boolean;
}

const AssignmentForm = ({ 
  onSubmit, 
  onCancel, 
  patients, 
  medications, 
  initialData, 
  isLoading 
}: AssignmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      patientId: initialData?.patientId || 0,
      medicationId: initialData?.medicationId || 0,
      startDate: initialData?.startDate ? formatDateForInput(initialData.startDate) : '',
      days: initialData?.days || 1,
    },
  });

  const handleFormSubmit = async (data: AssignmentFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const patientOptions = patients.map(patient => ({
    value: patient.id,
    label: patient.name,
  }));

  const medicationOptions = medications.map(medication => ({
    value: medication.id,
    label: `${medication.name} - ${medication.dosage}`,
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Select
        label="Patient"
        placeholder="Select a patient"
        required
        options={patientOptions}
        error={errors.patientId?.message}
        {...register('patientId', { valueAsNumber: true })}
      />

      <Select
        label="Medication"
        placeholder="Select a medication"
        required
        options={medicationOptions}
        error={errors.medicationId?.message}
        {...register('medicationId', { valueAsNumber: true })}
      />

      <Input
        label="Start Date"
        type="date"
        required
        error={errors.startDate?.message}
        {...register('startDate')}
      />

      <Input
        label="Treatment Duration (days)"
        type="number"
        min="1"
        max="365"
        required
        error={errors.days?.message}
        {...register('days', { valueAsNumber: true })}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;
