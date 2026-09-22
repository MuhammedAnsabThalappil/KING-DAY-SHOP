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
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Public Categories
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);

// Public Products
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

// Public Admin Auth
router.post('/admin/login', login);

// ==========================================
// PROTECTED ADMIN ROUTES (Require JWT)
// ==========================================

router.get('/admin/me', authenticateToken, getMe);
router.get('/admin/dashboard', authenticateToken, getAdminDashboardStats);

// Admin Category Routes
router.post('/admin/categories', authenticateToken, createCategory);
router.put('/admin/categories/:id', authenticateToken, updateCategory);
router.delete('/admin/categories/:id', authenticateToken, deleteCategory);

// Admin Product Routes
router.post('/admin/products', authenticateToken, createProduct);
router.put('/admin/products/:id', authenticateToken, updateProduct);
router.patch('/admin/products/:id/inventory', authenticateToken, updateInventory);
router.delete('/admin/products/:id', authenticateToken, deleteProduct);

export default router;
