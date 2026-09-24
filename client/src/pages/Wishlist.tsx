import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, Phone, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatINR, generateWhatsAppProductUrl } from '../utils/formatters';

export const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 flex items-center justify-center text-brand-pink mb-6">
            <Heart className="w-10 h-10 fill-brand-pink text-brand-pink" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display">Your Wishlist is Empty</h2>
          <p className="text-slate-500 text-sm my-4">
            Save your favorite ride-on cars, toys, and bicycles here to check out or order anytime.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-brand-gradient text-white font-bold py-3.5 px-6 rounded-2xl shadow hover:shadow-lg transition-all"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-display flex items-center space-x-3">
              <span>My Wishlist</span>
              <span className="text-sm font-bold bg-pink-100 text-brand-pink px-3 py-1 rounded-full">
                {wishlistCount} items
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600';

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/90 shadow text-slate-400 hover:text-red-500 transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider block">
                    {product.category?.name || 'Toys'}
                  </span>
                  <Link to={`/product/${product.slug}`} className="font-bold text-slate-900 hover:text-brand-purple transition-colors line-clamp-1 block text-base mt-1">
                    {product.name}
                  </Link>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-base font-black text-slate-900">{formatINR(product.salePrice)}</span>
                    {product.mrp > product.salePrice && (
                      <span className="text-xs text-slate-400 line-through">{formatINR(product.mrp)}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <a
                    href={generateWhatsAppProductUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
