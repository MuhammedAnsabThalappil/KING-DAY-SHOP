import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Category, Product } from '../../types';
import { api } from '../../services/api';

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [age, setAge] = useState('');
  const [capacity, setCapacity] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Dynamic Lists
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [features, setFeatures] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

  useEffect(() => {
    const loadProductAndCategories = async () => {
      if (!id) return;
      try {
        const catData = await api.getCategories(true);
        setCategories(Array.isArray(catData) ? catData : []);

        // Fetch target product via API list filter or detail
        const res = await api.getProducts({ includeInactive: true, limit: 200 });
        const target = Array.isArray(res?.products) ? res.products.find((p) => p.id === id) : undefined;

        if (target) {
          setName(target.name);
          setSku(target.sku);
          setSlug(target.slug);
          setDescription(target.description);
          setMrp(target.mrp.toString());
          setSalePrice(target.salePrice.toString());
          setStockQuantity(target.stockQuantity.toString());
          setCategoryId(target.categoryId);
          setFeatured(target.featured);
          setActive(target.active);
          setAge(target.age || '');
          setCapacity(target.capacity || '');
          setSeoTitle(target.seoTitle || '');
          setSeoDescription(target.seoDescription || '');

          if (target.images && target.images.length > 0) {
            setImageUrls(target.images.map((img) => img.url));
          }
          if (target.features && target.features.length > 0) {
            setFeatures(target.features.map((f) => f.feature));
          }
          if (target.specifications && target.specifications.length > 0) {
            setSpecifications(target.specifications.map((s) => ({ key: s.key, value: s.value })));
          }
        } else {
          setError('Product not found in database.');
        }
      } catch (err) {
        console.error('Failed to load product edit data:', err);
        setError('Error loading product data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductAndCategories();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setIsSubmitting(true);

    try {
      const validImages = imageUrls.filter((u) => u.trim() !== '');
      const validFeatures = features.filter((f) => f.trim() !== '');
      const validSpecs = specifications.filter((s) => s.key.trim() !== '' && s.value.trim() !== '');

      await api.updateProduct(id, {
        name,
        sku,
        slug,
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
      setError(err.message || 'Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-black text-slate-900 font-display">Edit Product</h1>
            <p className="text-xs text-slate-500">Update product specs, price, images, and category assignment.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
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
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category Assignment *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-semibold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple"
            ></textarea>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
            Pricing & Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
              <input
                type="number"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sale Price (₹) *</label>
              <input
                type="number"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-display">Product Image URLs</h3>
            <button
              type="button"
              onClick={() => setImageUrls([...imageUrls, ''])}
              className="font-bold text-brand-purple flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image URL</span>
            </button>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const updated = [...imageUrls];
                    updated[i] = e.target.value;
                    setImageUrls(updated);
                  }}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl"
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

        {/* Toggles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-purple"
            />
            <span>Active (Visible on Storefront)</span>
          </label>

          <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-brand-purple"
            />
            <span>Featured Product</span>
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
            <span>{isSubmitting ? 'Updating...' : 'UPDATE PRODUCT'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
