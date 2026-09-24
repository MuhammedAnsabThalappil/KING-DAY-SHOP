import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { AuthProvider, useAuth } from './context/AuthContext';

import { ErrorBoundary } from './components/common/ErrorBoundary';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Categories } from './pages/Categories';
import { CategoryView } from './pages/CategoryView';
import { ProductDetails } from './pages/ProductDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Admin Pages
// import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AddProduct } from './pages/admin/AddProduct';
import { EditProduct } from './pages/admin/EditProduct';
import { AdminCategories } from './pages/admin/Categories';
import { AdminInventory } from './pages/admin/Inventory';

// Protected Route Component for Admin Routes
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication removed – all admin routes are publicly accessible
  return <>{children}</>;
};

// Admin Layout Shell with Sidebar/Navigation
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Add Product', path: '/admin/products/new' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Inventory', path: '/admin/inventory' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 pb-12">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-brand-pink text-white font-black px-2.5 py-0.5 rounded text-xs">
              ADMIN
            </span>
            <span className="font-bold text-base font-display">KING DAY CONTROL PANEL</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              Logged in as: <strong className="text-white font-semibold">{user?.email}</strong>
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-yellow hover:underline font-bold"
            >
              View Live Storefront ↗
            </a>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Sub-nav pills */}
        <div className="bg-slate-950 px-4 sm:px-6 lg:px-8 py-2 border-t border-slate-800/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs font-semibold">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-brand-purple text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">{children}</div>
    </div>
  );
};

export const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            {/* Public Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryView />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AddProduct />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <EditProduct />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminCategories />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminInventory />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}
    </AuthProvider>
  );
};
