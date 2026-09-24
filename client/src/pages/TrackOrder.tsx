import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, Phone } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR, generateGeneralWhatsAppUrl } from '../utils/formatters';

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchInput, setSearchInput] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrderByIdOrNumber(id.trim());
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError('Order not found. Please check your Order ID or registered Mobile Number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const steps = [
    { key: 'Pending', label: 'Order Received', desc: 'Awaiting team verification', icon: Clock },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Order approved & packed', icon: CheckCircle2 },
    { key: 'Processing', label: 'Processing', desc: 'Dispatched to courier hub', icon: PackageCheck },
    { key: 'Shipped', label: 'Out for Delivery', desc: 'In transit to address', icon: Truck },
    { key: 'Delivered', label: 'Delivered', desc: 'Package delivered safely', icon: CheckCircle2 },
  ];

  const getStepIndex = (statusStr: string) => {
    const s = statusStr?.toLowerCase() || 'pending';
    if (s.includes('deliver')) return 4;
    if (s.includes('ship')) return 3;
    if (s.includes('process')) return 2;
    if (s.includes('confirm')) return 1;
    return 0;
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display">Track Your Order</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your Order ID (e.g. KD-100234) or Mobile Number to check real-time status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order ID or Mobile Number..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-gradient text-white font-bold py-3 px-8 rounded-2xl shadow hover:opacity-95 transition-all text-sm"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center space-x-3 mb-6 font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Tracking Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-8 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-2">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Order Reference</span>
                <span className="text-xl font-black text-slate-900 font-mono">{order.orderNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-purple-50 text-brand-purple text-xs font-black px-3 py-1 rounded-full uppercase border border-purple-200">
                  {order.orderStatus}
                </span>
                <a
                  href={generateGeneralWhatsAppUrl(`Hi KING DAY, checking status for Order ${order.orderNumber}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp Updates</span>
                </a>
              </div>
            </div>

            {/* Stepper */}
            <div className="py-4">
              <div className="relative flex justify-between items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10 bg-white px-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-slate-100 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-bold mt-2 text-center hidden sm:block ${
                          isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items & Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Customer & Address</span>
                <p><strong className="text-slate-800">{order.customerName}</strong></p>
                <p>{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                <p className="font-mono">Phone: {order.phone}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Order Summary</span>
                <p>Items Count: {order.items?.length || 0}</p>
                <p>Total Paid/Due: <strong className="text-brand-purple font-black">{formatINR(order.total)}</strong></p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
