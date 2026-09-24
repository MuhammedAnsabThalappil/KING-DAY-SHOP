import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, X, FolderTree, Upload, Star, ArrowRight } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

interface ProductImageItem {
  id?: string;
  url: string;
  isPrimary: boolean;
}

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Quick Create Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [catModalError, setCatModalError] = useState('');

  // Images State
  const [images, setImages] = useState<ProductImageItem[]>([]);

  // Dynamic Lists
  const [features, setFeatures] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);

  const loadCategories = async () => {
    try {
      const catData = await api.getCategories(true);
      const cats = Array.isArray(catData) ? catData : [];
      setCategories(cats);
      return cats;
    } catch (err) {
      console.warn('Failed to load categories:', err);
      setCategories([]);
      return [];
    }
  };

  useEffect(() => {
    const loadProductAndCategories = async () => {
      if (!id) return;
      try {
        await loadCategories();

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
            setImages(
              target.images.map((img, i) => ({
                id: img.id,
                url: img.url,
                isPrimary: Boolean(img.isPrimary || i === 0),
              }))
            );
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

  // Image Handlers
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string;
        if (dataUrl) {
          setImages((prev) => [
            ...prev,
            { url: dataUrl, isPrimary: prev.length === 0 },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddUrlInput = () => {
    setImages((prev) => [
      ...prev,
      { url: '', isPrimary: prev.length === 0 },
    ]);
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const wasPrimary = prev[index]?.isPrimary;
      const updated = prev.filter((_, i) => i !== index);
      if (wasPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleUrlChange = (index: number, url: string) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], url };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setIsSubmitting(true);

    try {
      const validImages = images.filter((img) => img.url.trim() !== '');
      let finalImages = validImages.map((img, idx) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
        displayOrder: idx + 1,
      }));

      if (finalImages.length > 0 && !finalImages.some((img) => img.isPrimary)) {
        finalImages[0].isPrimary = true;
      }

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
        images: finalImages,
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
                onChange={handleCategorySelectChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-semibold text-slate-800"
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

        {/* PRODUCT IMAGES UPLOAD & MANAGEMENT */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Product Images</h3>
              <p className="text-xs text-slate-500">Upload multiple photos, drag/reorder, set primary cover photo.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-purple-700 flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
              <button
                type="button"
                onClick={handleAddUrlInput}
                className="px-4 py-2.5 bg-purple-50 text-brand-purple text-xs font-bold rounded-xl hover:bg-purple-100 flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
              />
            </div>
          </div>

          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-purple hover:bg-purple-50/40 transition-all group"
            >
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-brand-purple mx-auto mb-2 transition-colors" />
              <p className="text-xs font-bold text-slate-700">Click to Upload Product Images</p>
              <p className="text-[11px] text-slate-400 mt-1">Supports multiple image files or pasting external URLs</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group bg-gray-50 rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                    img.isPrimary
                      ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md bg-amber-50/20'
                      : 'border-gray-200 hover:border-brand-purple'
                  }`}
                >
                  <div className="aspect-square w-full relative bg-gray-100">
                    <img
                      src={img.url || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=400'}
                      alt={`Product image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=400';
                      }}
                    />

                    {/* Primary Badge */}
                    {img.isPrimary ? (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>PRIMARY</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="absolute top-2 left-2 bg-black/60 hover:bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set Primary</span>
                      </button>
                    )}

                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, -1)}
                          title="Move Left"
                          className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 1)}
                          title="Move Right"
                          className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove Image"
                        className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg shadow transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2 bg-white border-t border-gray-100">
                    <input
                      type="text"
                      value={img.url.startsWith('data:') ? 'Local Image File' : img.url}
                      readOnly={img.url.startsWith('data:')}
                      onChange={(e) => handleUrlChange(idx, e.target.value)}
                      placeholder="Paste Image URL"
                      className="w-full text-[10px] p-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none font-mono text-slate-600 truncate"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
