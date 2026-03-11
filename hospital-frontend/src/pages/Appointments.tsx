import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CalendarCheck, Clock, XCircle } from 'lucide-react';
import { appointmentsApi } from '../api/appointmentsApi';
import { patientsApi } from '../api/patientsApi';
import { doctorsApi } from '../api/doctorsApi';
import { Appointment, AppointmentFormData } from '../types/appointment';
import { Patient } from '../types/patient';
import { Doctor } from '../types/doctor';
import Table, { Column } from '../components/Table';
import Modal from '../components/Modal';
import AppointmentForm from '../forms/AppointmentForm';
import { format } from 'date-fns';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptsData, ptsData, docsData] = await Promise.all([
        appointmentsApi.getAll(),
        patientsApi.getAll(),
        doctorsApi.getAll()
      ]);
      setAppointments(apptsData);
      setPatients(ptsData);
      setDoctors(docsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (appointment?: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(undefined);
  };

  const handleSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      // make sure datetime is proper ISO string for Django
      const formattedData = {
        ...data,
        datetime: new Date(data.datetime).toISOString()
      };
      
      if (editingAppointment) {
        await appointmentsApi.update(editingAppointment.id, formattedData);
      } else {
        await appointmentsApi.create(formattedData);
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save appointment', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsApi.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete appointment', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Clock size={14} /> Scheduled
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CalendarCheck size={14} /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const columns: Column<Appointment>[] = [
    { 
      header: 'Patient', 
      accessor: 'patient', 
      render: (val, item) => {
        const patient = patients.find(p => p.id === val);
        return <span className="font-medium text-gray-900">{patient?.name || `Patient #${val}`}</span>;
      }
    },
    { 
      header: 'Doctor', 
      accessor: 'doctor', 
      render: (val, item) => {
        const doctor = doctors.find(d => d.id === val);
        return <span className="text-gray-700">Dr. {doctor?.name || `Doctor #${val}`}</span>;
      }
    },
    { 
      header: 'Date & Time', 
      accessor: 'datetime',
      render: (val) => (
        <span className="text-gray-600">
          {format(new Date(val), 'MMM dd, yyyy · hh:mm a')}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val) => getStatusBadge(val)
    },
    { header: 'Location', accessor: 'location' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (id, item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenModal(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(id as number)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appointments</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      <Table columns={columns} data={appointments} isLoading={loading} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingAppointment ? "Edit Appointment" : "Schedule Appointment"}
        description={editingAppointment ? "Update appointment details." : "Create a new appointment scheduling."}
      >
        <AppointmentForm 
          initialData={editingAppointment} 
          patients={patients}
          doctors={doctors}
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
