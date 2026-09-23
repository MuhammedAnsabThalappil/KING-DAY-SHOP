import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Phone,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Sparkles,
  Info,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductCard } from '../components/product/ProductCard';
import { formatINR, calculateDiscount, generateWhatsAppProductUrl, generateGeneralWhatsAppUrl } from '../utils/formatters';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        setProduct(res?.product || null);
        setRelatedProducts(Array.isArray(res?.relatedProducts) ? res.relatedProducts : []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.warn('Failed to load product details:', err);
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded-2xl w-full"></div>
            <div className="h-12 bg-gray-200 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-pink-100 text-brand-pink rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-slate-900 font-display">Product Unavailable</h2>
          <p className="text-sm text-slate-500">
            This item may be temporarily out of catalogue or the link might be outdated. Connect with us on WhatsApp to check availability.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop"
            className="inline-block bg-brand-blue hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
          >
            Browse All Products
          </Link>
          <a
            href={generateGeneralWhatsAppUrl(`Hello KING DAY, I was inquiring about product: ${slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  const discountPercent = calculateDiscount(product.mrp, product.salePrice);
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const whatsappUrl = generateWhatsAppProductUrl(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-brand-purple transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/shop" className="hover:text-brand-purple transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-brand-purple transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-brand-purple font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Details & WhatsApp Buy */}
        <div className="space-y-6">
          
          {/* Category & Badges */}
          <div className="flex items-center justify-between">
            {product.category && (
              <span className="bg-purple-50 text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category.name}
              </span>
            )}

            <span className="text-xs font-mono text-slate-400 font-semibold">
              SKU: {product.sku}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display leading-snug">
            {product.name}
          </h1>

          {/* Price Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex items-baseline space-x-4">
            <span className="text-3xl font-black text-brand-blue font-display">
              {formatINR(product.salePrice)}
            </span>
            {product.mrp > product.salePrice && (
              <>
                <span className="text-base text-slate-400 line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="bg-brand-pink text-white text-xs font-black px-2.5 py-1 rounded-full uppercase">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock Indicator & Highlights */}
          <div className="flex items-center space-x-4 text-xs font-bold">
            {isOutOfStock ? (
              <span className="text-red-600 flex items-center space-x-1.5 bg-red-50 px-3 py-1.5 rounded-full">
                <XCircle className="w-4 h-4" />
                <span>Currently Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 flex items-center space-x-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>Hurry! Only {product.stockQuantity} left in stock</span>
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock & Ready for Delivery</span>
              </span>
            )}
          </div>

          {/* Key Attributes (Age & Capacity) */}
          <div className="grid grid-cols-2 gap-4">
            {product.age && (
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-xs">
                <span className="text-slate-400 block font-semibold">Recommended Age</span>
                <strong className="text-slate-800 font-bold text-sm mt-0.5 block">{product.age}</strong>
              </div>
            )}
            {product.capacity && (
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-xs">
                <span className="text-slate-400 block font-semibold">Max Weight Capacity</span>
                <strong className="text-slate-800 font-bold text-sm mt-0.5 block">{product.capacity}</strong>
              </div>
            )}
          </div>

          {/* Desktop Buy On WhatsApp CTA */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center space-x-3 font-black py-4 px-6 rounded-2xl text-base shadow-lg transition-all transform active:scale-98 min-h-[52px] ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-xl'
              }`}
              onClick={(e) => {
                if (isOutOfStock) e.preventDefault();
              }}
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>BUY ON WHATSAPP NOW</span>
            </a>
            <p className="text-[11px] text-center text-slate-500">
              Clicking will open WhatsApp with pre-filled product details for instant response.
            </p>
          </div>

          {/* Delivery & Assurance Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3 text-xs shadow-sm">
            <div className="flex items-center space-x-3 text-slate-700 font-semibold">
              <Truck className="w-4 h-4 text-brand-purple flex-shrink-0" />
              <span>Kerala & Pan-India Dispatch Available</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-pink flex-shrink-0" />
              <span>100% Verified Quality Checked Before Packing</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 font-semibold">
              <Info className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span>No online payment needed — Pay upon WhatsApp order confirmation</span>
            </div>
          </div>

        </div>
      </div>

      {/* Description & Specs Tabs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
        
        {/* Left 2 Cols: Description & Features */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
              Product Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Key Features Bullet Points */}
          {product.features && product.features.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
                Key Features & Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Col: Specifications Table */}
        <div>
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3 font-display">
                Technical Specifications
              </h3>
              <div className="divide-y divide-gray-100 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="py-2.5 flex justify-between">
                    <span className="font-semibold text-slate-500">{spec.key}</span>
                    <span className="font-bold text-slate-800 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 font-display">
              You May Also Like
            </h2>
            {product.category && (
              <Link
                to={`/category/${product.category.slug}`}
                className="text-xs font-bold text-brand-purple hover:underline"
              >
                More from {product.category.name} →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BUY NOW BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Sale Price</span>
            <span className="text-lg font-black text-brand-blue font-display">
              {formatINR(product.salePrice)}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center space-x-2 font-black py-3 px-4 rounded-xl text-sm shadow-md min-h-[48px] ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            onClick={(e) => {
              if (isOutOfStock) e.preventDefault();
            }}
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>BUY ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
};
