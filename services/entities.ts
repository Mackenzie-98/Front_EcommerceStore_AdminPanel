import { apiService, ApiResponse } from './api'
import { Product, Customer, Order, Category, InventoryItem, Review, Coupon, DiscountRule, User, ShippingZone, ShippingMethod } from '@/lib/types'

// Generic query parameters
export interface ListParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ListResponse<T> {
  items: T[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
}

// Products Service
export class ProductsService {
  async getAll(params: ListParams & { 
    category_id?: string
    status?: string
    price_min?: number
    price_max?: number
    in_stock?: boolean
  } = {}): Promise<ApiResponse<ListResponse<Product>>> {
    return apiService.get('/api/v1/admin/products', params)
  }

  async getById(id: string): Promise<ApiResponse<Product>> {
    return apiService.get(`/api/v1/admin/products/${id}`)
  }

  async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    return apiService.post('/api/v1/admin/products', data)
  }

  async update(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiService.put(`/api/v1/admin/products/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/products/${id}`)
  }

  async updateStock(id: string, quantity: number): Promise<ApiResponse<Product>> {
    return apiService.put(`/api/v1/admin/products/${id}/stock`, { quantity })
  }

  async bulkUpdate(products: Array<{ id: string; data: Partial<Product> }>): Promise<ApiResponse<Product[]>> {
    return apiService.post('/api/v1/admin/products/bulk-update', { products })
  }

  async import(file: File): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    return apiService.upload('/api/v1/admin/products/import', file)
  }

  async export(params: { format: 'csv' | 'xlsx'; filters?: any }): Promise<ApiResponse<{ download_url: string }>> {
    return apiService.post('/api/v1/admin/products/export', params)
  }

  async uploadImage(productId: string, file: File): Promise<ApiResponse<{ image_url: string }>> {
    return apiService.upload(`/api/v1/admin/products/${productId}/images`, file)
  }

  async search(query: string, filters?: any): Promise<ApiResponse<Product[]>> {
    return apiService.get('/api/v1/admin/products/search', { q: query, ...filters })
  }

  async getVariants(productId: string): Promise<ApiResponse<any[]>> {
    return apiService.get(`/api/v1/admin/products/${productId}/variants`)
  }

  async createVariant(productId: string, data: any): Promise<ApiResponse<any>> {
    return apiService.post(`/api/v1/admin/products/${productId}/variants`, data)
  }
}

// Categories Service
export class CategoriesService {
  async getAll(params: ListParams & { 
    parent_id?: string | null
    status?: string
  } = {}): Promise<ApiResponse<ListResponse<Category>>> {
    return apiService.get('/api/v1/admin/categories', params)
  }

  async getById(id: string): Promise<ApiResponse<Category>> {
    return apiService.get(`/api/v1/admin/categories/${id}`)
  }

  async create(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Category>> {
    return apiService.post('/api/v1/admin/categories', data)
  }

  async update(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    return apiService.put(`/api/v1/admin/categories/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/categories/${id}`)
  }

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    return apiService.get(`/api/v1/admin/categories/slug/${slug}`)
  }

  async getTree(): Promise<ApiResponse<Category[]>> {
    return apiService.get('/api/v1/admin/categories/tree')
  }

  async reorder(categories: Array<{ id: string; parent_id: string | null; sort_order: number }>): Promise<ApiResponse<void>> {
    return apiService.post('/api/v1/admin/categories/reorder', { categories })
  }
}

// Customers Service
export class CustomersService {
  async getAll(params: ListParams & { 
    status?: string
    segment?: string
    location?: string
  } = {}): Promise<ApiResponse<ListResponse<Customer>>> {
    return apiService.get('/api/v1/admin/users', params)
  }

  async getById(id: string): Promise<ApiResponse<Customer>> {
    return apiService.get(`/api/v1/admin/users/${id}`)
  }

  async create(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Customer>> {
    return apiService.post('/api/v1/admin/users', data)
  }

  async update(id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return apiService.put(`/api/v1/admin/users/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/users/${id}`)
  }

  async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    return apiService.get('/api/v1/admin/users/check-email', { email })
  }

