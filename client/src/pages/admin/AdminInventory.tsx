import React, { useState, useEffect } from 'react';
import { Search, Save, AlertTriangle, XCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL, OUT, LOW, IN
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({ limit: 200, includeInactive: true });
      const prods = Array.isArray(res?.products) ? res.products : [];
      setProducts(prods);

      const initialStock: Record<string, number> = {};
      prods.forEach((p) => {
        initialStock[p.id] = p.stockQuantity;
      });
      setEditingStock(initialStock);
    } catch (err) {
      console.warn('Failed to load inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id: string, val: number) => {
    setEditingStock((prev) => ({ ...prev, [id]: Math.max(0, val) }));
  };

  const handleSaveStock = async (id: string) => {
    const newQty = editingStock[id];
    if (newQty === undefined) return;
    try {
      setSavingId(id);
      await api.updateInventory(id, newQty);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stockQuantity: newQty } : p))
      );
    } catch (err) {
      alert('Failed to update stock quantity.');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (stockFilter === 'OUT') return p.stockQuantity <= 0;
    if (stockFilter === 'LOW') return p.stockQuantity > 0 && p.stockQuantity <= 3;
    if (stockFilter === 'IN') return p.stockQuantity > 3;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Inventory Control</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor stock levels, update SKU quantities & clear low-stock alerts.</p>
        </div>
        <button
          onClick={fetchInventory}
          className="inline-flex items-center space-x-1.5 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search SKU or product title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>

        <div className="flex items-center space-x-2">
          {[
            { key: 'ALL', label: 'All Stock' },
            { key: 'OUT', label: 'Out of Stock' },
            { key: 'LOW', label: 'Low Stock (≤3)' },
            { key: 'IN', label: 'In Stock' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStockFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                stockFilter === tab.key ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No inventory items match filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-3.5">Product & SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Stock Quantity</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => {
                  const currentQty = editingStock[p.id] ?? p.stockQuantity;
                  const isOut = p.stockQuantity <= 0;
                  const isLow = p.stockQuantity > 0 && p.stockQuantity <= 3;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=100'}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <strong className="text-slate-900 block font-bold text-xs line-clamp-1">{p.name}</strong>
                            <span className="text-[10px] font-mono text-slate-400">SKU: {p.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">{p.category?.name || 'Uncategorized'}</td>
                      <td className="p-3.5 font-bold text-slate-900">{formatINR(p.salePrice)}</td>
                      <td className="p-3.5">
                        {isOut ? (
                          <span className="inline-flex items-center space-x-1 text-red-600 bg-red-50 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock ({p.stockQuantity})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                          />
                          <span className="text-slate-400 text-[11px]">units</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleSaveStock(p.id)}
                          disabled={savingId === p.id || currentQty === p.stockQuantity}
                          className="inline-flex items-center space-x-1 bg-brand-purple hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-40"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === p.id ? 'Saving...' : 'Save Stock'}</span>
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
