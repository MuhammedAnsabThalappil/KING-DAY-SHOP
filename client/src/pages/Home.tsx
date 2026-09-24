import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, ArrowRight, ShieldCheck, ChevronRight, Zap, RefreshCw, Truck, Heart, ShoppingBag, Star, Award } from 'lucide-react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton, CategoryCardSkeleton } from '../components/ui/SkeletonLoader';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [rideOnProducts, setRideOnProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadHomeData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [catData, featuredData, newestData, rideOnData] = await Promise.all([
        api.getCategories(),
        api.getProducts({ featured: true, limit: 8 }),
        api.getProducts({ limit: 8, sort: 'newest' }),
        api.getProducts({ categorySlug: 'kids-ride-on', limit: 4 }),
      ]);
      setCategories(Array.isArray(catData) ? catData : []);
      setFeaturedProducts(Array.isArray(featuredData?.products) ? featuredData.products : []);
      setNewArrivals(Array.isArray(newestData?.products) ? newestData.products : []);
      setRideOnProducts(Array.isArray(rideOnData?.products) ? rideOnData.products : []);
    } catch (err) {
      console.error('Failed to load homepage data:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Left */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-brand-yellow font-bold text-xs uppercase tracking-widest shadow-inner">
                <Sparkles className="w-4 h-4 text-brand-yellow" />
                <span>KING DAY • Fun • Quality • Happiness</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-display">
                Make Every Ride <br className="hidden sm:inline" />
                <span className="text-gradient">
                  More Fun & Unforgettable
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover Kerala's premier store for kids electric ride-on cars, 4x4 jeeps, RC toys, bicycles, and baby care accessories. Quality tested for safety and endless smiles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-gradient text-white font-black px-8 py-4 rounded-full text-base shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[50px]"
                >
                  <span>EXPLORE CATALOGUE</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href={generateGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-full text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[50px]"
                >
                  <Phone className="w-5 h-5 fill-current" />
                  <span>WHATSAPP ORDER</span>
                </a>
              </div>

              {/* Mini Features Banner */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
                <div>
                  <strong className="block text-white font-bold text-sm">100% Quality</strong>
                  <span>Certified & Safe</span>
                </div>
                <div>
                  <strong className="block text-white font-bold text-sm">Kerala Dispatch</strong>
                  <span>Quick Shipping</span>
                </div>
                <div>
                  <strong className="block text-white font-bold text-sm">WhatsApp Orders</strong>
                  <span>Instant Support</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none aspect-square rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=1000"
                  alt="Electric Ride-On Car"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="bg-brand-pink text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-2">
                    🔥 BESTSELLER RIDE-ON
                  </span>
                  <h3 className="text-2xl font-black text-white font-display">Mercedes Benz 12V 4x4 Electric Jeep</h3>
                  <p className="text-xs text-brand-yellow font-bold mt-1">Dual Motors • Parent Bluetooth Remote • Suspension</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMO GRID BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-brand-yellow">SUPER SAVINGS</span>
              <h3 className="text-2xl font-black font-display leading-tight">Kids Electric Ride-Ons</h3>
              <p className="text-xs text-purple-200">Cars, Jeeps, Superbikes & ATVs with remote control</p>
            </div>
            <Link to="/category/kids-ride-on" className="mt-6 inline-flex items-center text-xs font-black text-brand-yellow group-hover:underline">
              <span>EXPLORE RIDE-ONS →</span>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-rose-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white">FUN & LEARNING</span>
              <h3 className="text-2xl font-black font-display leading-tight">Educational & RC Toys</h3>
              <p className="text-xs text-rose-100">STEM building kits, remote helicopters & dolls</p>
            </div>
            <Link to="/category/kids-toys" className="mt-6 inline-flex items-center text-xs font-black text-white group-hover:underline">
              <span>EXPLORE TOYS →</span>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-cyan-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-brand-yellow">ACTIVE PLAY</span>
              <h3 className="text-2xl font-black font-display leading-tight">Bicycles & Tricycles</h3>
              <p className="text-xs text-cyan-200">Balance bikes, training wheels & sturdy helmets</p>
            </div>
            <Link to="/category/cycles" className="mt-6 inline-flex items-center text-xs font-black text-brand-yellow group-hover:underline">
              <span>EXPLORE CYCLES →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">
              Explore Our Collections
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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <CategoryCardSkeleton key={n} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/category/${cat.slug}`}
                className="group bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 mb-4">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600'}
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
                      {cat.productCount ?? 0} Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || 'Premium items for kids & toddlers.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-bold text-brand-purple group-hover:translate-x-1 transition-transform">
                  <span>BROWSE CATEGORY</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-pink uppercase tracking-widest flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Handpicked Specials</span>
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-sm font-bold text-brand-purple hover:text-brand-pink inline-flex items-center space-x-1 mt-2 md:mt-0 transition-colors"
          >
            <span>View All Featured</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 5. RIDE-ON SPOTLIGHT SECTION */}
      {rideOnProducts.length > 0 && (
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest">
                  Heavy Duty Ride-On Cars
                </span>
                <h2 className="text-3xl font-black font-display mt-1 text-white">
                  Electric Ride-On Cars & Jeeps
                </h2>
              </div>
              <Link to="/category/kids-ride-on" className="text-brand-yellow hover:underline text-sm font-bold mt-2 md:mt-0">
                Explore All Ride-Ons →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rideOnProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TRUST & VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-2xl flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-display">Tested Quality</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Safety certified materials and heavy duty build for active play.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-brand-pink/10 text-brand-pink rounded-2xl flex-shrink-0">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-display">Kerala Delivery</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Fast dispatch across Kozhikode, Kochi, Malappuram & Kerala.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl flex-shrink-0">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-display">WhatsApp Checkout</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Direct WhatsApp order placement with instant team response.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-display">Happy Customers</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Trusted by hundreds of parents for quality ride-ons & toys.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">
              Fresh Additions
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-sm font-bold text-brand-purple hover:text-brand-pink inline-flex items-center space-x-1 mt-2 md:mt-0 transition-colors"
          >
            <span>View All New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
};
