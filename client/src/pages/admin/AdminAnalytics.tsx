import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { AnalyticsData } from '../../types';
import { formatINR } from '../../utils/formatters';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      console.warn('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Sales Analytics & Insights</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time database analytics based on recorded WhatsApp orders.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center space-x-1.5 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-display block mt-3">
            {formatINR(data?.totalRevenue || 0)}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">From confirmed orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-purple-50 text-brand-purple rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-display block mt-3">
            {data?.totalOrders || 0}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Orders placed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Order Value</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-display block mt-3">
            {formatINR(data?.averageOrderValue || 0)}
          </span>
          <span className="text-[11px] text-blue-600 font-bold mt-1 block">Per order average</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Action</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-display block mt-3">
            {data?.pendingOrders || 0}
          </span>
          <span className="text-[11px] text-amber-600 font-bold mt-1 block">Awaiting confirmation</span>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-black text-slate-900 text-lg font-display">Top Selling Products</h3>
        {!data?.topProducts || data.topProducts.length === 0 ? (
          <p className="text-xs text-slate-400">No product sales recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((tp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{tp.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">{formatINR(tp.revenue)}</span>
                  <span className="text-[10px] text-slate-400">{tp.salesCount} units sold</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
