import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, MapPin, Trash2, Eye, RefreshCw, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { formatINR } from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getOrders({ status: statusFilter, search, limit: 100 });
      setOrders(res.orders || []);
    } catch (err) {
      console.warn('Failed to load admin orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-300',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    Processing: 'bg-purple-100 text-purple-800 border-purple-300',
    Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Order Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage all WhatsApp customer orders, statuses & dispatch details.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center space-x-1.5 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-brand-purple text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading customer orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">City & State</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-slate-900">{ord.orderNumber}</td>
                    <td className="p-3.5">
                      <strong className="text-slate-900 block">{ord.customerName}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">{ord.phone}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {ord.city}, {ord.state}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {ord.items?.length || 0} items
                    </td>
                    <td className="p-3.5 font-black text-slate-900">{formatINR(ord.total)}</td>
                    <td className="p-3.5">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          statusColors[ord.orderStatus] || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-purple-50 text-brand-purple hover:bg-purple-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">Order Summary</span>
                <h3 className="text-xl font-black text-slate-900 font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <strong className="text-slate-900 text-sm block">{selectedOrder.customerName}</strong>
                <p>Phone: <strong className="text-slate-900 font-mono">{selectedOrder.phone}</strong></p>
                <p>Address: {selectedOrder.address}{selectedOrder.apartment ? `, ${selectedOrder.apartment}` : ''}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                {selectedOrder.notes && <p className="text-brand-purple pt-1">Notes: {selectedOrder.notes}</p>}
              </div>

              <div>
                <strong className="text-slate-900 block mb-2 uppercase tracking-wider text-[11px]">Ordered Products</strong>
                <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <span className="text-[11px] text-slate-400">Qty: {item.quantity} x {formatINR(item.price)}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatINR(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-right space-y-1 text-xs">
                <div>Subtotal: <strong>{formatINR(selectedOrder.subtotal)}</strong></div>
                <div>Shipping: <strong>{selectedOrder.shipping === 0 ? 'FREE' : formatINR(selectedOrder.shipping)}</strong></div>
                <div className="text-base font-black text-slate-900 pt-1">Total: <span className="text-brand-purple">{formatINR(selectedOrder.total)}</span></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
