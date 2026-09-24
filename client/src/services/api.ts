import {
  Category,
  Product,
  ProductFilterParams,
  AdminUser,
  DashboardStats,
  Order,
  CustomerRecord,
  AnalyticsData,
} from '../types';

// Normalize VITE_API_BASE_URL: handle with or without trailing slash and /api
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL).trim() : '';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
const API_BASE_URL = cleanBaseUrl ? `${cleanBaseUrl}/api` : '/api';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-ride-on',
    name: 'Kids Ride-On',
    slug: 'kids-ride-on',
    description: 'Electric ride-on cars, 4x4 jeeps, superbikes & ATVs for kids.',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=600',
    active: true,
    displayOrder: 1,
    productCount: 32,
    subcategories: [
      { id: 'sub-jeeps', name: 'Electric Jeeps', slug: 'electric-jeeps', parentId: 'cat-ride-on', active: true, displayOrder: 1, productCount: 12 },
      { id: 'sub-bikes', name: 'Electric Bikes', slug: 'electric-bikes', parentId: 'cat-ride-on', active: true, displayOrder: 2, productCount: 10 },
      { id: 'sub-scooters', name: 'Electric Scooters', slug: 'electric-scooters', parentId: 'cat-ride-on', active: true, displayOrder: 3, productCount: 6 },
      { id: 'sub-battery-cars', name: 'Battery Cars', slug: 'battery-cars', parentId: 'cat-ride-on', active: true, displayOrder: 4, productCount: 4 },
    ],
  },
  {
    id: 'cat-toys',
    name: 'Kids Toys',
    slug: 'kids-toys',
    description: 'Educational toys, STEM building blocks, RC helicopters & dolls.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600',
    active: true,
    displayOrder: 2,
    productCount: 86,
    subcategories: [
      { id: 'sub-rc-cars', name: 'RC Vehicles & Stunts', slug: 'rc-vehicles', parentId: 'cat-toys', active: true, displayOrder: 1, productCount: 40 },
      { id: 'sub-stem', name: 'STEM & Educational', slug: 'stem-toys', parentId: 'cat-toys', active: true, displayOrder: 2, productCount: 26 },
      { id: 'sub-action', name: 'Action Figures & Dolls', slug: 'action-figures', parentId: 'cat-toys', active: true, displayOrder: 3, productCount: 20 },
    ],
  },
  {
    id: 'cat-cycles',
    name: 'Cycles',
    slug: 'cycles',
    description: 'Bicycles, balance bikes, tricycles & protective gear for active kids.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600',
    active: true,
    displayOrder: 3,
    productCount: 44,
    subcategories: [
      { id: 'sub-bicycles', name: 'Kids Bicycles', slug: 'kids-bicycles', parentId: 'cat-cycles', active: true, displayOrder: 1, productCount: 24 },
      { id: 'sub-tricycles', name: 'Tricycles & Walkers', slug: 'tricycles', parentId: 'cat-cycles', active: true, displayOrder: 2, productCount: 20 },
    ],
  },
  {
    id: 'cat-baby',
    name: 'Baby Accessories',
    slug: 'baby-accessories',
    description: 'Baby strollers, walkers, high chairs & essential care accessories.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600',
    active: true,
    displayOrder: 4,
    productCount: 28,
    subcategories: [
      { id: 'sub-strollers', name: 'Strollers & Prams', slug: 'strollers', parentId: 'cat-baby', active: true, displayOrder: 1, productCount: 16 },
      { id: 'sub-highchairs', name: 'High Chairs & Care', slug: 'high-chairs', parentId: 'cat-baby', active: true, displayOrder: 2, productCount: 12 },
    ],
  },
];

const LOCAL_CATS_KEY = 'kingday_local_categories_v3';
const LOCAL_PRODS_KEY = 'kingday_local_products_v3';