  async getOrders(customerId: string, params: ListParams = {}): Promise<ApiResponse<ListResponse<Order>>> {
    return apiService.get(`/api/v1/admin/users/${customerId}/orders`, params)
  }

  async getMetrics(customerId: string): Promise<ApiResponse<{
    total_orders: number
    total_spent: number
    avg_order_value: number
    last_order_date: string | null
  }>> {
    return apiService.get(`/api/v1/admin/users/${customerId}/metrics`)
  }

  async ban(id: string, reason: string): Promise<ApiResponse<void>> {
    return apiService.post(`/api/v1/admin/users/${id}/ban`, { reason })
  }

  async unban(id: string): Promise<ApiResponse<void>> {
    return apiService.post(`/api/v1/admin/users/${id}/unban`)
  }

  async export(params: { format: 'csv' | 'xlsx'; filters?: any }): Promise<ApiResponse<{ download_url: string }>> {
    return apiService.post('/api/v1/admin/users/export', params)
  }
}

// Orders Service
export class OrdersService {
  async getAll(params: ListParams & { 
    status?: string
    customer_id?: string
    date_from?: string
    date_to?: string
  } = {}): Promise<ApiResponse<ListResponse<Order>>> {
    return apiService.get('/api/v1/admin/orders', params)
  }

  async getById(id: string): Promise<ApiResponse<Order>> {
    return apiService.get(`/api/v1/admin/orders/${id}`)
  }

  async updateStatus(id: string, status: string, notes?: string): Promise<ApiResponse<Order>> {
    return apiService.put(`/api/v1/admin/orders/${id}/status`, { status, notes })
  }

  async cancel(id: string, reason: string): Promise<ApiResponse<void>> {
    return apiService.post(`/api/v1/admin/orders/${id}/cancel`, { reason })
  }

  async refund(id: string, amount: number, reason: string): Promise<ApiResponse<void>> {
    return apiService.post(`/api/v1/admin/orders/${id}/refund`, { amount, reason })
  }

  async getInvoice(id: string): Promise<ApiResponse<{ invoice_url: string }>> {
    return apiService.get(`/api/v1/admin/orders/${id}/invoice`)
  }

  async getTracking(id: string): Promise<ApiResponse<{ tracking_number: string; carrier: string; status: string }>> {
    return apiService.get(`/api/v1/admin/orders/${id}/tracking`)
  }

  async updateTracking(id: string, tracking_number: string, carrier: string): Promise<ApiResponse<void>> {
    return apiService.put(`/api/v1/admin/orders/${id}/tracking`, { tracking_number, carrier })
  }

  async getMetrics(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<{
    total_orders: number
    total_revenue: number
    avg_order_value: number
    pending_orders: number
    completed_orders: number
    cancelled_orders: number
  }>> {
    return apiService.get('/api/v1/admin/orders/metrics', params)
  }
}

// Inventory Service
export class InventoryService {
  async getAll(params: ListParams & { 
    low_stock?: boolean
    sku?: string
    category_id?: string
  } = {}): Promise<ApiResponse<ListResponse<InventoryItem>>> {
    return apiService.get('/api/v1/admin/inventory', params)
  }

  async getById(id: string): Promise<ApiResponse<InventoryItem>> {
    return apiService.get(`/api/v1/admin/inventory/${id}`)
  }

  async adjustStock(data: {
    sku: string
    delta: number
    reason: string
    notes?: string
  }): Promise<ApiResponse<InventoryItem>> {
    return apiService.post('/api/v1/admin/inventory/adjust', data)
  }

  async bulkAdjust(adjustments: Array<{
    sku: string
    delta: number
    reason: string
    notes?: string
  }>): Promise<ApiResponse<InventoryItem[]>> {
    return apiService.post('/api/v1/admin/inventory/bulk-adjust', { adjustments })
  }

  async getLowStock(): Promise<ApiResponse<InventoryItem[]>> {
    return apiService.get('/api/v1/admin/inventory/low-stock')
  }

