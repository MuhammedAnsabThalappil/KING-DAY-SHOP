import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  AlertTriangle,
  XCircle,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data, analytics] = await Promise.all([
          api.getDashboardStats(),
          api.getAnalytics(),
        ]);
        setStats({
          ...data,
          totalRevenue: analytics?.totalRevenue || 0,
          totalOrders: analytics?.totalOrders || 0,
          pendingOrders: analytics?.pendingOrders || 0,
        });
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
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-32 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">KING DAY CONTROL PANEL</span>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-0.5">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time e-commerce revenue, WhatsApp orders, inventory stock, and product catalogue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center space-x-2 bg-brand-purple hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-2xl font-black text-slate-900 font-display block">
            {formatINR(stats?.totalRevenue || 0)}
          </strong>
          <span className="text-[11px] text-emerald-600 font-bold">From recorded orders</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-3 bg-purple-50 text-brand-purple rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.totalOrders || 0}
          </strong>
          <span className="text-[11px] text-slate-500 font-medium">WhatsApp customer orders</span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-3 bg-blue-50 text-brand-blue rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.totalProducts || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Catalogue items</span>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
            <div className="p-3 bg-pink-50 text-brand-pink rounded-2xl">
              <FolderTree className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.totalCategories || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Active categories</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Out of Stock</span>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-red-600 font-display block">
            {stats?.outOfStock || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Requires stock refill</span>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock (≤3)</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-amber-600 font-display block">
            {stats?.lowStock || 0}
          </strong>
          <span className="text-[11px] text-slate-500 font-medium">Near depletion</span>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured</span>
            <div className="p-3 bg-yellow-50 text-amber-600 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.featuredProducts || 0}
          </strong>
          <span className="text-[11px] text-slate-500">Homepage highlights</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <strong className="text-3xl font-black text-slate-900 font-display block">
            {stats?.pendingOrders || 0}
          </strong>
          <span className="text-[11px] text-indigo-600 font-bold">New orders</span>
        </div>

      </div>

      {/* Navigation Quick Access Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/products"
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-sm group-hover:text-brand-purple">
              Products
            </strong>
            <p className="text-xs text-slate-400">Add, edit, delete items</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-sm group-hover:text-brand-purple">
              Orders
            </strong>
            <p className="text-xs text-slate-400">View & status updates</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/inventory"
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-sm group-hover:text-brand-purple">
              Inventory
            </strong>
            <p className="text-xs text-slate-400">Update stock quantities</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block text-sm group-hover:text-brand-purple">
              Analytics
            </strong>
            <p className="text-xs text-slate-400">Sales breakdown & reports</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
