export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  displayOrder: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id?: string;
  productId?: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductSpecification {
  id?: string;
  key: string;
  value: string;
}

export interface ProductFeature {
  id?: string;
  feature: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  mrp: number;
  salePrice: number;
  stockQuantity: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  featured: boolean;
  active: boolean;
  age?: string;
  capacity?: string;
  seoTitle?: string;
  seoDescription?: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalCategories: number;
  featuredProducts: number;
  totalRevenue?: number;
  totalOrders?: number;
  pendingOrders?: number;
}

export interface ProductFilterParams {
  categorySlug?: string;
  categoryId?: string;
  search?: string;
  featured?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  apartment?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerRecord {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  totalCategories: number;
  outOfStock: number;
  topProducts: Array<{ name: string; salesCount: number; revenue: number }>;
  recentOrders: Order[];
}
