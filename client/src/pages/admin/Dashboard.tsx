import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  AlertTriangle,
  XCircle,
  Sparkles,
  PlusCircle,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-32 bg-gray-200 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Control Panel</span>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-0.5">
            Admin Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time catalogue statistics, category counts, and inventory status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center space-x-2 bg-brand-purple hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-3 bg-blue-50 text-brand-blue rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.totalProducts || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Total item entries in database</span>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.activeProducts || 0}
          </strong>
          <span className="text-[11px] text-emerald-600 font-bold">Visible to customer catalogue</span>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
            <div className="p-3 bg-purple-50 text-brand-purple rounded-2xl">
              <FolderTree className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.totalCategories || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Active product categories</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Out of Stock</span>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block text-red-600">
            {stats?.outOfStock || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Items requiring stock refill</span>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock (≤ 5)</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block text-amber-600">
            {stats?.lowStock || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Approaching depletion</span>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Products</span>
            <div className="p-3 bg-pink-50 text-brand-pink rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.featuredProducts || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Highlighted on homepage hero</span>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-base group-hover:text-brand-purple">
              Manage Products
            </strong>
            <p className="text-xs text-slate-500">Edit prices, images, SKUs, and details.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-base group-hover:text-brand-purple">
              Manage Categories
            </strong>
            <p className="text-xs text-slate-500">Add categories & display ordering.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/inventory"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-base group-hover:text-brand-purple">
              Inventory Editor
            </strong>
            <p className="text-xs text-slate-500">Quick stock quantity editor.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
