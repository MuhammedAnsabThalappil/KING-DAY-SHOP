import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Category, Product } from '../../types';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState(''); // 'all', 'in', 'low', 'out'
  const [statusFilter, setStatusFilter] = useState(''); // 'all', 'active', 'inactive'

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({
          search: searchQuery || undefined,
          categorySlug: selectedCategory || undefined,
          inStock: stockFilter === 'in' ? true : undefined,
          includeInactive: true,
          limit: 200,
        }),
        api.getCategories(true),
      ]);

      let filtered = prodRes.products;

      if (stockFilter === 'low') {
        filtered = filtered.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5);
      } else if (stockFilter === 'out') {
        filtered = filtered.filter((p) => p.stockQuantity <= 0);
      }

      if (statusFilter === 'active') {
        filtered = filtered.filter((p) => p.active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter((p) => !p.active);
      }

      setProducts(filtered);
      setCategories(catRes);
    } catch (err) {
      console.error('Failed to load products list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [searchQuery, selectedCategory, stockFilter, statusFilter]);

  const toggleActive = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { active: !product.active });
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to update active status.');
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { featured: !product.featured });
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to update featured status.');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete '${product.name}'?`)) {
      try {
        await api.deleteProduct(product.id);
        fetchProductsAndCategories();
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage prices, stock levels, categories, images, and active status.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center space-x-2 bg-brand-purple hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW PRODUCT</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Stock Levels</option>
          <option value="in">In Stock (&gt; 0)</option>
          <option value="low">Low Stock (1-5)</option>
          <option value="out">Out of Stock (0)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Table Render */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
            Loading products database...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm space-y-2">
            <p className="font-bold">No products match your filter criteria.</p>
            <p className="text-xs text-slate-400">Try broadening your search or filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">MRP / Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=200';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img src={img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <Link
                              to={`/product/${p.slug}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-brand-purple line-clamp-1"
                            >
                              {p.name}
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{p.sku}</td>

                      <td className="py-3 px-4">
                        <span className="bg-purple-50 text-brand-purple px-2.5 py-1 rounded-full font-semibold">
                          {p.category?.name || 'Unassigned'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{formatINR(p.salePrice)}</div>
                        {p.mrp > p.salePrice && (
                          <div className="text-[10px] text-slate-400 line-through">{formatINR(p.mrp)}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.stockQuantity <= 0 ? (
                          <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                            <XCircle className="w-3 h-3" />
                            <span>Out (0)</span>
                          </span>
                        ) : p.stockQuantity <= 5 ? (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low ({p.stockQuantity})</span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{p.stockQuantity}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleActive(p)}
                          className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors ${
                            p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.featured ? 'bg-amber-100 text-amber-700' : 'text-gray-300 hover:text-gray-500'
                          }`}
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 bg-gray-100 text-slate-700 rounded-lg hover:bg-brand-purple hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