  async getHistory(sku: string, params: ListParams = {}): Promise<ApiResponse<ListResponse<any>>> {
    return apiService.get(`/api/v1/admin/inventory/${sku}/history`, params)
  }

  async importStock(file: File): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    return apiService.upload('/api/v1/admin/inventory/import', file)
  }
}

// Reviews Service
export class ReviewsService {
  async getAll(params: ListParams & { 
    product_id?: string
    customer_id?: string
    status?: string
    rating?: number
  } = {}): Promise<ApiResponse<ListResponse<Review>>> {
    return apiService.get('/api/v1/admin/reviews', params)
  }

  async getById(id: string): Promise<ApiResponse<Review>> {
    return apiService.get(`/api/v1/admin/reviews/${id}`)
  }

  async updateStatus(id: string, status: string): Promise<ApiResponse<Review>> {
    return apiService.put(`/api/v1/admin/reviews/${id}/status`, { status })
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/reviews/${id}`)
  }

  async respond(id: string, response: string): Promise<ApiResponse<Review>> {
    return apiService.post(`/api/v1/admin/reviews/${id}/respond`, { response })
  }

  async getMetrics(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<{
    total_reviews: number
    avg_rating: number
    pending_reviews: number
    approved_reviews: number
    rejected_reviews: number
  }>> {
    return apiService.get('/api/v1/admin/reviews/metrics', params)
  }
}

// Coupons Service
export class CouponsService {
  async getAll(params: ListParams & { 
    status?: string
    type?: string
  } = {}): Promise<ApiResponse<ListResponse<Coupon>>> {
    return apiService.get('/api/v1/admin/coupons', params)
  }

  async getById(id: string): Promise<ApiResponse<Coupon>> {
    return apiService.get(`/api/v1/admin/coupons/${id}`)
  }

  async create(data: Omit<Coupon, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Coupon>> {
    return apiService.post('/api/v1/admin/coupons', data)
  }

  async update(id: string, data: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
    return apiService.put(`/api/v1/admin/coupons/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/coupons/${id}`)
  }

  async validate(code: string, orderTotal: number): Promise<ApiResponse<{
    valid: boolean
    discount: number
    error?: string
  }>> {
    return apiService.post('/api/v1/admin/coupons/validate', { code, order_total: orderTotal })
  }

  async getUsage(id: string): Promise<ApiResponse<{
    usage_count: number
    usage_limit: number
    recent_uses: any[]
  }>> {
    return apiService.get(`/api/v1/admin/coupons/${id}/usage`)
  }
}

// Shipping Service
export class ShippingService {
  async getZones(params: ListParams = {}): Promise<ApiResponse<ListResponse<ShippingZone>>> {
    return apiService.get('/api/v1/admin/shipping/zones', params)
  }

  async createZone(data: Omit<ShippingZone, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ShippingZone>> {
    return apiService.post('/api/v1/admin/shipping/zones', data)
  }

  async updateZone(id: string, data: Partial<ShippingZone>): Promise<ApiResponse<ShippingZone>> {
    return apiService.put(`/api/v1/admin/shipping/zones/${id}`, data)
  }

  async deleteZone(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/shipping/zones/${id}`)
  }

  async getMethods(params: ListParams & { zone_id?: string } = {}): Promise<ApiResponse<ListResponse<ShippingMethod>>> {
    return apiService.get('/api/v1/admin/shipping/methods', params)
  }

  async createMethod(data: Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ShippingMethod>> {
    return apiService.post('/api/v1/admin/shipping/methods', data)
  }

  async updateMethod(id: string, data: Partial<ShippingMethod>): Promise<ApiResponse<ShippingMethod>> {
    return apiService.put(`/api/v1/admin/shipping/methods/${id}`, data)
  }

  async deleteMethod(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/shipping/methods/${id}`)
  }

  async calculateRates(params: {
    destination: string
    weight: number
    dimensions: any
    value: number
  }): Promise<ApiResponse<any[]>> {
    return apiService.post('/api/v1/admin/shipping/calculate', params)
  }
}

// Analytics Service
export class AnalyticsService {
  async getDashboard(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<{
    revenue: { value: number; change: number }
    orders: { value: number; change: number }
    customers: { value: number; change: number }
    conversion_rate: { value: number; change: number }
  }>> {
    return apiService.get('/api/v1/admin/analytics/dashboard', params)
  }

  async getSales(params: { date_from?: string; date_to?: string; period?: string } = {}): Promise<ApiResponse<any[]>> {
    return apiService.get('/api/v1/admin/analytics/sales', params)
  }

  async getProducts(params: { date_from?: string; date_to?: string; limit?: number } = {}): Promise<ApiResponse<any[]>> {
    return apiService.get('/api/v1/admin/analytics/products', params)
  }

  async getCategories(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<any[]>> {
    return apiService.get('/api/v1/admin/analytics/categories', params)
  }

  async getCustomers(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<{
    total_customers: number
    new_customers: number
    returning_customers: number
    customer_lifetime_value: number
    churn_rate: number
  }>> {
    return apiService.get('/api/v1/admin/analytics/customers', params)
  }

  async getCartAbandonment(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<{
    abandonment_rate: number
    abandoned_carts: number
    recovered_carts: number
    lost_revenue: number
  }>> {
    return apiService.get('/api/v1/admin/analytics/cart-abandonment', params)
  }

  async getConversionFunnel(params: { date_from?: string; date_to?: string } = {}): Promise<ApiResponse<any[]>> {
    return apiService.get('/api/v1/admin/analytics/conversion-funnel', params)
  }

  async getRevenueForecast(params: { periods?: number } = {}): Promise<ApiResponse<any[]>> {
    return apiService.get('/api/v1/admin/analytics/revenue-forecast', params)
  }

  async exportReport(params: {
    type: string
    format: 'csv' | 'xlsx' | 'pdf'
    date_from?: string
    date_to?: string
    filters?: any
  }): Promise<ApiResponse<{ download_url: string }>> {
    return apiService.post('/api/v1/admin/analytics/export', params)
  }
}

// Users Service (Admin)
export class UsersService {
  async getAll(params: ListParams & { 
    role?: string
    status?: string
  } = {}): Promise<ApiResponse<ListResponse<User>>> {
    return apiService.get('/api/v1/admin/users', params)
  }

  async getById(id: string): Promise<ApiResponse<User>> {
    return apiService.get(`/api/v1/admin/users/${id}`)
  }

  async create(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<User>> {
    return apiService.post('/api/v1/admin/users', data)
  }

  async update(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put(`/api/v1/admin/users/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/api/v1/admin/users/${id}`)
  }

  async updatePassword(id: string, password: string): Promise<ApiResponse<void>> {
    return apiService.put(`/api/v1/admin/users/${id}/password`, { password })
  }

  async updatePermissions(id: string, permissions: string[]): Promise<ApiResponse<User>> {
    return apiService.put(`/api/v1/admin/users/${id}/permissions`, { permissions })
  }

  async getActivityLogs(id: string, params: ListParams = {}): Promise<ApiResponse<ListResponse<any>>> {
    return apiService.get(`/api/v1/admin/users/${id}/activity`, params)
  }
}

// Export service instances
export const productsService = new ProductsService()
export const categoriesService = new CategoriesService()
export const customersService = new CustomersService()
export const ordersService = new OrdersService()
export const inventoryService = new InventoryService()
export const reviewsService = new ReviewsService()
export const couponsService = new CouponsService()
export const shippingService = new ShippingService()
export const analyticsService = new AnalyticsService()
export const usersService = new UsersService()

// Export all services as a single object
export const services = {
  products: productsService,
  categories: categoriesService,
  customers: customersService,
  orders: ordersService,
  inventory: inventoryService,
  reviews: reviewsService,
  coupons: couponsService,
  shipping: shippingService,
  analytics: analyticsService,
  users: usersService
}

export default services 