import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, ArrowRight, ShieldCheck, Heart, Star, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catData, featuredData, newestData] = await Promise.all([
          api.getCategories(),
          api.getProducts({ featured: true, limit: 4 }),
          api.getProducts({ limit: 4, sort: 'newest' }),
        ]);
        setCategories(catData);
        setFeaturedProducts(featuredData.products);
        setNewArrivals(newestData.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-purple to-slate-900 text-white py-16 lg:py-24 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,79,163,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-brand-yellow font-bold text-xs uppercase tracking-widest shadow-inner">
                <Sparkles className="w-4 h-4" />
                <span>KING DAY • Fun • Quality • Happiness</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-display">
                Make Every Ride <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-pink to-white">
                  More Fun & Exciting
                </span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover Kerala's premier catalogue for kids electric ride-on cars, heavy duty 4x4 jeeps, educational toys, balance bikes, and baby accessories.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-black px-8 py-4 rounded-full text-base shadow-glow-yellow hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[48px]"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href={generateGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-full text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[48px]"
                >
                  <Phone className="w-5 h-5 fill-current" />
                  <span>WHATSAPP US</span>
                </a>
              </div>

              {/* Mini Features Banner */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
                <div>
                  <strong className="block text-white font-bold text-sm">100% Quality</strong>
                  <span>Tested & Safe</span>
                </div>
                <div>
                  <strong className="block text-white font-bold text-sm">Kerala Delivery</strong>
                  <span>Quick Dispatch</span>
                </div>
                <div>
                  <strong className="block text-white font-bold text-sm">Direct WhatsApp</strong>
                  <span>Easy Ordering</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none aspect-square rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl shadow-purple-900/50 group">
                <img
                  src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=1000"
                  alt="Mercedes Electric Ride-On Car"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-1">
                    Featured Ride-On
                  </span>
                  <h3 className="text-xl font-bold text-white">Mercedes Benz Style 12V Electric Car</h3>
                  <p className="text-xs text-brand-yellow font-bold mt-1">Dual Motors • Parent Remote • Bluetooth MP3</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">
              Explore Our Collection
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-sm font-bold text-brand-purple hover:text-brand-pink inline-flex items-center space-x-1 mt-2 md:mt-0 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 mb-4">
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-purple transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-bold bg-purple-50 text-brand-purple px-2.5 py-1 rounded-full">
                    {cat.productCount ?? 0} Products
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || 'Discover premium items for kids.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center text-xs font-bold text-brand-purple group-hover:translate-x-1 transition-transform">
                <span>VIEW PRODUCTS</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-pink uppercase tracking-widest">
              Handpicked Excellence
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-sm font-bold text-brand-purple hover:text-brand-pink inline-flex items-center space-x-1 mt-2 md:mt-0"
          >
            <span>Browse All Featured</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. NEW ARRIVALS SECTION */}
      <section className="bg-gradient-to-b from-gray-100/70 to-white py-12 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                <span>Just Added To Store</span>
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="text-sm font-bold text-brand-purple hover:text-brand-pink inline-flex items-center space-x-1 mt-2 md:mt-0"
            >
              <span>View All New Additions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE KING DAY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-blue rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-purple/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-yellow font-bold text-xs uppercase tracking-widest">
              Why Families Trust Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display mt-2">
              Why Choose KING DAY?
            </h2>
            <p className="text-slate-300 text-sm mt-3">
              We are committed to delivering genuine joy, uncompromised quality, and transparent WhatsApp service for every family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 text-brand-pink mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Premium Quality & Safety</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All electric ride-ons and toys are built with non-toxic materials, safety belts, and sturdy frames tested for child safety.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellow mx-auto flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Transparent INR Pricing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every price is displayed clearly in Indian Rupees (₹). No hidden costs or payment gateway surcharges.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Instant WhatsApp Ordering</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct one-click connection to our WhatsApp team for stock verification, video previews, and Kerala delivery support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-display">
              Have a question about a product?
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Chat directly with our team on WhatsApp for live product availability, features clarification, and delivery details.
            </p>
          </div>

          <a
            href={generateGeneralWhatsAppUrl('Hello KING DAY, I want to inquire about your product catalogue.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-white text-emerald-950 font-black px-8 py-4 rounded-full text-base shadow-2xl hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-100 flex-shrink-0 min-h-[48px]"
          >
            <Phone className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <span>CHAT ON WHATSAPP NOW</span>
          </a>
        </div>
      </section>
    </div>
  );
};
