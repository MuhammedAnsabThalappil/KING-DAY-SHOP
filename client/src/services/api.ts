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

/**
 * Safely parse the response body as JSON.
 * Handles: empty bodies, non-JSON content types (HTML 404 pages),
 * network errors, and Vercel/CDN error pages gracefully.
 */
async function safeJson(response: Response): Promise<unknown> {
  // 204 No Content — no body to parse
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';

  // Only try to parse if the server says it's JSON
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  // Non-JSON response (HTML error page from Vercel/CDN, plain text, etc.)
  // Try to read as text for a better error message, but don't crash
  try {
    const text = await response.text();
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      // Looks like JSON even without the correct Content-Type header
      return JSON.parse(text);
    }
  } catch {
    // ignore
  }

  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await safeJson(response);

  if (!response.ok) {
    const msg =
      (data && typeof data === 'object' && 'message' in data && typeof (data as Record<string, unknown>).message === 'string')
        ? (data as Record<string, unknown>).message as string
        : response.status === 404
          ? 'The requested resource was not found.'
          : response.status === 401
            ? 'Authentication required. Please log in.'
            : response.status === 403
              ? 'You do not have permission to perform this action.'
              : response.status >= 500
                ? 'Server error. Please try again later.'
                : `Request failed (HTTP ${response.status}).`;
    throw new Error(msg);
  }

  return data as T;
}

/**
 * Wraps a fetch call to add a network-level error message
 * instead of the raw browser TypeError.
 */
async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (err) {
    // Network error / backend unreachable
    throw new Error(
      'Unable to connect to the KING DAY server. ' +
      'Please check your internet connection or contact support.'
    );
  }
}

export const api = {
  // Public Categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    const res = await apiFetch(`${API_BASE_URL}/categories?includeInactive=${includeInactive}`);
    return handleResponse<Category[]>(res);
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const res = await apiFetch(`${API_BASE_URL}/categories/${slug}`);
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

    const res = await apiFetch(`${API_BASE_URL}/products?${query.toString()}`);
    return handleResponse(res);
  },

  async getProductBySlug(slug: string): Promise<{ product: Product; relatedProducts: Product[] }> {
    const res = await apiFetch(`${API_BASE_URL}/products/${slug}`);
    return handleResponse(res);
  },

  // Admin Auth
  async loginAdmin(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: AdminUser;
  }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async getAdminMe(): Promise<{ user: AdminUser }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiFetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Categories
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const res = await apiFetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(res);
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const res = await apiFetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(res);
  },

  async deleteCategory(id: string, options?: { targetCategoryId?: string; force?: boolean }): Promise<{ message: string }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return handleResponse(res);
  },

  // Admin Products
  async createProduct(productData: unknown): Promise<Product> {
    const res = await apiFetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateProduct(id: string, productData: unknown): Promise<Product> {
    const res = await apiFetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateInventory(id: string, stockQuantity: number): Promise<{ id: string; stockQuantity: number }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/products/${id}/inventory`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stockQuantity }),
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