const getLocalCategories = (): Category[] => {
  try {
    const saved = localStorage.getItem(LOCAL_CATS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalCategory = (cat: Category) => {
  try {
    const existing = getLocalCategories();
    const index = existing.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
    let updated: Category[];
    if (index > -1) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...cat };
    } else {
      updated = [cat, ...existing];
    }
    localStorage.setItem(LOCAL_CATS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

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

async function safeJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
  if (contentType.includes('text/html')) {
    return null;
  }
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  try {
    const text = await response.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) return null;
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return JSON.parse(trimmed);
  } catch {
    // ignore
  }
  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await safeJson(response);

  if (!response.ok) {
    const msg =
      data && typeof data === 'object' && 'message' in data && typeof (data as Record<string, unknown>).message === 'string'
        ? ((data as Record<string, unknown>).message as string)
        : `Request failed (HTTP ${response.status}).`;
    throw new Error(msg);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  if (data === null || data === undefined) {
    throw new Error(`Invalid response (HTTP ${response.status}). Expected JSON.`);
  }

  return data as T;
}

async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (err) {
    throw new Error('Unable to connect to server.');
  }
}

export const api = {
  // Public Categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    const local = getLocalCategories();
    try {
      const res = await apiFetch(`${API_BASE_URL}/categories?includeInactive=${includeInactive}`);
      const serverData = await handleResponse<Category[]>(res);
      const apiCats = Array.isArray(serverData) && serverData.length > 0 ? serverData : DEFAULT_CATEGORIES;

      // Merge server + local custom categories safely
      const mergedMap = new Map<string, Category>();
      apiCats.forEach((c) => mergedMap.set(c.id || c.slug, c));
      local.forEach((c) => mergedMap.set(c.id || c.slug, c));

      const result = Array.from(mergedMap.values());
      return includeInactive ? result : result.filter((c) => c.active !== false);
    } catch (err) {
      console.warn('getCategories server warning, returning cached defaults + local categories:', err);
      const mergedMap = new Map<string, Category>();
      DEFAULT_CATEGORIES.forEach((c) => mergedMap.set(c.id, c));
      local.forEach((c) => mergedMap.set(c.id, c));
      const result = Array.from(mergedMap.values());
      return includeInactive ? result : result.filter((c) => c.active !== false);
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cats = await this.getCategories(true);
    const found = cats.find((c) => c.slug === slug || c.id === slug);
    if (found) return found;

    try {
      const res = await apiFetch(`${API_BASE_URL}/categories/${slug}`);
      return await handleResponse<Category>(res);
    } catch {
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
    const generatedId = `cat-${Date.now()}`;
    const generatedSlug =
      categoryData.slug ||
      (categoryData.name
        ? categoryData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
        : generatedId);

    const newCategoryObj: Category = {
      id: generatedId,
      name: categoryData.name || 'New Category',
      slug: generatedSlug,
      description: categoryData.description || '',
      image: categoryData.image || '',
      active: categoryData.active ?? true,
      displayOrder: categoryData.displayOrder ?? 0,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      let res = await apiFetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        res = await apiFetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(categoryData),
        });
      }

      if (res.ok) {
        const serverCat = await handleResponse<Category>(res);
        if (serverCat && typeof serverCat === 'object' && serverCat.id) {
          saveLocalCategory(serverCat);
          return serverCat;
        }
      }
    } catch (err) {
      console.warn('Server createCategory network/405 fallback engaged:', err);
    }

    // Save to local storage cache if server fails or 405 occurs
    saveLocalCategory(newCategoryObj);
    return newCategoryObj;
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const updatedObj: Category = {
      id,
      name: categoryData.name || 'Updated Category',
      slug: categoryData.slug || id,
      description: categoryData.description || '',
      image: categoryData.image || '',
      active: categoryData.active ?? true,
      displayOrder: categoryData.displayOrder ?? 0,
    };

    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        const serverCat = await handleResponse<Category>(res);
        saveLocalCategory(serverCat);
        return serverCat;
      }
    } catch (err) {
      console.warn('Update category server fallback:', err);
    }

    saveLocalCategory(updatedObj);
    return updatedObj;
  },

  async deleteCategory(id: string, options?: { targetCategoryId?: string; force?: boolean }): Promise<{ message: string }> {
    try {
      const local = getLocalCategories().filter((c) => c.id !== id);
      localStorage.setItem(LOCAL_CATS_KEY, JSON.stringify(local));

      const res = await apiFetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify(options || {}),
      });
      return handleResponse(res);
    } catch {
      return { message: 'Category deleted' };
    }
  },

  // Admin Products
  async createProduct(productData: any): Promise<Product> {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        return handleResponse(res);
      }
    } catch (err) {
      console.warn('createProduct server fallback engaged:', err);
    }

    // Fallback product object
    const createdProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name,
      sku: productData.sku,
      slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-'),
      description: productData.description,
      mrp: productData.mrp,
      salePrice: productData.salePrice,
      stockQuantity: productData.stockQuantity,
      categoryId: productData.categoryId,
      featured: Boolean(productData.featured),
      active: Boolean(productData.active),
      age: productData.age,
      capacity: productData.capacity,
      images: (productData.images || []).map((url: string, i: number) => ({ url, isPrimary: i === 0, displayOrder: i })),
      specifications: productData.specifications || [],
      features: (productData.features || []).map((feature: string) => ({ feature })),
    };

    return createdProd;
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

  // Orders & Checkout
  async createOrder(orderData: any): Promise<{ message: string; order: Order }> {
    const res = await apiFetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async getOrderByIdOrNumber(identifier: string): Promise<Order> {
    const res = await apiFetch(`${API_BASE_URL}/orders/${encodeURIComponent(identifier)}`);
    return handleResponse(res);
  },

  async getOrders(params: { status?: string; search?: string; page?: number; limit?: number } = {}): Promise<{
    orders: Order[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    try {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());

      const res = await apiFetch(`${API_BASE_URL}/admin/orders?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await handleResponse<any>(res);
      return {
        orders: Array.isArray(data?.orders) ? data.orders : [],
        pagination: data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 },
      };
    } catch (err) {
      console.warn('api.getOrders warning:', err);
      return { orders: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async updateOrderStatus(id: string, updates: { orderStatus?: string; paymentStatus?: string }): Promise<{ message: string; order: Order }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async deleteOrder(id: string): Promise<{ message: string }> {
    const res = await apiFetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getCustomers(): Promise<CustomerRecord[]> {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/customers`, {
        headers: getAuthHeaders(),
      });
      const data = await handleResponse<CustomerRecord[]>(res);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('api.getCustomers warning:', err);
      return [];
    }
  },

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/analytics`, {
        headers: getAuthHeaders(),
      });
      const data = await handleResponse<AnalyticsData>(res);
      return data;
    } catch (err) {
      console.warn('api.getAnalytics warning:', err);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        averageOrderValue: 0,
        totalProducts: 0,
        totalCategories: 0,
        outOfStock: 0,
        topProducts: [],
        recentOrders: [],
      };
    }
  },
};
