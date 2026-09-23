import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Search, Phone, FolderTree } from 'lucide-react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const CategoryView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          api.getCategoryBySlug(slug),
          api.getProducts({ categorySlug: slug, sort: sortOption, search: searchQuery || undefined, limit: 100 }),
        ]);
        setCategory(catData || null);
        setProducts(Array.isArray(prodData?.products) ? prodData.products : []);
      } catch (err) {
        console.warn('Failed to load category view:', err);
        setCategory(null);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug, sortOption, searchQuery]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded-3xl w-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <ProductCardSkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (!category && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-purple-100 text-brand-purple rounded-full flex items-center justify-center mx-auto">
          <FolderTree className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-slate-900 font-display">Category Not Found</h2>
          <p className="text-sm text-slate-500">
            The category you are looking for may have been moved or is temporarily unavailable.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/categories"
            className="inline-block bg-brand-purple hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
          >
            Browse All Categories
          </Link>
          <a
            href={generateGeneralWhatsAppUrl(`Hello KING DAY, I was looking for category '${slug}'`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-brand-purple transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/categories" className="hover:text-brand-purple transition-colors">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-brand-purple font-bold">{category?.name || slug}</span>
      </nav>

      {/* Category Banner Card */}
      {category && (
        <div className="bg-gradient-to-r from-brand-blue via-brand-purple to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
            <span className="bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {category.productCount ?? products.length} Products Available
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
              {category.name}
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed">
              {category.description || 'Explore our full catalogue of items in this category.'}
            </p>
          </div>

          {category.image && (
            <div className="w-full md:w-64 aspect-video rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0 z-10">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={`Search in ${category?.name || 'category'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 text-slate-600 font-semibold w-full sm:w-auto justify-end">
          <span>Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-50 border border-gray-200 font-bold text-brand-purple rounded-xl p-2 focus:outline-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-lg font-bold text-slate-800">No products found in this category</h3>
          <p className="text-xs text-slate-500">Check back soon for new arrivals in {category?.name}.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-blue text-white text-xs font-bold px-5 py-2.5 rounded-full shadow"
          >
            Browse All Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
