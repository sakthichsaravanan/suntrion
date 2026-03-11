import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Appointment, AppointmentFormData } from '../types/appointment';
import { Patient } from '../types/patient';
import { Doctor } from '../types/doctor';
import LoadingSpinner from '../components/LoadingSpinner';

const appointmentSchema = z.object({
  patient: z.coerce.number().min(1, 'Patient is required'),
  doctor: z.coerce.number().min(1, 'Doctor is required'),
  datetime: z.string().min(1, 'Date and time are required'),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']),
  location: z.string().min(2, 'Location is required'),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  initialData?: Appointment;
  patients: Patient[];
  doctors: Doctor[];
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export default function AppointmentForm({ initialData, patients, doctors, onSubmit, isLoading, onCancel }: AppointmentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      patient: initialData?.patient || 0,
      doctor: initialData?.doctor || 0,
      datetime: initialData?.datetime ? new Date(initialData.datetime).toISOString().slice(0, 16) : '',
      status: initialData?.status || 'Scheduled',
      location: initialData?.location || '',
      notes: initialData?.notes || '',
    } as any
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as AppointmentFormData))} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
          <select 
            {...register('patient')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.patient && <p className="text-red-500 text-xs mt-1">{errors.patient.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
          <select 
            {...register('doctor')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
          >
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>
            ))}
          </select>
          {errors.doctor && <p className="text-red-500 text-xs mt-1">{errors.doctor.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
          <input 
            type="datetime-local"
            {...register('datetime')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {errors.datetime && <p className="text-red-500 text-xs mt-1">{errors.datetime.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            {...register('status')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input 
          {...register('location')} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="e.g. Room 101, Main Building"
        />
        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea 
          {...register('notes')} 
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Any additional notes or instructions..."
        />
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
