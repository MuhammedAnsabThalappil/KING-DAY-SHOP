import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Phone, ShoppingBag } from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';
import { CategoryCardSkeleton } from '../components/ui/SkeletonLoader';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Failed to load categories:', err);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-1 bg-purple-100 text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Collections</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
          All Product Categories
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Explore our complete range of electric ride-ons, educational toys, cycles, and baby care accessories. Select a category below to view available items.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <CategoryCardSkeleton key={n} />
          ))}
        </div>
      ) : Array.isArray(categories) && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 mb-5 relative">
                  <img
                    src={
                      cat.image ||
                      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600'
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  <span className="absolute top-3 right-3 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {cat.productCount ?? 0} Products
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-xl group-hover:text-brand-purple transition-colors font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                  {cat.description || 'Quality tested products for kids.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-purple">
                <span>VIEW PRODUCTS</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-slate-900 font-display">Categories Updating</h3>
          <p className="text-sm text-slate-500">
            Our category catalogue is being synchronized. You can browse all available items in the shop or message us on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-blue hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Shop</span>
            </Link>
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>WhatsApp Catalogue</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
