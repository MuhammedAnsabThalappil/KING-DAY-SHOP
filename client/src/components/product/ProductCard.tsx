import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Sparkles, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Product } from '../../types';
import { formatINR, calculateDiscount, generateWhatsAppProductUrl } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=600';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product || !product.id) return null;

  const mrp = Number(product.mrp) || 0;
  const salePrice = Number(product.salePrice) || 0;
  const stockQuantity = Number(product.stockQuantity) || 0;
  const discountPercent = calculateDiscount(mrp, salePrice);

  const primaryImage =
    (Array.isArray(product.images) && product.images.find((img) => img?.isPrimary)?.url) ||
    (Array.isArray(product.images) && product.images[0]?.url) ||
    FALLBACK_IMAGE;

  const isOutOfStock = stockQuantity <= 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 3;

  const whatsappUrl = generateWhatsAppProductUrl(product);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-brand-purple/30 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {discountPercent > 0 ? (
          <span className="bg-brand-pink text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
            {discountPercent}% OFF
          </span>
        ) : (
          <span></span>
        )}

        {product.featured && (
          <span className="bg-brand-yellow text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
            <Sparkles className="w-3 h-3 fill-slate-900" />
            <span>FEATURED</span>
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={primaryImage}
          alt={product.name || 'KING DAY Toy'}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          {product.category?.name && (
            <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider block mb-1">
              {product.category.name}
            </span>
          )}

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product.id}`}
            className="font-bold text-slate-800 text-sm hover:text-brand-purple line-clamp-2 transition-colors leading-snug"
          >
            {product.name || 'Product Details'}
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 space-y-3">
          {/* Pricing Row */}
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-black text-brand-blue font-display">
              {formatINR(salePrice)}
            </span>
            {mrp > salePrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatINR(mrp)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center text-xs font-semibold">
            {isOutOfStock ? (
              <span className="text-red-600 flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-600 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Only {stockQuantity} left</span>
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          {/* WhatsApp CTA Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center space-x-2 font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all transform active:scale-95 min-h-[44px] ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
            }`}
            onClick={(e) => {
              if (isOutOfStock) {
                e.preventDefault();
              }
            }}
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>BUY ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
};
