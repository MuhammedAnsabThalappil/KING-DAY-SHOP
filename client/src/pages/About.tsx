import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Phone } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../utils/formatters';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center space-x-1.5 bg-brand-yellow/20 text-brand-blue text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-brand-pink" />
          <span>Our Story & Mission</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
          Welcome to KING DAY
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Bringing <strong className="text-brand-purple font-bold">Fun • Quality • Happiness</strong> to every child and family across Kerala and beyond.
        </p>
      </div>

      {/* Brand Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-pink/20 text-brand-pink mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-display">Pure Joy & Fun</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We handpick exciting electric cars, jeeps, balance bikes, and interactive toys designed to inspire smiles and endless imagination.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 text-brand-purple mx-auto flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-display">Uncompromising Quality</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product in our catalogue undergoes rigorous safety inspection to ensure non-toxic materials, durable frames, and long battery life.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 text-slate-900 mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-display">Transparent Service</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All prices are shown in Indian Rupees (₹). No payment gateway friction — simply inspect on our catalogue and chat with us on WhatsApp.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-brand-blue rounded-3xl p-10 text-white text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl font-black font-display">Looking for the perfect gift for your child?</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Our team is available on WhatsApp to share video previews, check local stock availability, and coordinate delivery.
        </p>
        <a
          href={generateGeneralWhatsAppUrl('Hello KING DAY, I read your story and would like to inquire about products.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-full text-sm shadow-xl min-h-[48px]"
        >
          <Phone className="w-5 h-5 fill-current" />
          <span>CONNECT ON WHATSAPP (+91 9495902904)</span>
        </a>
      </div>
    </div>
  );
};
