import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Phone, ShoppingBag, Truck, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR, generateWhatsAppOrderUrl } from '../utils/formatters';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      api
        .getOrderByIdOrNumber(orderNumber)
        .then((data) => setOrder(data))
        .catch((err) => console.warn('Order success load error:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Banner Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-200">
            Order Submitted Successfully
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-3">
            Thank You for Shopping with KING DAY!
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
            Your order has been recorded. Our team will verify and process your order for dispatch.
          </p>

          {/* Order ID Pill */}
          {orderNumber && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-mono text-sm font-bold shadow-sm">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-brand-yellow font-extrabold">{orderNumber}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {order && (
              <a
                href={generateWhatsAppOrderUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Confirmation</span>
              </a>
            )}

            <Link
              to={`/track-order?id=${orderNumber || ''}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-purple text-white font-bold py-3.5 px-6 rounded-2xl shadow transition-all hover:bg-purple-700"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Progress</span>
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {loading ? (
          <div className="mt-8 text-center py-8 text-slate-400 text-xs">Loading order details...</div>
        ) : order ? (
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-black text-slate-900 font-display border-b border-slate-100 pb-3">
              Order Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-900 block mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Delivery Address</span>
                </span>
                <p>{order.customerName}</p>
                <p>{order.address}{order.apartment ? `, ${order.apartment}` : ''}</p>
                <p>{order.city}, {order.state} - {order.pincode}</p>
                <p className="mt-1 font-mono text-slate-900 font-semibold">Phone: {order.phone}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Status Overview</span>
                <p>Order Status: <strong className="text-brand-purple">{order.orderStatus}</strong></p>
                <p>Payment Mode: <strong className="text-slate-800">{order.paymentStatus}</strong></p>
                <p>Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3">Items Summary</h4>
              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <span className="text-xs text-slate-400">Qty: {item.quantity} x {formatINR(item.price)}</span>
                    </div>
                    <span className="font-black text-slate-900">{formatINR(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 text-right">
              <div>Subtotal: <strong className="text-slate-900">{formatINR(order.subtotal)}</strong></div>
              <div>Shipping: <strong className="text-slate-900">{order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}</strong></div>
              <div className="text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                Total Amount: <span className="text-brand-purple text-xl">{formatINR(order.total)}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 text-center">
          <Link to="/shop" className="inline-flex items-center space-x-2 text-brand-purple font-bold text-sm hover:underline">
            <span>Continue Browsing Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
