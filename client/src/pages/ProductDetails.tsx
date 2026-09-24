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
  HelpCircle,
  Check,
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
            className="inline-block bg-brand-gradient text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all"
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

        {/* Right Column: Details & Ordering */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {product.category && (
              <span className="bg-purple-50 text-brand-purple text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                {product.category.name}
              </span>
            )}

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400 font-semibold">SKU: {product.sku}</span>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:text-brand-purple transition-colors"
                title="Share product"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display leading-snug">
            {product.name}
          </h1>

          {/* Pricing Box */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-100 flex items-baseline space-x-4">
            <span className="text-3xl font-black text-slate-900 font-display">
              {formatINR(product.salePrice)}
            </span>
            {product.mrp > product.salePrice && (
              <>
                <span className="text-base text-slate-400 line-through font-medium">
                  {formatINR(product.mrp)}
                </span>
                <span className="bg-brand-pink text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center space-x-4 text-xs font-bold">
            {isOutOfStock ? (
              <span className="text-red-600 flex items-center space-x-1.5 bg-red-50 px-3.5 py-1.5 rounded-full">
                <XCircle className="w-4 h-4" />
                <span>Currently Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 flex items-center space-x-1.5 bg-amber-50 px-3.5 py-1.5 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>Hurry! Only {product.stockQuantity} left in stock</span>
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock & Ready for Dispatch</span>
              </span>
            )}
          </div>

          {/* Key Attributes */}
          {(product.age || product.capacity) && (
            <div className="grid grid-cols-2 gap-4">
              {product.age && (
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-xs">
                  <span className="text-slate-400 block font-semibold">Recommended Age</span>
                  <strong className="text-slate-900 font-bold text-sm mt-0.5 block">{product.age}</strong>
                </div>
              )}
              {product.capacity && (
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-xs">
                  <span className="text-slate-400 block font-semibold">Weight Capacity</span>
                  <strong className="text-slate-900 font-bold text-sm mt-0.5 block">{product.capacity}</strong>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-brand-purple hover:bg-purple-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all text-sm disabled:opacity-50"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* WhatsApp Order Button */}
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
              <span>PLACE DIRECT ORDER ON WHATSAPP</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs text-slate-600">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Tested & Quality Certified Materials</span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-brand-purple flex-shrink-0" />
              <span>Quick Dispatch across Kozhikode, Malappuram, Kochi & Kerala</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 font-display border-b border-slate-100 pb-3 mb-4">
            Product Overview & Description
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Features Bullet Points */}
        {product.features && product.features.length > 0 && (
          <div>
            <h4 className="text-base font-bold text-slate-900 font-display mb-3">Key Highlights & Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feat.feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications Table */}
        {product.specifications && product.specifications.length > 0 && (
          <div>
            <h4 className="text-base font-bold text-slate-900 font-display mb-3">Technical Specifications</h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="grid grid-cols-3 p-3 bg-white odd:bg-slate-50">
                  <span className="font-bold text-slate-700">{spec.key}</span>
                  <span className="col-span-2 text-slate-600 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 font-display">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
