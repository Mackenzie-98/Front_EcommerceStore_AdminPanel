import { useCallback, useState, useEffect } from 'react'
import { useMemoryBank } from '@/lib/memory-bank/context'
import { EntityType, EntityId, SearchFilters, PaginationParams } from '@/lib/types'
import { useToast } from './use-toast'

// Generic hook for entity operations
export const useEntity = <T>(entityType: EntityType) => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const entities = memoryBank.state[entityType] as T[]

  const createEntity = useCallback(async (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const newEntity = await memoryBank.create<T>(entityType, data)
      toast({
        title: "Success",
        description: `${entityType.slice(0, -1)} created successfully`,
      })
      return newEntity
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create entity'
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [memoryBank, entityType, toast])

  const updateEntity = useCallback(async (id: EntityId, data: Partial<T>) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedEntity = await memoryBank.update<T>(entityType, id, data)
      toast({
        title: "Success",
        description: `${entityType.slice(0, -1)} updated successfully`,
      })
      return updatedEntity
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update entity'
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [memoryBank, entityType, toast])

  const deleteEntity = useCallback(async (id: EntityId) => {
    setLoading(true)
    setError(null)
    
    try {
      await memoryBank.delete(entityType, id)
      toast({
        title: "Success",
        description: `${entityType.slice(0, -1)} deleted successfully`,
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete entity'
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [memoryBank, entityType, toast])

  const findById = useCallback((id: EntityId) => {
    return memoryBank.findById<T>(entityType, id)
  }, [memoryBank, entityType])

  const findMany = useCallback((filter?: (item: T) => boolean) => {
    return memoryBank.findMany<T>(entityType, filter)
  }, [memoryBank, entityType])

  return {
    entities,
    loading,
    error,
    createEntity,
    updateEntity,
    deleteEntity,
    findById,
    findMany,
    clearError: () => setError(null)
  }
}

// Products hook
export const useProducts = () => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const updateStock = useCallback(async (id: EntityId, quantity: number) => {
    setLoading(true)
    try {
      await memoryBank.products.updateStock(id, quantity)
      toast({
        title: "Success",
        description: "Product stock updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product stock",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const searchProducts = useCallback((query: string) => {
    return memoryBank.products.search(query)
  }, [memoryBank])

  const getLowStockProducts = useCallback(() => {
    return memoryBank.products.getLowStock()
  }, [memoryBank])

  const getProductsByCategory = useCallback((categoryId: string) => {
    return memoryBank.products.getByCategory(categoryId)
  }, [memoryBank])

  return {
    products: memoryBank.products.getAll(),
    loading,
    create: memoryBank.products.create,
    update: memoryBank.products.update,
    delete: memoryBank.products.delete,
    getById: memoryBank.products.getById,
    getBySku: memoryBank.products.getBySku,
    getByCategory: getProductsByCategory,
    getLowStock: getLowStockProducts,
    updateStock,
    search: searchProducts
  }
}

// Customers hook
export const useCustomers = () => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const searchCustomers = useCallback((query: string) => {
    return memoryBank.customers.search(query)
  }, [memoryBank])

  const getCustomersBySegment = useCallback((segment: string) => {
    return memoryBank.customers.getBySegment(segment)
  }, [memoryBank])

  const getCustomerMetrics = useCallback((customerId: string) => {
    const customer = memoryBank.customers.getById(customerId)
    const orders = memoryBank.orders.getByCustomer(customerId)
    
    if (!customer) return null

    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    const lastOrderDate = orders.length > 0 
      ? orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
      : null

    return {
      ...customer,
      totalOrders,
      totalSpent,
      avgOrderValue,
      lastOrderDate
    }
  }, [memoryBank])

  return {
    customers: memoryBank.customers.getAll(),
    loading,
    create: memoryBank.customers.create,
    update: memoryBank.customers.update,
    delete: memoryBank.customers.delete,
    getById: memoryBank.customers.getById,
    getByEmail: memoryBank.customers.getByEmail,
    getBySegment: getCustomersBySegment,
    getMetrics: getCustomerMetrics,
    search: searchCustomers
  }
}

// Orders hook
export const useOrders = () => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const updateOrderStatus = useCallback(async (id: EntityId, status: string) => {
    setLoading(true)
    try {
      await memoryBank.orders.updateStatus(id, status)
      toast({
        title: "Success",
        description: "Order status updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const searchOrders = useCallback((query: string) => {
    return memoryBank.orders.search(query)
  }, [memoryBank])

  const getOrdersByStatus = useCallback((status: string) => {
    return memoryBank.orders.getByStatus(status)
  }, [memoryBank])

  const getOrdersByCustomer = useCallback((customerId: string) => {
    return memoryBank.orders.getByCustomer(customerId)
  }, [memoryBank])

  const getOrderMetrics = useCallback(() => {
    const orders = memoryBank.orders.getAll()
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'completed').length

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      pendingOrders,
      completedOrders,
      conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    }
  }, [memoryBank])

  return {
    orders: memoryBank.orders.getAll(),
    loading,
    create: memoryBank.orders.create,
    update: memoryBank.orders.update,
    delete: memoryBank.orders.delete,
    getById: memoryBank.orders.getById,
    getByCustomer: getOrdersByCustomer,
    getByStatus: getOrdersByStatus,
    updateStatus: updateOrderStatus,
    getMetrics: getOrderMetrics,
    search: searchOrders
  }
}

// Inventory hook
export const useInventory = () => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const adjustStock = useCallback(async (data: any) => {
    setLoading(true)
    try {
      await memoryBank.inventory.adjustStock(data)
      toast({
        title: "Success",
        description: "Stock adjustment completed successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to adjust stock",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const getLowStockItems = useCallback(() => {
    return memoryBank.inventory.getLowStock()
  }, [memoryBank])

  const getInventoryValue = useCallback(() => {
    const inventory = memoryBank.inventory.getAll()
    return inventory.reduce((sum, item) => sum + item.value, 0)
  }, [memoryBank])

  return {
    inventory: memoryBank.inventory.getAll(),
    loading,
    create: memoryBank.inventory.create,
    update: memoryBank.inventory.update,
    delete: memoryBank.inventory.delete,
    getById: memoryBank.inventory.getById,
    getBySku: memoryBank.inventory.getBySku,
    getLowStock: getLowStockItems,
    adjustStock,
    getTotalValue: getInventoryValue
  }
}

// Reviews hook
export const useReviews = () => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const updateReviewStatus = useCallback(async (id: EntityId, status: string) => {
    setLoading(true)
    try {
      await memoryBank.reviews.updateStatus(id, status)
      toast({
        title: "Success",
        description: "Review status updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review status",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const getReviewsByProduct = useCallback((productId: string) => {
    return memoryBank.reviews.getByProduct(productId)
  }, [memoryBank])

  const getReviewsByCustomer = useCallback((customerId: string) => {
    return memoryBank.reviews.getByCustomer(customerId)
  }, [memoryBank])

  const getReviewsByStatus = useCallback((status: string) => {
    return memoryBank.reviews.getByStatus(status)
  }, [memoryBank])

  const getReviewMetrics = useCallback(() => {
    const reviews = memoryBank.reviews.getAll()
    const totalReviews = reviews.length
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    const pendingReviews = reviews.filter(review => review.status === 'pending').length
    const approvedReviews = reviews.filter(review => review.status === 'approved').length

    return {
      totalReviews,
      avgRating,
      pendingReviews,
      approvedReviews
    }
  }, [memoryBank])

  return {
    reviews: memoryBank.reviews.getAll(),
    loading,
    create: memoryBank.reviews.create,
    update: memoryBank.reviews.update,
    delete: memoryBank.reviews.delete,
    getById: memoryBank.reviews.getById,
    getByProduct: getReviewsByProduct,
    getByCustomer: getReviewsByCustomer,
    getByStatus: getReviewsByStatus,
    updateStatus: updateReviewStatus,
    getMetrics: getReviewMetrics
  }
}

// Analytics hook
export const useAnalytics = () => {
  const memoryBank = useMemoryBank()

  const getOverviewMetrics = useCallback(() => {
    return memoryBank.getAnalytics()
  }, [memoryBank])

  const getSalesData = useCallback((days: number = 30) => {
    const orders = memoryBank.orders.getAll()
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const recentOrders = orders.filter(order => 
      new Date(order.created_at) >= cutoffDate
    )

    // Group by day
    const salesByDay: { [key: string]: { revenue: number; orders: number } } = {}
    
    recentOrders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0]
      if (!salesByDay[date]) {
        salesByDay[date] = { revenue: 0, orders: 0 }
      }
      salesByDay[date].revenue += order.total
      salesByDay[date].orders += 1
    })

    return Object.entries(salesByDay).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    })).sort((a, b) => a.date.localeCompare(b.date))
  }, [memoryBank])

  const getTopProducts = useCallback((limit: number = 10) => {
    const products = memoryBank.products.getAll()
    return products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
      .map(product => ({
        id: product.id,
        name: product.name,
        sales: product.sales,
        revenue: product.sales * product.price,
        profit: product.sales * (product.price - product.cost)
      }))
  }, [memoryBank])

  const getCustomerSegmentation = useCallback(() => {
    const customers = memoryBank.customers.getAll()
    const segments = customers.reduce((acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(segments).map(([segment, count]) => ({
      name: segment,
      value: count as number,
      percentage: Math.round(((count as number) / customers.length) * 100)
    }))
  }, [memoryBank])

  return {
    getOverviewMetrics,
    getSalesData,
    getTopProducts,
    getCustomerSegmentation
  }
}

// Search and filter hook
export const useSearch = <T>(
  entities: T[],
  searchFields: (keyof T)[],
  initialFilters?: SearchFilters
) => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {})
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredEntities = useCallback(() => {
    let result = [...entities]

    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(entity =>
        searchFields.some(field => {
          const value = entity[field]
          return typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
        })
      )
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(entity => 
        (entity as any).status === filters.status
      )
    }

    if (filters.category) {
      result = result.filter(entity => 
        (entity as any).category_id === filters.category ||
        (entity as any).category === filters.category
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = (a as any)[sortBy]
      const bValue = (b as any)[sortBy]
      
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === 'asc' ? comparison : -comparison
      }
      
      if (typeof aValue === 'number') {
        const comparison = aValue - bValue
        return sortOrder === 'asc' ? comparison : -comparison
      }
      
      return 0
    })

    return result
  }, [entities, query, filters, sortBy, sortOrder, searchFields])

  const paginatedEntities = useCallback((page: number = 1, pageSize: number = 10) => {
    const filtered = filteredEntities()
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      data: filtered.slice(start, end),
      pagination: {
        page,
        per_page: pageSize,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / pageSize),
        has_next: end < filtered.length,
        has_prev: page > 1
      }
    }
  }, [filteredEntities])

  return {
    query,
    setQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredEntities: filteredEntities(),
    paginatedEntities,
    totalCount: filteredEntities().length
  }
}

// Data import/export hook
export const useDataManager = () => {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const exportData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await memoryBank.exportData()
      
      // Create downloadable file
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ecommerce-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Data exported successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export data",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const importData = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const text = await file.text()
      const success = await memoryBank.importData(text)
      
      if (success) {
        toast({
          title: "Success",
          description: "Data imported successfully",
        })
      } else {
        throw new Error('Import failed')
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import data",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const clearAllData = useCallback(async () => {
    setLoading(true)
    try {
      await memoryBank.clearAll()
      toast({
        title: "Success",
        description: "All data cleared successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear data",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  const resetToDefaults = useCallback(async () => {
    setLoading(true)
    try {
      await memoryBank.resetToDefaults()
      toast({
        title: "Success",
        description: "Data reset to defaults successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset data",
      })
    } finally {
      setLoading(false)
    }
  }, [memoryBank, toast])

  return {
    loading,
    exportData,
    importData,
    clearAllData,
    resetToDefaults
  }
} 