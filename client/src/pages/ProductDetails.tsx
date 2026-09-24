import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  ShoppingBag,
  Heart,
  Star,
  Check,
  Zap,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatINR, calculateDiscount, generateWhatsAppProductUrl, generateGeneralWhatsAppUrl } from '../utils/formatters';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'features' | 'delivery'>('description');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
            <div className="h-12 bg-slate-200 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-slate-900 font-display">Product Unavailable</h2>
          <p className="text-xs text-slate-500">
            This item may be temporarily out of stock or link updated. Check availability on WhatsApp.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop"
            className="inline-block bg-amber-400 text-slate-900 font-black px-6 py-3 rounded-full text-xs shadow"
          >
            Browse Catalogue
          </Link>
          <a
            href={generateGeneralWhatsAppUrl(`Inquiring about product: ${slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-full text-xs shadow"
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
  const inWishlist = isInWishlist(product.id);
  const whatsappUrl = generateWhatsAppProductUrl(product);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on KING DAY!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/shop" className="hover:text-amber-600 transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-amber-600 transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-amber-600 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Column: Image Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Details & Ordering */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {product.category?.name || 'Ride-On'}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-slate-400 font-bold">SKU: {product.sku}</span>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:text-amber-600 transition-colors"
                  title="Share product"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2 text-xs">
              <div className="flex items-center space-x-1 text-amber-500 font-extrabold">
                <Star className="w-4 h-4 fill-current" />
                <span>4.8</span>
              </div>
              <span className="text-slate-400">(120 reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200/80 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-rose-600 font-display">
                {formatINR(product.salePrice)}
              </span>
              {product.mrp > product.salePrice && (
                <span className="text-base text-slate-400 line-through font-bold">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
            {product.mrp > product.salePrice && (
              <p className="text-xs font-bold text-emerald-700">
                You save {formatINR(product.mrp - product.salePrice)} ({discountPercent}% OFF)
              </p>
            )}
          </div>

          {/* Feature Bullets */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-1.5 text-xs text-slate-700">
              {product.features.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">{f.feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stock Status Indicator */}
          <div className="flex items-center space-x-4 text-xs font-bold">
            {isOutOfStock ? (
              <span className="text-rose-600 flex items-center space-x-1.5 bg-rose-50 px-3.5 py-1.5 rounded-full">
                <XCircle className="w-4 h-4" />
                <span>Currently Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 flex items-center space-x-1.5 bg-amber-50 px-3.5 py-1.5 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>Hurry! Only {product.stockQuantity} left</span>
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock & Ready for Dispatch</span>
              </span>
            )}
          </div>

          {/* Quantity & Action CTAs matching Design Reference */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-black text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Desktop CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transition-all text-sm disabled:opacity-50"
              >
                <span>Buy Now</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center space-x-2 font-black py-4 px-6 rounded-2xl shadow-lg transition-all text-sm min-h-[50px] ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                onClick={(e) => {
                  if (isOutOfStock) e.preventDefault();
                }}
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-700">
            <div>
              <Truck className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <span>All Kerala Delivery</span>
            </div>
            <div>
              <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <span>Secure Packaging</span>
            </div>
            <div>
              <Phone className="w-5 h-5 text-sky-500 mx-auto mb-1" />
              <span>Easy Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs matching Design Reference (Description, Specifications, Features, FAQ, Delivery) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'description' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specifications' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'features' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'delivery' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Delivery & Support
          </button>
        </div>

        <div className="text-xs text-slate-700 leading-relaxed">
          {activeTab === 'description' && (
            <p className="whitespace-pre-line">{product.description}</p>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-3">
              {product.specifications && product.specifications.length > 0 ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-3 bg-white odd:bg-slate-50">
                      <span className="font-bold text-slate-800">{spec.key}</span>
                      <span className="col-span-2 text-slate-600 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Standard specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{feat.feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">Feature details listed in product description.</p>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-2">
              <p className="font-bold text-slate-900">Delivery Information</p>
              <p className="text-slate-600">We deliver electric ride-on cars, toys, and bicycles across Kozhikode, Malappuram, Ernakulam, Thrissur, Kannur, and all Kerala districts within 24 to 48 hours.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 font-display">Related Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
