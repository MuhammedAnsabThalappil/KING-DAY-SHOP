import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-slate-800">
      {/* Trust Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-brand-purple/20 text-brand-yellow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Quality Products</h4>
              <p className="text-xs text-slate-400 mt-1">Certified safe materials & durable builds for long play.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-brand-pink/20 text-brand-pink">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Delivery Support</h4>
              <p className="text-xs text-slate-400 mt-1">Kerala Delivery & Pan-India dispatch for eligible items.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">WhatsApp Enquiry</h4>
              <p className="text-xs text-slate-400 mt-1">Direct instant chat for price & availability confirmation.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-amber-500/20 text-brand-yellow">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Customer Support</h4>
              <p className="text-xs text-slate-400 mt-1">Friendly guidance to select the perfect toy for your child.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-yellow" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                KING <span className="text-brand-pink">DAY</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-brand-yellow tracking-wider uppercase">
              Fun • Quality • Happiness
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your destination for electric ride-ons, educational toys, bicycles, and baby care accessories. Quality tested for maximum smiles and safety.
            </p>
            <div className="pt-2">
              <a
                href={generateGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow transition-all"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp: +91 9495902904</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-purple pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-brand-pink transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-brand-pink transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-brand-pink transition-colors">Browse Categories</Link>
              </li>
              <li>
                <Link to="/shop?featured=true" className="hover:text-brand-pink transition-colors">Featured Products</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-pink transition-colors">About KING DAY</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-pink transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-pink pl-2">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/category/kids-ride-on" className="hover:text-brand-yellow transition-colors">Kids Ride-On Cars & Jeeps</Link>
              </li>
              <li>
                <Link to="/category/kids-toys" className="hover:text-brand-yellow transition-colors">Educational & RC Toys</Link>
              </li>
              <li>
                <Link to="/category/cycles" className="hover:text-brand-yellow transition-colors">Bicycles & Balance Bikes</Link>
              </li>
              <li>
                <Link to="/category/baby-accessories" className="hover:text-brand-yellow transition-colors">Baby Strollers & Walkers</Link>
              </li>
            </ul>
          </div>

          {/* Store Information */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-yellow pl-2">
              Store Info
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <p>
                <strong className="text-white">Business:</strong> KING DAY Kids Catalogue
              </p>
              <p>
                <strong className="text-white">WhatsApp Helpline:</strong> +91 9495902904
              </p>
              <p>
                <strong className="text-white">Pricing Currency:</strong> Indian Rupees (INR / ₹)
              </p>
              <p>
                <strong className="text-white">Ordering System:</strong> Instant WhatsApp Confirmation
              </p>
              <div className="pt-2 border-t border-slate-800">
                <Link
                  to="/admin/login"
                  className="text-slate-400 hover:text-white text-xs underline underline-offset-2"
                >
                  Admin Portal Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <p>© {new Date().getFullYear()} KING DAY. All rights reserved. Designed for Fun, Quality & Happiness.</p>
        <p className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
          <span>for kids & families</span>
        </p>
      </div>
    </footer>
  );
};
