import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, shipping, total, itemCount } = useCart();
  const navigate = useNavigate();

  const totalMrp = cart.reduce((acc, item) => acc + (item.product.mrp || item.product.salePrice) * item.quantity, 0);
  const totalDiscount = Math.max(0, totalMrp - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 text-xs mb-8 leading-relaxed">
            Looks like you haven't added any ride-on cars, toys or bicycles to your shopping cart yet.
          </p>
          <div className="space-y-3">
            <Link
              to="/shop"
              className="w-full inline-flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3.5 px-6 rounded-2xl shadow transition-all text-xs"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const buildCartWhatsAppText = () => {
    let text = `*New Order Inquiry from KING DAY Store*\n\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x ${formatINR(item.product.salePrice)}\n   SKU: ${item.product.sku}\n\n`;
    });
    text += `*Subtotal:* ${formatINR(subtotal)}\n`;
    if (totalDiscount > 0) text += `*Discount Saved:* -${formatINR(totalDiscount)}\n`;
    text += `*Total Amount:* ${formatINR(total)}\n\nPlease process this order.`;
    return text;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Your Cart <span className="text-slate-400 text-base font-semibold">({itemCount} items)</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center space-x-1"
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
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                        {product.category?.name || 'Ride-On'}
                      </span>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-bold text-slate-900 hover:text-amber-600 transition-colors text-sm line-clamp-1 block mt-0.5"
                      >
                        {product.name}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-black text-rose-600">{formatINR(product.salePrice)}</span>
                        {product.mrp > product.salePrice && (
                          <span className="text-xs text-slate-400 line-through font-semibold">{formatINR(product.mrp)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-sm font-black text-slate-900">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">{formatINR(itemTotal)}</span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold inline-flex items-center space-x-1 mt-1"
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
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-28 space-y-4">
              <h3 className="text-base font-black text-slate-900 font-display pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatINR(totalMrp)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount</span>
                    <span className="font-black">-{formatINR(totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-black text-emerald-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-black text-slate-900">Estimated Total</span>
                <span className="text-2xl font-black text-slate-900 font-display">{formatINR(total)}</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={generateGeneralWhatsAppUrl(buildCartWhatsAppText())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2 font-medium">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Certified Quality & Safe Build</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Fast Dispatch across all Kerala Districts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
