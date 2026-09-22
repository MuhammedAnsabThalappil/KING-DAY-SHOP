import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>We're Here To Help</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
          Contact KING DAY
        </h1>
        <p className="text-sm text-slate-500">
          Have an inquiry about electric ride-ons, toy specifications, stock availability, or delivery? Connect with us directly!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Contact Info */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 font-display">
            Direct Contact Details
          </h2>

          <div className="space-y-5 text-sm">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">WhatsApp Helpline</strong>
                <p className="text-slate-600 text-xs mt-0.5">+91 9495902904</p>
                <span className="text-[11px] text-emerald-600 font-bold">Instant response for catalogue inquiries</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-brand-purple">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Business Hours</strong>
                <p className="text-slate-600 text-xs mt-0.5">Monday - Saturday: 9:00 AM - 8:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-brand-blue">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Delivery Coverage</strong>
                <p className="text-slate-600 text-xs mt-0.5">Kerala Delivery & Pan-India Dispatch for Eligible Toys</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-6 rounded-2xl shadow min-h-[48px]"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>START WHATSAPP CHAT NOW</span>
            </a>
          </div>
        </div>

        {/* Right: Quick Inquiry Form simulation redirecting to WhatsApp */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-brand-yellow font-bold text-xs uppercase tracking-widest">
              Instant Inquiry
            </span>
            <h2 className="text-2xl font-black font-display">Send a Quick Message</h2>
            <p className="text-xs text-slate-300">
              Fill out your request below and click submit to open pre-formatted WhatsApp chat directly with KING DAY.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const msg = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
              const text = `Hello KING DAY,\n\nName: ${name}\nEnquiry: ${msg}`;
              window.open(generateGeneralWhatsAppUrl(text), '_blank');
            }}
            className="space-y-4 text-slate-900"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name..."
                className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Product / Question</label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Ask about product availability, price, or delivery details..."
                className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-pink hover:bg-pink-600 text-white font-black py-3.5 rounded-xl shadow-lg transition-all min-h-[48px]"
            >
              SEND VIA WHATSAPP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
