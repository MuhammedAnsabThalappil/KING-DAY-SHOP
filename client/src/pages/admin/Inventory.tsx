import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({ search: searchQuery || undefined, includeInactive: true, limit: 200 });
      const prods = Array.isArray(res?.products) ? res.products : [];
      setProducts(prods);

      const initialEdits: Record<string, number> = {};
      prods.forEach((p) => {
        initialEdits[p.id] = p.stockQuantity;
      });
      setStockEdits(initialEdits);
    } catch (err) {
      console.warn('Failed to load inventory:', err);
      setProducts([]);
      setStockEdits({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [searchQuery]);

  const handleStockChange = (id: string, val: string) => {
    const parsed = parseInt(val, 10);
    setStockEdits((prev) => ({
      ...prev,
      [id]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const saveStock = async (id: string) => {
    setSavingId(id);
    try {
      const newStock = stockEdits[id] ?? 0;
      await api.updateInventory(id, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stockQuantity: newStock } : p))
      );
    } catch (err) {
      alert('Failed to update stock quantity.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Inventory Fast-Editor</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly update stock quantities across all catalogue items.
          </p>
        </div>

        <div className="relative w-full sm:w-64 text-xs">
          <input
            type="text"
            placeholder="Search by product or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
            Loading inventory records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Calculated Status</th>
                  <th className="py-3.5 px-4">Stock Quantity</th>
                  <th className="py-3.5 px-4 text-right">Quick Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const currentEditVal = stockEdits[p.id] ?? p.stockQuantity;
                  const isDirty = currentEditVal !== p.stockQuantity;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>

                      <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{p.sku}</td>

                      <td className="py-3 px-4">
                        <span className="bg-purple-50 text-brand-purple px-2.5 py-1 rounded-full font-semibold">
                          {p.category?.name || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {currentEditVal <= 0 ? (
                          <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>OUT OF STOCK</span>
                          </span>
                        ) : currentEditVal <= 5 ? (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>LOW STOCK</span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>IN STOCK</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          value={currentEditVal}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className={`w-24 p-2 border rounded-xl font-bold text-sm text-center focus:outline-none ${
                            isDirty ? 'border-brand-pink bg-pink-50/50' : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => saveStock(p.id)}
                          disabled={savingId === p.id}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ml-auto ${
                            isDirty
                              ? 'bg-brand-purple hover:bg-purple-700 text-white shadow-md'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === p.id ? 'Saving...' : isDirty ? 'Update' : 'Saved'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
