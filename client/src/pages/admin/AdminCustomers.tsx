import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, Search, RefreshCw, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { CustomerRecord } from '../../types';
import { formatINR } from '../../utils/formatters';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load customers:', err);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of customers derived from recorded orders.</p>
        </div>
        <button
          onClick={fetchCustomers}
          className="inline-flex items-center space-x-1.5 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Directory</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No customer records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Total Orders</th>
                  <th className="p-3.5">Total Spent</th>
                  <th className="p-3.5">Last Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 block font-bold text-xs">{c.name}</strong>
                      {c.email && <span className="text-[10px] text-slate-400">{c.email}</span>}
                    </td>
                    <td className="p-3.5 font-mono text-slate-800">{c.phone}</td>
                    <td className="p-3.5 text-slate-600">{c.city || 'Kerala'}</td>
                    <td className="p-3.5">
                      <span className="bg-purple-50 text-brand-purple font-black px-2.5 py-1 rounded-full text-[11px]">
                        {c.totalOrders} orders
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-slate-900">{formatINR(c.totalSpent)}</td>
                    <td className="p-3.5 text-slate-500">{new Date(c.lastOrderDate).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
