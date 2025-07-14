import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicationSchema, MedicationFormData } from '../../utils/validation';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface MedicationFormProps {
  onSubmit: (data: MedicationFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<MedicationFormData>;
  isLoading?: boolean;
}

const MedicationForm = ({ onSubmit, onCancel, initialData, isLoading }: MedicationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: initialData?.name || '',
      dosage: initialData?.dosage || '',
      frequency: initialData?.frequency || '',
    },
  });

  const handleFormSubmit = async (data: MedicationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Medication Name"
        placeholder="Enter medication name"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Dosage"
        placeholder="e.g., 100mg, 2 tablets"
        required
        error={errors.dosage?.message}
        {...register('dosage')}
      />

      <Input
        label="Frequency"
        placeholder="e.g., Once daily, Twice daily"
        required
        error={errors.frequency?.message}
        {...register('frequency')}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Medication' : 'Create Medication'}
        </Button>
      </div>
    </form>
  );
};

export default MedicationForm;
