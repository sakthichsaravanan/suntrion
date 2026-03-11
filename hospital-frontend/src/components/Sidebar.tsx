import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, Calendar, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Doctors', path: '/doctors', icon: UserRound },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white border-r border-gray-200 h-screen hidden lg:flex flex-col sticky top-0"
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">+</span>
          </div>
          MediCare
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}
