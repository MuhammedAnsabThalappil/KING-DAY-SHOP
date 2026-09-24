import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  updateInventory,
  deleteProduct,
  getAdminDashboardStats,
} from '../controllers/productController';
import {
  createOrder,
  getOrders,
  getOrderByIdOrNumber,
  updateOrderStatus,
  deleteOrder,
  getCustomers,
  getAnalytics,
} from '../controllers/orderController';

const router = Router();

// ==========================================
// PUBLIC CUSTOMER ROUTES
// ==========================================

// Categories (Support both GET /categories and GET /admin/categories)
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);

// Products (Support both GET /products and GET /admin/products)
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

// Orders & Order Tracking
router.post('/orders', createOrder);
router.get('/orders/track/:identifier', getOrderByIdOrNumber);
router.get('/orders/:identifier', getOrderByIdOrNumber);

// Auth (Fallback endpoints)
router.post('/auth/login', login);
router.post('/admin/login', login);

// ==========================================
// ADMIN DASHBOARD & CRUD ROUTES (Publicly Accessible, No 405 on duplicate paths)
// ==========================================

router.get('/auth/me', getMe);
router.get('/admin/me', getMe);
router.get('/admin/dashboard', getAdminDashboardStats);
router.get('/admin/analytics', getAnalytics);
router.get('/admin/customers', getCustomers);

// Category Admin Routes (Support BOTH /categories and /admin/categories for POST, PUT, DELETE)
router.post('/categories', createCategory);
router.post('/admin/categories', createCategory);

router.put('/categories/:id', updateCategory);
router.put('/admin/categories/:id', updateCategory);

router.delete('/categories/:id', deleteCategory);
router.delete('/admin/categories/:id', deleteCategory);

// Product Admin & Inventory Routes (Support BOTH /products and /admin/products for POST, PUT, PATCH, DELETE)
router.get('/admin/products', getProducts);

router.post('/products', createProduct);
router.post('/admin/products', createProduct);

router.put('/products/:id', updateProduct);
router.put('/admin/products/:id', updateProduct);

router.patch('/products/:id/inventory', updateInventory);
router.patch('/admin/products/:id/inventory', updateInventory);

router.delete('/products/:id', deleteProduct);
router.delete('/admin/products/:id', deleteProduct);

// Order Admin Routes
router.get('/admin/orders', getOrders);
router.patch('/admin/orders/:id/status', updateOrderStatus);
router.delete('/admin/orders/:id', deleteOrder);

export default router;
