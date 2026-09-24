import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Crown, Phone, ShoppingBag, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { Category, Product } from '../../types';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR, generateGeneralWhatsAppUrl } from '../../utils/formatters';

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
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
    setIsAllCategoriesOpen(false);
    setIsCategoryDropdownOpen(false);
    setSearchQuery('');
    setSearchSuggestions([]);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedCategory) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory) params.append('categorySlug', selectedCategory);
      navigate(`/shop?${params.toString()}`);
      setSearchSuggestions([]);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all">
      {/* Top Banner Marquee */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              ALL KERALA DELIVERY
            </span>
            <span className="hidden sm:inline text-slate-300">
              Genuine Products • Best Prices • Support: +91 9495902904
            </span>
          </div>
          <div className="flex items-center space-x-5 text-xs">
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-amber-400 hover:text-white transition-colors font-bold"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Support: +91 9495902904</span>
            </a>
            <Link to="/track-order" className="text-slate-300 hover:text-white text-xs underline underline-offset-2 hidden md:inline">
              Track Order
            </Link>
            <Link to="/admin" className="text-slate-300 hover:text-white text-xs font-bold underline underline-offset-2">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6 text-slate-900 fill-current" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none font-display">
                  KING <span className="text-amber-500">DAY</span>
                </span>
                <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block mt-0.5">
                  Fun • Quality • Happiness
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar with Category Dropdown & Instant Suggestions */}
          <div className="hidden md:block relative flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white transition-all shadow-inner">
              <input
                type="text"
                placeholder="Search for toys, cycles, ride-ons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-full flex items-center justify-center transition-colors shadow-sm"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Suggestions Overlay */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 py-2 z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-xs text-slate-400 text-center animate-pulse">Searching catalogue...</div>
                ) : searchSuggestions.length > 0 ? (
                  <div>
                    <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Matching Products
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
                          <span className="text-[11px] font-black text-amber-600">{formatINR(prod.salePrice)}</span>
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

          {/* Action Icons (Wishlist, Cart, WhatsApp Order CTA) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/wishlist" className="p-2.5 text-slate-700 hover:text-amber-500 transition-colors relative" title="Wishlist">
              <Heart className="w-6 h-6 stroke-[2]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-pink text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2.5 text-slate-700 hover:text-amber-500 transition-colors relative" title="Cart">
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-4 py-2.5 rounded-full text-xs shadow-md transition-all group"
            >
              <Phone className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for toys, cycles, ride-ons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button type="submit" className="absolute right-3 top-2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Navigation Sub-Header Bar */}
      <div className="hidden lg:block bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 text-xs font-bold text-slate-800">
          
          <div className="flex items-center space-x-6">
            {/* All Categories Button */}
            <div className="relative">
              <button
                onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl flex items-center space-x-2 font-black transition-colors shadow-sm"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isAllCategoriesOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 mt-1">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Categories & Subcategories
                  </div>
                  {categories.map((cat) => (
                    <div key={cat.id || cat.slug} className="group/item relative">
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsAllCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-amber-50 hover:text-amber-600 transition-colors text-xs font-bold text-slate-800"
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{cat.productCount || 0}</span>
                        )}
                      </Link>

                      {/* Subcategories Flyout */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="hidden group-hover/item:block absolute left-full top-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 ml-1">
                          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-50 mb-1">
                            {cat.name} Subcategories
                          </div>
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id || sub.slug}
                              to={`/shop?categorySlug=${sub.slug}`}
                              onClick={() => setIsAllCategoriesOpen(false)}
                              className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2 px-4">
                    <Link
                      to="/categories"
                      onClick={() => setIsAllCategoriesOpen(false)}
                      className="text-xs font-bold text-amber-600 hover:underline block text-center py-1"
                    >
                      Browse All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <nav className="flex items-center space-x-6">
              <Link to="/" className={`hover:text-amber-500 transition-colors ${location.pathname === '/' ? 'text-amber-600 font-extrabold' : ''}`}>
                Home
              </Link>
              <Link to="/shop" className={`hover:text-amber-500 transition-colors ${location.pathname === '/shop' ? 'text-amber-600 font-extrabold' : ''}`}>
                Shop
              </Link>

              {/* Hover Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <Link to="/categories" className="flex items-center space-x-1 hover:text-amber-500 transition-colors py-2">
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id || cat.slug}
                        to={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600 transition-colors text-xs font-semibold"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/shop?sort=featured" className="hover:text-amber-500 transition-colors flex items-center space-x-1 text-rose-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deals</span>
              </Link>

              <Link to="/shop?sort=newest" className="hover:text-amber-500 transition-colors">
                New Arrivals
              </Link>

              <Link to="/shop?sort=best-sellers" className="hover:text-amber-500 transition-colors">
                Best Sellers
              </Link>
            </nav>
          </div>

          <a
            href={generateGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-emerald-600 font-bold hover:text-emerald-700"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Fast WhatsApp Checkout</span>
          </a>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-bold text-slate-800 text-sm">
            <Link to="/" className="py-1 hover:text-amber-500">
              Home
            </Link>
            <Link to="/shop" className="py-1 hover:text-amber-500">
              Shop All Products
            </Link>
            <Link to="/categories" className="py-1 hover:text-amber-500">
              Categories & Subcategories
            </Link>
            <Link to="/track-order" className="py-1 hover:text-amber-500">
              Track Order
            </Link>
            <Link to="/about" className="py-1 hover:text-amber-500">
              About Us
            </Link>
            <Link to="/contact" className="py-1 hover:text-amber-500">
              Contact
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link to="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-900">
              Admin Panel
            </Link>
            <a
              href={generateGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-amber-400 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-full"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
