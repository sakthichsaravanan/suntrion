import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import { doctorsApi } from '../api/doctorsApi';
import { Doctor, DoctorFormData } from '../types/doctor';
import Table, { Column } from '../components/Table';
import Modal from '../components/Modal';
import DoctorForm from '../forms/DoctorForm';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorsApi.getAll();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenModal = (doctor?: Doctor) => {
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(undefined);
  };

  const handleSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    try {
      if (editingDoctor) {
        await doctorsApi.update(editingDoctor.id, data);
      } else {
        await doctorsApi.create(data);
      }
      await fetchDoctors();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save doctor', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorsApi.delete(id);
        await fetchDoctors();
      } catch (error) {
        console.error('Failed to delete doctor', error);
      }
    }
  };

  const columns: Column<Doctor>[] = [
    { 
      header: 'Name', 
      accessor: 'name', 
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            {val.charAt(0)}
          </div>
          <span className="font-medium text-gray-900">Dr. {val}</span>
        </div>
      ) 
    },
    { 
      header: 'Specialty', 
      accessor: 'specialty',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          <Award size={14} />
          {val}
        </span>
      )
    },
    { header: 'Phone Number', accessor: 'phone_number' },
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
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Doctors Directory</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      <Table columns={columns} data={doctors} isLoading={loading} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
        description={editingDoctor ? "Update the doctor's details." : "Register a new doctor to the hospital staff."}
      >
        <DoctorForm 
          initialData={editingDoctor} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
