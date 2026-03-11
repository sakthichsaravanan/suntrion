import { useEffect, useState } from 'react';
import { Users, UserRound, Calendar, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import { patientsApi } from '../api/patientsApi';
import { doctorsApi } from '../api/doctorsApi';
import { appointmentsApi } from '../api/appointmentsApi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patients, doctors, appointments] = await Promise.all([
          patientsApi.getAll(),
          doctorsApi.getAll(),
          appointmentsApi.getAll(),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayCount = appointments.filter(a => a.datetime.startsWith(today)).length;

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
          todayAppointments: todayCount,
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner size={40} className="h-[60vh]" />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={Users}
          color="bg-blue-100 text-blue-600"
          trend="+12% this month"
        />
        <StatCard
          title="Total Doctors"
          value={stats.doctors}
          icon={UserRound}
          color="bg-emerald-100 text-emerald-600"
          trend="+2 recent"
        />
        <StatCard
          title="Total Appointments"
          value={stats.appointments}
          icon={Calendar}
          color="bg-purple-100 text-purple-600"
          trend="+5% this week"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Clock}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 font-medium">Activity Chart Visualization</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 mb-4 tracking-tight">Recent Activity</h3>
          <div className="flex-1 flex items-center justify-center">
             <p className="text-gray-400 font-medium">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
