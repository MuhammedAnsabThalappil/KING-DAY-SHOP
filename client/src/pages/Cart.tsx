import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, shipping, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6 animate-bounce">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Looks like you haven't added any ride-on cars, toys or bicycles to your shopping cart yet.
          </p>
          <div className="space-y-3">
            <Link
              to="/shop"
              className="w-full inline-flex items-center justify-center space-x-2 bg-brand-gradient text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-3.5 px-6 rounded-2xl transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Ask Assistance on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-display">Shopping Cart</h1>
            <p className="text-sm text-slate-500 mt-1">
              You have <strong className="text-slate-900">{itemCount}</strong> items in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map(({ product, quantity }) => {
              const primaryImg = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600';
              const itemTotal = product.salePrice * quantity;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider block">
                        {product.category?.name || 'Toy'}
                      </span>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-bold text-slate-900 hover:text-brand-purple transition-colors text-base line-clamp-1 block mt-0.5"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1 font-mono">SKU: {product.sku}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm font-black text-slate-900">{formatINR(product.salePrice)}</span>
                        {product.mrp > product.salePrice && (
                          <span className="text-xs text-slate-400 line-through">{formatINR(product.mrp)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Action */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-sm font-bold text-slate-900">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">{formatINR(itemTotal)}</span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center space-x-1 mt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 font-display pb-4 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-3 py-4 text-sm border-b border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-900">
                    {shipping === 0 ? <span className="text-emerald-600 font-black uppercase text-xs">FREE</span> : formatINR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-brand-purple bg-purple-50 p-2.5 rounded-xl font-medium">
                    💡 Add <strong>{formatINR(2000 - subtotal)}</strong> more of items to qualify for Free Shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-base font-black text-slate-900">Estimated Total</span>
                <span className="text-2xl font-black text-brand-purple">{formatINR(total)}</span>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-brand-gradient hover:opacity-95 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 text-base"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <Link
                  to="/shop"
                  className="w-full inline-flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-800 py-2 text-center"
                >
                  ← Continue Shopping
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Quality Guaranteed & Tested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-brand-purple flex-shrink-0" />
                  <span>Fast Dispatch across Kerala & India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
