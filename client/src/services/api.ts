import {
  Category,
  Product,
  ProductFilterParams,
  AdminUser,
  DashboardStats,
} from '../types';

// Normalize VITE_API_BASE_URL: handle with or without trailing slash and /api
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL).trim() : '';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
const API_BASE_URL = cleanBaseUrl ? `${cleanBaseUrl}/api` : '/api';

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
 * Handles: empty bodies, non-JSON content types (HTML 404 pages/SPA fallbacks),
 * network errors, and Vercel/CDN error pages gracefully.
 */
async function safeJson(response: Response): Promise<unknown> {
  // 204 No Content — no body to parse
  if (response.status === 204) return null;

  const contentType = (response.headers.get('content-type') ?? '').toLowerCase();

  // If server explicitly says it's HTML, it's NOT an API JSON response (likely SPA fallback / CDN error)
  if (contentType.includes('text/html')) {
    return null;
  }

  // Only try to parse directly if the server says it's JSON
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  // Try text parsing for non-standard JSON responses
  try {
    const text = await response.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) {
      // HTML response
      return null;
    }
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed);
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

  // If status is 204 No Content, null is expected
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // If response.ok was true but data is null/undefined, the endpoint returned HTML or empty body instead of JSON!
  if (data === null || data === undefined) {
    throw new Error(
      `Invalid API response (HTTP ${response.status}). Expected JSON data but received non-JSON (${
        response.headers.get('content-type') || 'unknown format'
      }).`
    );
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
    throw new Error(
      'Unable to connect to the KING DAY server. ' +
      'Please check your internet connection or contact support.'
    );
  }
}

export const api = {
  // Public Categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    try {
      const res = await apiFetch(`${API_BASE_URL}/categories?includeInactive=${includeInactive}`);
      const data = await handleResponse<Category[]>(res);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('api.getCategories warning:', err);
      return [];
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const res = await apiFetch(`${API_BASE_URL}/categories/${slug}`);
      const data = await handleResponse<Category>(res);
      return data || null;
    } catch (err) {
      console.warn(`api.getCategoryBySlug(${slug}) warning:`, err);
      return null;
    }
  },

  // Public Products
  async getProducts(params: ProductFilterParams = {}): Promise<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const defaultPagination = {
      total: 0,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 20,
      totalPages: 1,
    };

    try {
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
      const data = await handleResponse<{
        products: Product[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      }>(res);

      return {
        products: Array.isArray(data?.products) ? data.products : [],
        pagination: data?.pagination || defaultPagination,
      };
    } catch (err) {
      console.warn('api.getProducts warning:', err);
      return {
        products: [],
        pagination: defaultPagination,
      };
    }
  },

  async getProductBySlug(slug: string): Promise<{ product: Product | null; relatedProducts: Product[] }> {
    try {
      const res = await apiFetch(`${API_BASE_URL}/products/${slug}`);
      const data = await handleResponse<{ product: Product; relatedProducts: Product[] }>(res);
      return {
        product: data?.product || null,
        relatedProducts: Array.isArray(data?.relatedProducts) ? data.relatedProducts : [],
      };
    } catch (err) {
      console.warn(`api.getProductBySlug(${slug}) warning:`, err);
      return {
        product: null,
        relatedProducts: [],
      };
    }
  },

  // Admin Auth
  async loginAdmin(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: AdminUser;
  }> {
    const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async getAdminMe(): Promise<{ user: AdminUser }> {
    const res = await apiFetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const fallbackStats: DashboardStats = {
      totalProducts: 0,
      activeProducts: 0,
      totalCategories: 0,
      outOfStock: 0,
      lowStock: 0,
      featuredProducts: 0,
    };

    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getAuthHeaders(),
      });
      const data = await handleResponse<DashboardStats>(res);
      return {
        totalProducts: data?.totalProducts ?? 0,
        activeProducts: data?.activeProducts ?? 0,
        totalCategories: data?.totalCategories ?? 0,
        outOfStock: data?.outOfStock ?? 0,
        lowStock: data?.lowStock ?? 0,
        featuredProducts: data?.featuredProducts ?? 0,
      };
    } catch (err) {
      console.warn('api.getDashboardStats warning:', err);
      return fallbackStats;
    }
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
