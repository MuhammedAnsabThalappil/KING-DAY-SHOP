import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Check, ArrowUpDown } from 'lucide-react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States initialized from URL params
  const categoryParam = searchParams.get('category') || searchParams.get('categorySlug') || '';
  const searchParam = searchParams.get('search') || '';
  const featuredParam = searchParams.get('featured') === 'true';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(featuredParam);
  const [isInStockOnly, setIsInStockOnly] = useState(inStockParam);
  const [sortOption, setSortOption] = useState(sortParam);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await api.getCategories();
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.warn('Failed to load categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({
          categorySlug: selectedCategory || undefined,
          search: searchQuery || undefined,
          featured: isFeaturedOnly || undefined,
          inStock: isInStockOnly || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sortOption,
          limit: 100,
        });
        setProducts(Array.isArray(res?.products) ? res.products : []);
        setTotalProducts(res?.pagination?.total ?? 0);
      } catch (err) {
        console.warn('Failed to fetch products:', err);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, searchQuery, isFeaturedOnly, isInStockOnly, sortOption, minPrice, maxPrice]);

  const updateCategoryFilter = (slug: string) => {
    setSelectedCategory(slug);
    if (slug) {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setIsFeaturedOnly(false);
    setIsInStockOnly(false);
    setSortOption('newest');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
            Shop Catalogue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse all kids electric ride-ons, toys, cycles, and baby accessories ({totalProducts} items available).
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
            <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-brand-purple">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center space-x-2 bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow min-h-[44px]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden md:block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Filter className="w-4 h-4 text-brand-purple" />
              <span>Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-brand-pink hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => updateCategoryFilter('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-brand-purple text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {Array.isArray(categories) && categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => updateCategoryFilter(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-purple text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.productCount ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Checkbox Filters */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability & Status</h4>
            <label className="flex items-center space-x-2.5 cursor-pointer text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isInStockOnly}
                onChange={(e) => setIsInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple border-gray-300"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isFeaturedOnly}
                onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple border-gray-300"
              />
              <span>Featured Products Only</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort Order</h4>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="newest">Newest Additions</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Product Name (A-Z)</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS CATALOGUE GRID */}
        <main className="md:col-span-3 space-y-6">
          
          {/* Filter Pill Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs">
            <div className="flex items-center space-x-2 text-slate-500">
              <span>Showing <strong>{products.length}</strong> products</span>
              {selectedCategory && (
                <span className="bg-purple-100 text-brand-purple font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => updateCategoryFilter('')} />
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent font-bold text-brand-purple focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price Low → High</option>
                <option value="price-high">Price High → Low</option>
                <option value="name-asc">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Grid Render */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Products Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your current filter criteria. Try resetting filters or search term.
              </p>
              <button
                onClick={resetFilters}
                className="bg-brand-blue text-white font-bold px-6 py-2.5 rounded-full text-sm shadow hover:bg-brand-purple transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER BOTTOM DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Filter Products</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
              <button
                onClick={() => {
                  updateCategoryFilter('');
                  setIsMobileFilterOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                  !selectedCategory ? 'bg-brand-purple text-white font-bold' : 'text-slate-700 bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {Array.isArray(categories) && categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => {
                    updateCategoryFilter(cat.slug);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium ${
                    selectedCategory === cat.slug ? 'bg-brand-purple text-white font-bold' : 'text-slate-700 bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs">{cat.productCount ?? 0}</span>
                </button>
              ))}
            </div>

            {/* Mobile Checkboxes */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock & Featured</h4>
              <label className="flex items-center space-x-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isInStockOnly}
                  onChange={(e) => setIsInStockOnly(e.target.checked)}
                  className="rounded text-brand-purple"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isFeaturedOnly}
                  onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                  className="rounded text-brand-purple"
                />
                <span>Featured Only</span>
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl shadow min-h-[44px]"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
