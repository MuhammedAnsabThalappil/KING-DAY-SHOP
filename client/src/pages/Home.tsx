import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, ArrowRight, ShieldCheck, ChevronRight, Zap, RefreshCw, Truck, Heart, ShoppingBag, Star, Award, CheckCircle2 } from 'lucide-react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [rideOnProducts, setRideOnProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHomeData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      
      {/* 1. HERO BANNER matching Design Reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-sky-100 via-purple-50 to-pink-100 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-5 text-center lg:text-left z-10">
              <span className="inline-block bg-white text-slate-800 text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
                👑 Premium Kids Ride-Ons, Toys, Cycles & More
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-display">
                Make Every Ride a <br />
                <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">
                  Happier Day!
                </span>
              </h1>

              {/* Value Badges Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1 text-xs font-bold text-slate-700">
                <span className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Safe & Durable</span>
                </span>
                <span className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>Best Prices</span>
                </span>
                <span className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>All Kerala Delivery</span>
                </span>
              </div>

              {/* Action CTA Button */}
              <div className="pt-3 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-8 py-4 rounded-full text-base shadow-lg transition-all transform hover:-translate-y-0.5 min-h-[48px]"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href={generateGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-4 rounded-full text-base shadow-lg transition-all min-h-[48px]"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=1000"
                  alt="Red Electric 4x4 Jeep"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY CIRCLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/category/${cat.slug}`}
              className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 mb-3 border-2 border-slate-100 group-hover:border-amber-400 group-hover:scale-105 transition-all">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=300'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 font-display">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL BANNERS matching Design Reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Offer Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                SPECIAL OFFER
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight">
                Festive Special Offer <br />
                <span className="text-yellow-200">Up to 50% OFF</span>
              </h3>
              <Link
                to="/shop"
                className="mt-3 inline-flex items-center space-x-1.5 bg-white text-slate-900 font-black px-5 py-2.5 rounded-full text-xs shadow hover:bg-slate-100 transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden sm:block text-6xl">🎁</div>
          </div>

          {/* Delivery & WhatsApp Banner */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                FAST & SECURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight">
                All Kerala Delivery <br />
                <span className="text-sky-200">Fast Dispatch</span>
              </h3>
              <a
                href={generateGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-2.5 rounded-full text-xs shadow transition-colors"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
            <div className="hidden sm:block text-6xl">🚚</div>
          </div>

        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Trending Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Most popular kids electric ride-ons & RC vehicles</p>
          </div>
          <Link
            to="/shop?sort=featured"
            className="text-xs font-black text-amber-600 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              New Arrivals
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Freshly added bikes, scooters, and toys</p>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs font-black text-amber-600 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 6. WHY KING DAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2 p-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Certified Safe</h4>
            <p className="text-xs text-slate-500">Quality tested materials & heavy duty build</p>
          </div>

          <div className="space-y-2 p-3">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">All Kerala Delivery</h4>
            <p className="text-xs text-slate-500">Fast shipping across all districts in Kerala</p>
          </div>

          <div className="space-y-2 p-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 fill-current" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Instant WhatsApp Order</h4>
            <p className="text-xs text-slate-500">Direct order placement with human support</p>
          </div>

          <div className="space-y-2 p-3">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Best Prices Guaranteed</h4>
            <p className="text-xs text-slate-500">Direct importer pricing for quality ride-ons</p>
          </div>
        </div>
      </section>

    </div>
  );
};
