import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Phone, ArrowLeft, Send, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { formatINR, generateWhatsAppOrderUrl } from '../utils/formatters';

export const Checkout: React.FC = () => {
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    district: '',
    state: 'Kerala',
    pincode: '',
    notes: '',
  });

  const totalMrp = cart.reduce((acc, item) => acc + (item.product.mrp || item.product.salePrice) * item.quantity, 0);
  const totalDiscount = Math.max(0, totalMrp - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 font-display">No Items to Checkout</h2>
          <p className="text-slate-500 text-xs my-4">Please add items to your cart before proceeding to checkout.</p>
          <Link
            to="/shop"
            className="inline-block bg-amber-400 text-slate-900 font-black py-3 px-6 rounded-2xl shadow"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setError('Please complete all required delivery address fields.');
      return;
    }

    try {
      setLoading(true);

      const itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        image: item.product.images?.[0]?.url,
        price: item.product.salePrice,
        quantity: item.quantity,
      }));

      const res = await api.createOrder({
        ...formData,
        items: itemsPayload,
        subtotal,
        shipping,
        total,
      });

      if (res && res.order) {
        const order = res.order;
        clearCart();
        const waUrl = generateWhatsAppOrderUrl(order);
        window.open(waUrl, '_blank');
        navigate(`/order-success/${order.orderNumber}`);
      } else {
        throw new Error('Could not create order. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Step Indicator Header matching Design Reference */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 max-w-md mx-auto py-2">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">1</span>
            <span className="text-xs font-bold text-slate-900">Details</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300"></div>
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">2</span>
            <span className="text-xs font-semibold text-slate-400">Review</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300"></div>
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">3</span>
            <span className="text-xs font-semibold text-slate-400">WhatsApp</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Address Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Customer Details</h2>
              <p className="text-xs text-slate-500 mb-6">Enter your contact & shipping details for WhatsApp dispatch.</p>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs mb-6 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      placeholder="e.g. Muhammed Ansab"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="9495902904"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="ansab@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="House name, Street, Area"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Kozhikode"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="673001"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Notes <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Any special instructions..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm min-h-[50px]"
                  >
                    {loading ? (
                      <span className="animate-pulse">Processing Order...</span>
                    ) : (
                      <>
                        <Phone className="w-5 h-5 fill-current" />
                        <span>Place Order via WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-28 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 font-display">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-slate-400">{cart.length} items</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[260px] overflow-y-auto py-1">
                {cart.map(({ product, quantity }) => {
                  const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300';
                  return (
                    <div key={product.id} className="py-2.5 flex items-center justify-between space-x-3">
                      <div className="flex items-center space-x-3">
                        <img src={img} alt={product.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                        <div>
                          <p className="font-bold text-xs text-slate-900 line-clamp-1">{product.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">Qty: {quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-slate-900">{formatINR(product.salePrice * quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-semibold text-slate-600">
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
                  <span>Delivery</span>
                  <span className="font-black text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-amber-600 text-lg">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
