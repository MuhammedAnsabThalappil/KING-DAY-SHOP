import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, X, FolderTree } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [age, setAge] = useState('');
  const [capacity, setCapacity] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Quick Create Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [catModalError, setCatModalError] = useState('');

  // Dynamic Lists
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [features, setFeatures] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories(true);
      const cats = Array.isArray(data) ? data : [];
      setCategories(cats);
      return cats;
    } catch (err) {
      console.warn('Failed to load categories:', err);
      setCategories([]);
      return [];
    }
  };

  useEffect(() => {
    loadCategories().then((cats) => {
      if (cats.length > 0 && cats[0]?.id && !categoryId) {
        setCategoryId(cats[0].id);
      }
    });
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')) {
      setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));
    }
  };

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__create_new__') {
      setIsCategoryModalOpen(true);
      setCatModalError('');
    } else {
      setCategoryId(val);
    }
  };

  const handleCreateNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatModalError('');

    if (!newCatName.trim()) {
      setCatModalError('Category Name is required.');
      return;
    }

    try {
      setIsCreatingCat(true);
      const created = await api.createCategory({
        name: newCatName.trim(),
        slug: newCatSlug.trim() || undefined,
        description: newCatDescription.trim() || undefined,
        image: newCatImage.trim() || undefined,
        active: true,
      });

      const updatedCats = await loadCategories();
      const targetId = created?.id || updatedCats.find((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())?.id;
      if (targetId) {
        setCategoryId(targetId);
      }

      // Reset modal inputs
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDescription('');
      setNewCatImage('');
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      setCatModalError(err.message || 'Failed to create category.');
    } finally {
      setIsCreatingCat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !sku || !description || !mrp || !salePrice || !categoryId) {
      setError('Please fill in all required fields (Name, SKU, Description, MRP, Sale Price, Category).');
      return;
    }

    setIsSubmitting(true);

    try {
      const validImages = imageUrls.filter((u) => u.trim() !== '');
      const validFeatures = features.filter((f) => f.trim() !== '');
      const validSpecs = specifications.filter((s) => s.key.trim() !== '' && s.value.trim() !== '');

      await api.createProduct({
        name,
        sku,
        slug: slug || undefined,
        description,
        mrp: parseFloat(mrp),
        salePrice: parseFloat(salePrice),
        stockQuantity: parseInt(stockQuantity, 10),
        categoryId,
        featured,
        active,
        age: age || undefined,
        capacity: capacity || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        images: validImages,
        features: validFeatures,
        specifications: validSpecs,
      });

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded-xl bg-gray-100 text-slate-600 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display">Add New Product</h1>
            <p className="text-xs text-slate-500">Create product entry in database catalogue.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Mercedes Benz Style 12V Electric Car"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU (Unique Code) *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. KDO-E01-MBZ"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Slug (URL identifier)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mercedes-benz-style-12v-electric-car"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assign Category *</label>
              <select
                required
                value={categoryId}
                onChange={handleCategorySelectChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple font-semibold text-slate-800"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                <option value="__create_new__" className="font-bold text-brand-purple bg-purple-50">
                  + Create New Category
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full detailed product description..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple"
            ></textarea>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
            Pricing & Stock Quantity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">MRP (Original Price ₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="18999"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sale Price (Selling Price ₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="12499"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple font-bold text-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple font-bold"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-display">Product Image URLs</h3>
            <button
              type="button"
              onClick={() => setImageUrls([...imageUrls, ''])}
              className="text-xs font-bold text-brand-purple flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image URL</span>
            </button>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={(e) => {
                    const updated = [...imageUrls];
                    updated[i] = e.target.value;
                    setImageUrls(updated);
                  }}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
            Attributes & Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Age Recommendation</label>
              <input
                type="text"
                placeholder="e.g. 2 - 6 Years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Weight / Capacity</label>
              <input
                type="text"
                placeholder="e.g. Up to 35 kg"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-purple"
            />
            <span>Publish Immediately (Active)</span>
          </label>

          <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-brand-purple"
            />
            <span>Feature on Homepage</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-brand-purple hover:bg-purple-700 text-white font-black px-8 py-4 rounded-2xl text-sm shadow-lg min-h-[48px]"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? 'Saving Product...' : 'SAVE & PUBLISH PRODUCT'}</span>
          </button>
        </div>
      </form>

      {/* QUICK CREATE CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 font-display flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-brand-purple" />
                <span>Create New Category</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catModalError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold">
                {catModalError}
              </div>
            )}

            <form onSubmit={handleCreateNewCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Electric Ride-On Bikes"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (URL Identifier)</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="electric-ride-on-bikes"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="Category summary..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 text-slate-700 font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCat}
                  className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold hover:bg-purple-700 shadow"
                >
                  {isCreatingCat ? 'Creating Category...' : 'Save & Select Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
