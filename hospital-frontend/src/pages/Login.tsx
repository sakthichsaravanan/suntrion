import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, HeartPulse } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { access } = await authApi.login({ username, password });
      login({ id: 1, username, email: '' }, access);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-primary p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
          
          <HeartPulse size={48} className="mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold mb-2 tracking-tight">MediCare</h1>
          <p className="text-primary-foreground/80 font-medium tracking-wide">Hospital Management System</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all focus:shadow-md"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all focus:shadow-md"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 rounded-xl shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 mt-6 flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size={20} className="min-h-0 text-white" /> : 'Log In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
