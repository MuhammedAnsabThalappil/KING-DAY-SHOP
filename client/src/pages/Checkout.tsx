import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Phone, ArrowLeft, Send } from 'lucide-react';
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

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 font-display">No Items to Checkout</h2>
          <p className="text-slate-500 text-sm my-4">Please add items to your cart before proceeding to checkout.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-gradient text-white font-bold py-3 px-6 rounded-2xl shadow"
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

        // Clear local cart state
        clearCart();

        // Generate WhatsApp link & open window
        const waUrl = generateWhatsAppOrderUrl(order);
        window.open(waUrl, '_blank');

        // Redirect to Order Success Page
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </Link>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>Instant WhatsApp Order Confirmation</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Address Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 font-display mb-1">Delivery Address</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your contact & shipping details for order dispatch.</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9895000000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Street Address & Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="House No, Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Building / Apartment <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment name, floor"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      City / Town <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Kozhikode, Kochi"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      District <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      placeholder="e.g. Malappuram"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="673001"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Special Delivery Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="e.g. Call before delivery, prefer gift wrapping"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center space-x-3 text-base min-h-[52px]"
                  >
                    {loading ? (
                      <span className="animate-pulse">Processing Order...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 fill-current" />
                        <span>PLACE ORDER VIA WHATSAPP</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-2 font-medium">
                    ⚡ Instant WhatsApp Order confirmation. No advance credit card required.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 font-display pb-4 border-b border-slate-100">
                Items in Order ({cart.length})
              </h3>

              <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto py-2 my-2">
                {cart.map(({ product, quantity }) => {
                  const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300';
                  return (
                    <div key={product.id} className="py-3 flex items-center justify-between space-x-3">
                      <div className="flex items-center space-x-3">
                        <img src={img} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                        <div>
                          <p className="font-bold text-xs text-slate-900 line-clamp-1">{product.name}</p>
                          <span className="text-[11px] text-slate-400 font-mono">Qty: {quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-slate-900">{formatINR(product.salePrice * quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900">{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-brand-purple text-lg">{formatINR(total)}</span>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>How WhatsApp Ordering Works:</span>
                </div>
                <ol className="text-[11px] text-slate-500 list-decimal list-inside space-y-1 pl-1">
                  <li>Click Place Order above</li>
                  <li>Order is created & recorded safely in our database</li>
                  <li>WhatsApp opens with pre-filled order receipt</li>
                  <li>Our team confirms dispatch & payment details directly</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
