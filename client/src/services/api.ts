import {
  Category,
  Product,
  ProductFilterParams,
  AdminUser,
  DashboardStats,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('kingday_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while processing your request.');
  }
  return data as T;
}

export const api = {
  // Public Categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/categories?includeInactive=${includeInactive}`);
    return handleResponse<Category[]>(res);
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`);
    return handleResponse<Category>(res);
  },

  // Public Products
  async getProducts(params: ProductFilterParams = {}): Promise<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.search) query.append('search', params.search);
    if (params.featured) query.append('featured', 'true');
    if (params.inStock) query.append('inStock', 'true');
    if (params.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.includeInactive) query.append('includeInactive', 'true');

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    return handleResponse(res);
  },

  async getProductBySlug(slug: string): Promise<{ product: Product; relatedProducts: Product[] }> {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);
    return handleResponse(res);
  },

  // Admin Auth
  async loginAdmin(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: AdminUser;
  }> {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async getAdminMe(): Promise<{ user: AdminUser }> {
    const res = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Categories
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(res);
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(res);
  },

  async deleteCategory(id: string, options?: { targetCategoryId?: string; force?: boolean }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return handleResponse(res);
  },

  // Admin Products
  async createProduct(productData: any): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateProduct(id: string, productData: any): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateInventory(id: string, stockQuantity: number): Promise<{ id: string; stockQuantity: number }> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}/inventory`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stockQuantity }),
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
