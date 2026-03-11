import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Doctor, DoctorFormData } from '../types/doctor';
import LoadingSpinner from '../components/LoadingSpinner';

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits')
});

type FormValues = z.infer<typeof doctorSchema>;

interface DoctorFormProps {
  initialData?: Doctor;
  onSubmit: (data: DoctorFormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export default function DoctorForm({ initialData, onSubmit, isLoading, onCancel }: DoctorFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: initialData?.name || '',
      specialty: initialData?.specialty || '',
      phone_number: initialData?.phone_number || '',
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as DoctorFormData))} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input 
          {...register('name')} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
        <input 
          {...register('specialty')} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input 
          {...register('phone_number')} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white hover:bg-secondary rounded-lg font-medium transition-colors min-w-[100px]"
        >
          {isLoading ? <LoadingSpinner size={20} className="text-white min-h-0" /> : 'Save'}
        </button>
      </div>
    </form>
  );
}
