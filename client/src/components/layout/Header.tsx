import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Sparkles, Phone, ShoppingBag, Heart, ShieldCheck } from 'lucide-react';
import { Category, Product } from '../../types';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR, generateGeneralWhatsAppUrl } from '../../utils/formatters';

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

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

  // Instant search input debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.getProducts({ search: searchQuery.trim(), limit: 5 });
        setSearchSuggestions(res.products || []);
      } catch {
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    setSearchQuery('');
    setSearchSuggestions([]);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchSuggestions([]);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top Banner Marquee */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-brand-pink text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider animate-pulse">
              KING DAY
            </span>
            <span className="hidden sm:inline text-slate-300">
              Fun • Quality • Happiness | Electric Ride-Ons, RC Toys & Bicycles
            </span>
          </div>
          <div className="flex items-center space-x-5 text-xs">
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-brand-yellow hover:text-white transition-colors font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: +91 9495902904</span>
            </a>
            <Link to="/track-order" className="text-slate-300 hover:text-white text-xs underline underline-offset-2 hidden md:inline">
              Track Order
            </Link>
            <Link to="/admin" className="text-slate-300 hover:text-white text-xs underline underline-offset-2 font-semibold">
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
            <div className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-brand-yellow" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none font-display">
                KING <span className="text-brand-pink">DAY</span>
              </span>
              <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase block mt-1">
                Fun • Quality • Happiness
              </span>
            </div>
          </Link>

          {/* Search Bar with Instant Suggestions */}
          <div className="hidden md:block relative flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search ride-on cars, RC toys, bicycles, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-gradient text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Suggestions Overlay */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 py-2 z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-xs text-slate-400 text-center animate-pulse">Searching catalogue...</div>
                ) : searchSuggestions.length > 0 ? (
                  <div>
                    <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Product Suggestions
                    </div>
                    {searchSuggestions.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.slug}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <img
                          src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=100'}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">{prod.name}</p>
                          <span className="text-[11px] font-black text-brand-purple">{formatINR(prod.salePrice)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-xs text-slate-400 text-center">No products found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold text-slate-700">
            <Link to="/" className="hover:text-brand-purple transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-brand-purple transition-colors">
              Shop
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <Link to="/categories" className="flex items-center space-x-1 hover:text-brand-purple transition-colors py-2">
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Link>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                    Explore Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-brand-purple transition-colors text-sm font-medium"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2 px-4">
                    <Link to="/categories" className="text-xs font-bold text-brand-purple hover:underline block text-center py-1">
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="hover:text-brand-purple transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-brand-purple transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Icons (Wishlist, Cart, WhatsApp) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/wishlist" className="p-2.5 text-slate-700 hover:text-brand-pink transition-colors relative" title="Wishlist">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-pink text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2.5 text-slate-700 hover:text-brand-purple transition-colors relative" title="Cart">
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-purple text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-full text-xs shadow transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm"
            />
            <button type="submit" className="absolute right-3 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-3 font-bold text-slate-800 text-sm">
            <Link to="/" className="py-1 hover:text-brand-purple">
              Home
            </Link>
            <Link to="/shop" className="py-1 hover:text-brand-purple">
              Shop All Products
            </Link>
            <Link to="/categories" className="py-1 hover:text-brand-purple">
              Categories
            </Link>
            <Link to="/track-order" className="py-1 hover:text-brand-purple">
              Track Order
            </Link>
            <Link to="/about" className="py-1 hover:text-brand-purple">
              About Us
            </Link>
            <Link to="/contact" className="py-1 hover:text-brand-purple">
              Contact
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link to="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              Admin Control Panel
            </Link>
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-full"
            >
              <Phone className="w-3 h-3 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
