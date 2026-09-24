import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Sparkles, CheckCircle2, AlertTriangle, XCircle, Heart, ShoppingBag, Star } from 'lucide-react';
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
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Badges & Wishlist Heart */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
        <div className="flex items-center space-x-1">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wider">
              {discountPercent}% OFF
            </span>
          )}

          {product.featured && (
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center space-x-1">
              <Sparkles className="w-3 h-3 fill-slate-900" />
              <span className="hidden sm:inline">FEATURED</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`p-1.5 rounded-full backdrop-blur-md shadow transition-transform active:scale-90 ${
            inWishlist ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-slate-400 hover:text-rose-600'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={primaryImage}
          alt={product.name || 'KING DAY Product'}
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
            <span className="bg-rose-600 text-white font-black px-3 py-1 rounded-md text-[11px] uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
            <span className="text-amber-600 font-extrabold truncate max-w-[120px]">{product.category?.name || 'Ride-On'}</span>
            <span className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span>4.8</span>
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product.id}`}
            className="font-extrabold text-slate-900 text-xs sm:text-sm hover:text-amber-600 line-clamp-2 transition-colors leading-tight font-display"
          >
            {product.name || 'Product Details'}
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2.5">
          {/* Pricing Row */}
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base sm:text-lg font-black text-rose-600 font-display">
              {formatINR(salePrice)}
            </span>
            {mrp > salePrice && (
              <span className="text-xs text-slate-400 line-through font-semibold">
                {formatINR(mrp)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & WhatsApp Order */}
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            <button
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
