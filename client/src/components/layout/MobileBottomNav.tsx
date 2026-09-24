import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Categories', path: '/categories', icon: LayoutGrid },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: itemCount },
    { label: 'Account', path: '/admin', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl py-2 px-3">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                active ? 'text-amber-500 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-pink text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
