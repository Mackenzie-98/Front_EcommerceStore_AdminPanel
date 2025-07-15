// Base types
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// User and Authentication
export interface User extends BaseEntity {
  email: string
  name: string
  lastName: string
  phone?: string
  role: 'admin' | 'staff' | 'manager'
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  last_login?: string
  permissions: string[]
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

// Customer
export interface Customer extends BaseEntity {
  email: string
  name: string
  lastName: string
  phone?: string
  avatar?: string
  total_orders: number
  total_spent: number
  avg_order_value: number
  last_order?: string
  status: 'active' | 'inactive' | 'blocked'
  segment: 'new' | 'regular' | 'vip'
  location: string
  addresses: Address[]
  notes?: string
}

// Product Category and Subcategory
export interface Category extends BaseEntity {
  name: string
  description?: string
  slug: string
  image?: string
  is_active: boolean
  sort_order: number
  products_count: number
  subcategories?: Subcategory[]
}

export interface Subcategory extends BaseEntity {
  name: string
  description?: string
  slug: string
  category_id: string
  image?: string
  is_active: boolean
  sort_order: number
  products_count: number
}

// Product
export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  cost: number
  stock: number
  attributes: { [key: string]: string }
  image?: string
  is_active: boolean
}

export interface Product extends BaseEntity {
  name: string
  description: string
  sku: string
  category_id: string
  category_name: string
  subcategory_id?: string
  subcategory_name?: string
  price: number
  cost: number
  stock: number
  low_stock_threshold: number
  status: 'active' | 'draft' | 'low_stock' | 'out_of_stock'
  images: string[]
  variants: ProductVariant[]
  has_variants: boolean
  sales: number
  rating?: number
  reviews_count: number
  tags: string[]
  attributes: { [key: string]: string }
  seo_title?: string
  seo_description?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

// Inventory
export interface InventoryItem extends BaseEntity {
  product_id: string
  variant_id?: string
  sku: string
  name: string
  current_stock: number
  reserved_stock: number
  available_stock: number
  low_stock_threshold: number
  cost: number
  value: number
  location: string
  last_restocked?: string
  supplier_id?: string
}

export interface StockAdjustment extends BaseEntity {
  product_id: string
  variant_id?: string
  sku: string
  type: 'add' | 'subtract' | 'set'
  quantity: number
  reason: 'reception' | 'sale' | 'damage' | 'theft' | 'correction' | 'return'
  notes?: string
  reference?: string
  user_id: string
  user_name: string
}

// Orders
export interface OrderItem {
  id: string
  product_id: string
  variant_id?: string
  sku: string
  name: string
  price: number
  cost: number
  quantity: number
  total: number
  image?: string
}

export interface Order extends BaseEntity {
  order_number: string
  customer_id: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
  total: number
  subtotal: number
  tax: number
  shipping_cost: number
  discount_amount: number
  items: OrderItem[]
  items_count: number
  shipping_address: Address
  billing_address: Address
  notes?: string
  tracking_number?: string
  coupon_code?: string
  payment_method?: string
  fulfillment_status: 'pending' | 'partial' | 'fulfilled'
}

// Reviews
export interface Review extends BaseEntity {
  product_id: string
  customer_id: string
  order_id?: string
  rating: number
  title: string
  comment: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  product: {
    id: string
    name: string
    sku: string
    image?: string
  }
  is_verified_purchase: boolean
  helpful_count: number
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  admin_response?: string
  admin_response_date?: string
}

// Discounts and Coupons
export interface Coupon extends BaseEntity {
  code: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  minimum_amount: number
  maximum_discount?: number
  usage_limit?: number
  usage_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  applies_to: 'all' | 'categories' | 'products'
  applies_to_ids: string[]
  customer_eligibility: 'all' | 'new' | 'existing'
}

export interface DiscountRule extends BaseEntity {
  name: string
  type: 'quantity' | 'cart_total' | 'category' | 'product'
  description: string
  conditions: {
    min_quantity?: number
    min_amount?: number
    categories?: string[]
    products?: string[]
  }
  discount: {
    type: 'percentage' | 'fixed' | 'free_shipping'
    value?: number
  }
  is_active: boolean
  priority: number
  valid_from?: string
  valid_until?: string
}

// Shipping
export interface ShippingZone extends BaseEntity {
  name: string
  description?: string
  countries: string[]
  is_active: boolean
  methods: ShippingMethod[]
}

export interface ShippingMethod extends BaseEntity {
  name: string
  description?: string
  zone_id: string
  type: 'flat_rate' | 'free' | 'weight_based' | 'order_total'
  cost: number
  min_order_amount?: number
  max_weight?: number
  estimated_days: {
    min: number
    max: number
  }
  is_active: boolean
  sort_order: number
}

// Analytics and Reports
export interface SalesMetrics {
  period: string
  revenue: number
  orders: number
  customers: number
  conversion_rate: number
  avg_order_value: number
  growth_rate: number
}

export interface ProductMetrics {
  product_id: string
  name: string
  sku: string
  sales: number
  revenue: number
  profit: number
  views: number
  conversion_rate: number
  return_rate: number
  rating: number
  reviews_count: number
}

export interface CustomerMetrics {
  customer_id: string
  name: string
  email: string
  orders_count: number
  total_spent: number
  avg_order_value: number
  lifetime_value: number
  last_order_date: string
  acquisition_date: string
  segment: string
}

// Activity Logs
export interface ActivityLog extends BaseEntity {
  user_id: string
  user_name: string
  user_email: string
  action: string
  resource_type: 'product' | 'order' | 'customer' | 'user' | 'system' | 'auth'
  resource_id?: string
  resource_name?: string
  description: string
  ip_address: string
  user_agent: string
  metadata?: any
  severity: 'info' | 'warning' | 'error' | 'high' | 'medium' | 'low'
}

// Settings
export interface StoreSettings {
  name: string
  description: string
  email: string
  phone: string
  address: string
  currency: string
  timezone: string
  language: string
  logo?: string
  favicon?: string
  tax_rate: number
  shipping_policy?: string
  return_policy?: string
  privacy_policy?: string
  terms_of_service?: string
}

// Memory Bank State
export interface MemoryBankState {
  products: Product[]
  customers: Customer[]
  orders: Order[]
  categories: Category[]
  subcategories: Subcategory[]
  inventory: InventoryItem[]
  reviews: Review[]
  coupons: Coupon[]
  discountRules: DiscountRule[]
  shippingZones: ShippingZone[]
  shippingMethods: ShippingMethod[]
  users: User[]
  activityLogs: ActivityLog[]
  storeSettings: StoreSettings
  lastUpdated: string
  isLoading: boolean
  isOnline: boolean
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// Form Types
export interface ProductFormData {
  name: string
  description: string
  sku: string
  category_id: string
  price: number
  cost: number
  stock: number
  low_stock_threshold: number
  images: string[]
  status: 'active' | 'draft'
  has_variants: boolean
  variants: ProductVariant[]
  tags: string[]
  attributes: { [key: string]: string }
  seo_title?: string
  seo_description?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

export interface CustomerFormData {
  email: string
  name: string
  lastName: string
  phone?: string
  address: Address
  notes?: string
}

export interface OrderFormData {
  customer_id: string
  items: OrderItem[]
  shipping_address: Address
  billing_address: Address
  notes?: string
  coupon_code?: string
  payment_method?: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  status?: string
  price_min?: number
  price_max?: number
  stock_min?: number
  stock_max?: number
  created_after?: string
  created_before?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginationParams {
  page?: number
  per_page?: number
  offset?: number
  limit?: number
}

// Chart Data Types
export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: any
}

export interface TimeSeriesData {
  date: string
  [key: string]: any
}

// Event Types
export interface MemoryBankEvent {
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'BULK_UPDATE'
  entity: keyof MemoryBankState
  id?: string
  data?: any
  timestamp: string
  user_id?: string
}

// Utility Types
export type EntityId = string
export type EntityType = keyof MemoryBankState
export type SortOrder = 'asc' | 'desc'
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith' 