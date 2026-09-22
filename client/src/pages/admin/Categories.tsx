import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree, AlertTriangle, X, Check } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [active, setActive] = useState(true);
  const [formError, setFormError] = useState('');

  // Deletion Modal State for Safe Deletion check
  const [deletionTarget, setDeletionTarget] = useState<{ category: Category; productCount: number } | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCategories(true);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setDisplayOrder(categories.length ? (categories.length + 1).toString() : '1');
    setActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(cat.displayOrder.toString());
    setActive(cat.active);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory && (!slug || slug === val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'))) {
      setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    try {
      const payload = {
        name,
        slug: slug || undefined,
        description,
        image,
        displayOrder: parseInt(displayOrder, 10) || 0,
        active,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
      } else {
        await api.createCategory(payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category.');
    }
  };

  const handleDeleteClick = async (cat: Category) => {
    try {
      // Attempt standard deletion API call
      await api.deleteCategory(cat.id);
      fetchCategories();
    } catch (err: any) {
      // Check if backend returned productCount requirement conflict (409)
      if (err.message && err.message.includes('contains')) {
        setDeletionTarget({ category: cat, productCount: cat.productCount || 0 });
        const remaining = categories.filter((c) => c.id !== cat.id);
        if (remaining.length > 0) {
          setReassignTargetId(remaining[0].id);
        }
      } else {
        alert(err.message || 'Failed to delete category.');
      }
    }
  };

  const executeReassignAndDelete = async () => {
    if (!deletionTarget || !reassignTargetId) return;
    try {
      await api.deleteCategory(deletionTarget.category.id, { targetCategoryId: reassignTargetId });
      setDeletionTarget(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to reassign and delete category.');
    }
  };

  const executeDeactivateCategory = async () => {
    if (!deletionTarget) return;
    try {
      await api.updateCategory(deletionTarget.category.id, { active: false });
      setDeletionTarget(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate category.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Category Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize products into categories, set display order, and upload images.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-brand-purple hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE CATEGORY</span>
        </button>
      </div>

      {/* Categories Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between space-y-4 ${
              !cat.active ? 'border-dashed border-gray-300 opacity-60' : 'border-gray-100'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                  Order: #{cat.displayOrder}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    cat.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {cat.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {cat.image && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <h3 className="font-bold text-slate-900 text-lg font-display">{cat.name}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">/{cat.slug}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-full">
                {cat.productCount ?? 0} Products
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 bg-gray-100 hover:bg-brand-purple hover:text-white text-slate-700 rounded-xl transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(cat)}
                  className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 font-display">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Kids Ride-On"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (SEO URL Identifier)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kids-ride-on"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of products in this category..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Banner Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order #</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer pb-3">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-purple"
                    />
                    <span>Active Category</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 text-slate-700 font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold hover:bg-purple-700 shadow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAFE CATEGORY DELETION MODAL */}
      {deletionTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Category Contains Products
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Category <strong className="text-slate-900 font-bold">"{deletionTarget.category.name}"</strong> currently contains <strong className="text-brand-purple font-bold">{deletionTarget.productCount} products</strong>. To prevent orphaned products, choose an action below:
            </p>

            <div className="space-y-4 pt-2">
              {/* Option 1: Reassign */}
              {categories.filter((c) => c.id !== deletionTarget.category.id).length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Option A: Reassign Products To Another Category</label>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {categories
                      .filter((c) => c.id !== deletionTarget.category.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={executeReassignAndDelete}
                    className="w-full bg-brand-purple text-white font-bold py-2.5 rounded-xl text-xs shadow hover:bg-purple-700"
                  >
                    REASSIGN & DELETE CATEGORY
                  </button>
                </div>
              )}

              {/* Option 2: Deactivate */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Option B: Hide Category from Storefront</label>
                <button
                  onClick={executeDeactivateCategory}
                  className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900"
                >
                  DEACTIVATE CATEGORY
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setDeletionTarget(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
