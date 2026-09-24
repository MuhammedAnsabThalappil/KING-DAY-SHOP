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

// Categories
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);

// Products
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
// ADMIN DASHBOARD & CRUD ROUTES (Publicly Accessible)
// ==========================================

router.get('/auth/me', getMe);
router.get('/admin/me', getMe);
router.get('/admin/dashboard', getAdminDashboardStats);
router.get('/admin/analytics', getAnalytics);
router.get('/admin/customers', getCustomers);

// Category Admin
router.post('/admin/categories', createCategory);
router.put('/admin/categories/:id', updateCategory);
router.delete('/admin/categories/:id', deleteCategory);

// Product Admin & Inventory
router.post('/admin/products', createProduct);
router.put('/admin/products/:id', updateProduct);
router.patch('/admin/products/:id/inventory', updateInventory);
router.delete('/admin/products/:id', deleteProduct);

// Order Admin
router.get('/admin/orders', getOrders);
router.patch('/admin/orders/:id/status', updateOrderStatus);
router.delete('/admin/orders/:id', deleteOrder);

export default router;
