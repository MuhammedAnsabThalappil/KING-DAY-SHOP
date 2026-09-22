import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@kingday.store');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.loginAdmin({ email, password });
      login(res.token, res.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white rounded-3xl my-8 max-w-md mx-auto shadow-2xl">
      <div className="w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-brand-yellow" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight">
            KING DAY Admin Panel
          </h2>
          <p className="text-xs text-slate-400">
            Secure portal for Catalogue, Category & Inventory Management
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-3.5 rounded-xl text-xs text-red-200 flex items-center space-x-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kingday.store"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple text-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple text-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-gradient hover:opacity-95 text-white font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'LOG IN TO DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center border-t border-slate-800 pt-4">
          <p className="text-[11px] text-slate-500">
            Initial Seed Credentials: <code className="text-brand-yellow font-mono">admin@kingday.store</code> / <code className="text-brand-yellow font-mono">ADMIN123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
