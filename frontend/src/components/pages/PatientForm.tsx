import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, PatientFormData } from '../../utils/validation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatDateForInput } from '../../utils/formatters';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PatientFormData>;
  isLoading?: boolean;
}

const PatientForm = ({ onSubmit, onCancel, initialData, isLoading }: PatientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: initialData?.name || '',
      dateOfBirth: initialData?.dateOfBirth ? formatDateForInput(initialData.dateOfBirth) : '',
    },
  });

  const handleFormSubmit = async (data: PatientFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Patient Name"
        placeholder="Enter patient name"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Date of Birth"
        type="date"
        required
        error={errors.dateOfBirth?.message}
        {...register('dateOfBirth')}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Patient' : 'Create Patient'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
