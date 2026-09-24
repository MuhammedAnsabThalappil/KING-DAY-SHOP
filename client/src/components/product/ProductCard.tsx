import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Sparkles, CheckCircle2, AlertTriangle, XCircle, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatINR, calculateDiscount, generateWhatsAppProductUrl } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=600';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product || !product.id) return null;

  const mrp = Number(product.mrp) || 0;
  const salePrice = Number(product.salePrice) || 0;
  const stockQuantity = Number(product.stockQuantity) || 0;
  const discountPercent = calculateDiscount(mrp, salePrice);

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images.find((img) => img?.isPrimary)?.url || images[0]?.url || FALLBACK_IMAGE;
  const secondaryImage = images[1]?.url || primaryImage;

  const isOutOfStock = stockQuantity <= 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 3;
  const inWishlist = isInWishlist(product.id);

  const whatsappUrl = generateWhatsAppProductUrl(product);

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-purple/30 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Badges & Wishlist Heart */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-1.5">
          {discountPercent > 0 && (
            <span className="bg-brand-pink text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}

          {product.featured && (
            <span className="bg-brand-yellow text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
              <Sparkles className="w-3 h-3 fill-slate-900" />
              <span>FEATURED</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md shadow transition-transform active:scale-90 ${
            inWishlist ? 'bg-pink-50 text-brand-pink' : 'bg-white/80 text-slate-400 hover:text-brand-pink'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-brand-pink' : ''}`} />
        </button>
      </div>

      {/* Image Container with Hover Transition */}
      <Link to={`/product/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={primaryImage}
          alt={product.name || 'KING DAY Toy'}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
            secondaryImage !== primaryImage ? 'group-hover:opacity-0 absolute inset-0' : ''
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        )}

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
          {/* Category Tag & SKU */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span className="text-brand-purple">{product.category?.name || 'Toys'}</span>
            <span className="font-mono">SKU: {product.sku}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product.id}`}
            className="font-bold text-slate-900 text-sm hover:text-brand-purple line-clamp-2 transition-colors leading-snug font-display"
          >
            {product.name || 'Product Details'}
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
          {/* Pricing Row */}
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-black text-slate-900 font-display">
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

          {/* Action Buttons: Add to Cart & Buy on WhatsApp */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
              className="bg-slate-100 hover:bg-brand-purple hover:text-white text-slate-800 font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center space-x-1 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-1 font-bold py-2 px-2 rounded-xl text-xs shadow-sm transition-all ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={(e) => {
                if (isOutOfStock) e.preventDefault();
              }}
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
