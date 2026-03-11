import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { patientsApi } from '../api/patientsApi';
import { Patient, PatientFormData } from '../types/patient';
import Table, { Column } from '../components/Table';
import Modal from '../components/Modal';
import PatientForm from '../forms/PatientForm';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenModal = (patient?: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(undefined);
  };

  const handleSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        await patientsApi.update(editingPatient.id, data);
      } else {
        await patientsApi.create(data);
      }
      await fetchPatients();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save patient', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientsApi.delete(id);
        await fetchPatients();
      } catch (error) {
        console.error('Failed to delete patient', error);
      }
    }
  };

  const columns: Column<Patient>[] = [
    { header: 'Name', accessor: 'name', render: (val) => <span className="font-medium text-gray-900">{val}</span> },
    { header: 'Age', accessor: 'age' },
    { header: 'Gender', accessor: 'gender' },
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
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patients Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      <Table columns={columns} data={patients} isLoading={loading} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingPatient ? "Edit Patient" : "Add New Patient"}
        description={editingPatient ? "Update patient information below." : "Enter patient details to register them in the system."}
      >
        <PatientForm 
          initialData={editingPatient} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
