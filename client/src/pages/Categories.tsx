import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';
import { CategoryCardSkeleton } from '../components/ui/SkeletonLoader';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
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
      )}
    </div>
  );
};
