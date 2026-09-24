import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Sparkles, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters';

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoriesExpanded, setIsMobileCategoriesExpanded] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Failed to load header categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top Banner */}
      <div className="bg-brand-blue text-white py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-brand-pink text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider animate-pulse">
              KING DAY
            </span>
            <span className="hidden sm:inline text-gray-200">Fun • Quality • Happiness | Premium Kids Catalogue</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-brand-yellow hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: +91 9495902904</span>
            </a>
            <Link to="/admin" className="text-gray-300 hover:text-white text-xs underline underline-offset-2">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-7 h-7 text-brand-yellow" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-brand-blue block leading-none font-display">
                KING <span className="text-brand-pink">DAY</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase block mt-1">
                Fun • Quality • Happiness
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search ride-ons, toys, cycles, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-gradient text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-700">
            <Link to="/" className="hover:text-brand-purple transition-colors">
              Home
            </Link>
            
            <Link to="/shop" className="hover:text-brand-purple transition-colors">
              Shop
            </Link>

            {/* Categories Dropdown Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <Link
                to="/categories"
                className="flex items-center space-x-1 hover:text-brand-purple transition-colors py-2"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
              </Link>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                    Explore Categories
                  </div>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.id || cat.slug}
                        to={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-brand-purple transition-colors"
                      >
                        <span className="font-medium text-sm">{cat.name}</span>
                        {cat.productCount !== undefined && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            {cat.productCount}
                          </span>
                        )}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-slate-400">
                      Loading categories...
                    </div>
                  )}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                    <Link
                      to="/categories"
                      className="text-xs font-bold text-brand-purple hover:underline block text-center py-1"
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/shop?featured=true" className="hover:text-brand-purple transition-colors flex items-center space-x-1 text-brand-pink font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured</span>
            </Link>

            <Link to="/about" className="hover:text-brand-purple transition-colors">
              About
            </Link>

            <Link to="/contact" className="hover:text-brand-purple transition-colors">
              Contact
            </Link>
          </nav>

          {/* WhatsApp CTA Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[44px]"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-gray-100 text-slate-700 hover:text-brand-blue hover:bg-gray-200 transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-blue text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-2 text-base font-semibold text-slate-800">
            <Link
              to="/"
              className="px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop All Products
            </Link>

            {/* Mobile Categories Accordion */}
            <div>
              <button
                onClick={() => setIsMobileCategoriesExpanded(!isMobileCategoriesExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 text-left font-semibold"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    isMobileCategoriesExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMobileCategoriesExpanded && (
                <div className="pl-6 pr-3 py-2 space-y-1.5 bg-slate-50 rounded-xl my-1">
                  <Link
                    to="/categories"
                    className="block py-2 text-sm font-bold text-brand-purple border-b border-gray-200"
                  >
                    ALL CATEGORIES
                  </Link>
                  {Array.isArray(categories) && categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/category/${cat.slug}`}
                      className="block py-2 text-sm text-slate-600 hover:text-brand-purple font-medium"
                    >
                      {cat.name} {cat.productCount !== undefined && `(${cat.productCount})`}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop?featured=true"
              className="px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-brand-pink font-bold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Featured Products</span>
            </Link>

            <Link
              to="/about"
              className="px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              About KING DAY
            </Link>

            <Link
              to="/contact"
              className="px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <div className="pt-4 border-t border-gray-100">
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md min-h-[48px]"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
