import { useState, useCallback } from 'react'
import { useMemoryBank } from '@/lib/memory-bank/context'
import { services } from '@/services/entities'
import { ApiError } from '@/services/api'
import { useToast } from './use-toast'
import { EntityType, EntityId } from '@/lib/types'

// Hook configuration
interface UseApiConfig {
  syncWithMemoryBank?: boolean
  showToasts?: boolean
  optimisticUpdates?: boolean
}

// Hook return type
interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

// Generic API hook
export function useApi<T>(
  apiCall: (...args: any[]) => Promise<{ success: boolean; data: T }>,
  config: UseApiConfig = {}
): UseApiReturn<T> {
  const { syncWithMemoryBank = true, showToasts = true, optimisticUpdates = false } = config
  const { toast } = useToast()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiCall(...args)
      
      if (response.success) {
        setData(response.data)
        return response.data
      } else {
        throw new Error('API call failed')
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      
      if (showToasts) {
        toast({
          variant: "destructive",
          title: "Error",
          description: apiError.message || "An error occurred"
        })
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, showToasts, toast])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// Specialized hooks for each entity
export function useProductsApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()
  const { toast } = useToast()

  const getAll = useApi(services.products.getAll.bind(services.products), config)
  const getById = useApi(services.products.getById.bind(services.products), config)
  
  const create = useApi(
    async (data: any) => {
      const response = await services.products.create(data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.products.create(response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const update = useApi(
    async (id: string, data: any) => {
      const response = await services.products.update(id, data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.products.update(id, response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const remove = useApi(
    async (id: string) => {
      const response = await services.products.delete(id)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.products.delete(id)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const updateStock = useApi(
    async (id: string, quantity: number) => {
      const response = await services.products.updateStock(id, quantity)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.products.updateStock(id, quantity)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const search = useApi(services.products.search.bind(services.products), config)

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    updateStock,
    search,
    bulkUpdate: useApi(services.products.bulkUpdate.bind(services.products), config),
    import: useApi(services.products.import.bind(services.products), config),
    export: useApi(services.products.export.bind(services.products), config),
    uploadImage: useApi(services.products.uploadImage.bind(services.products), config),
    getVariants: useApi(services.products.getVariants.bind(services.products), config),
    createVariant: useApi(services.products.createVariant.bind(services.products), config)
  }
}

export function useCategoriesApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()

  const getAll = useApi(services.categories.getAll.bind(services.categories), config)
  const getById = useApi(services.categories.getById.bind(services.categories), config)
  
  const create = useApi(
    async (data: any) => {
      const response = await services.categories.create(data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.categories.create(response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const update = useApi(
    async (id: string, data: any) => {
      const response = await services.categories.update(id, data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.categories.update(id, response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const remove = useApi(
    async (id: string) => {
      const response = await services.categories.delete(id)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.categories.delete(id)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    getBySlug: useApi(services.categories.getBySlug.bind(services.categories), config),
    getTree: useApi(services.categories.getTree.bind(services.categories), config),
    reorder: useApi(services.categories.reorder.bind(services.categories), config)
  }
}

export function useCustomersApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()

  const getAll = useApi(services.customers.getAll.bind(services.customers), config)
  const getById = useApi(services.customers.getById.bind(services.customers), config)
  
  const create = useApi(
    async (data: any) => {
      const response = await services.customers.create(data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.customers.create(response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const update = useApi(
    async (id: string, data: any) => {
      const response = await services.customers.update(id, data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.customers.update(id, response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const remove = useApi(
    async (id: string) => {
      const response = await services.customers.delete(id)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.customers.delete(id)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    checkEmail: useApi(services.customers.checkEmail.bind(services.customers), config),
    getOrders: useApi(services.customers.getOrders.bind(services.customers), config),
    getMetrics: useApi(services.customers.getMetrics.bind(services.customers), config),
    ban: useApi(services.customers.ban.bind(services.customers), config),
    unban: useApi(services.customers.unban.bind(services.customers), config),
    export: useApi(services.customers.export.bind(services.customers), config)
  }
}

export function useOrdersApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()

  const getAll = useApi(services.orders.getAll.bind(services.orders), config)
  const getById = useApi(services.orders.getById.bind(services.orders), config)
  
  const updateStatus = useApi(
    async (id: string, status: string, notes?: string) => {
      const response = await services.orders.updateStatus(id, status, notes)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.orders.updateStatus(id, status)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  return {
    getAll,
    getById,
    updateStatus,
    cancel: useApi(services.orders.cancel.bind(services.orders), config),
    refund: useApi(services.orders.refund.bind(services.orders), config),
    getInvoice: useApi(services.orders.getInvoice.bind(services.orders), config),
    getTracking: useApi(services.orders.getTracking.bind(services.orders), config),
    updateTracking: useApi(services.orders.updateTracking.bind(services.orders), config),
    getMetrics: useApi(services.orders.getMetrics.bind(services.orders), config)
  }
}

export function useInventoryApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()

  const getAll = useApi(services.inventory.getAll.bind(services.inventory), config)
  const getById = useApi(services.inventory.getById.bind(services.inventory), config)
  
  const adjustStock = useApi(
    async (data: any) => {
      const response = await services.inventory.adjustStock(data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.inventory.adjustStock(data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  return {
    getAll,
    getById,
    adjustStock,
    bulkAdjust: useApi(services.inventory.bulkAdjust.bind(services.inventory), config),
    getLowStock: useApi(services.inventory.getLowStock.bind(services.inventory), config),
    getHistory: useApi(services.inventory.getHistory.bind(services.inventory), config),
    importStock: useApi(services.inventory.importStock.bind(services.inventory), config)
  }
}

export function useReviewsApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()

  const getAll = useApi(services.reviews.getAll.bind(services.reviews), config)
  const getById = useApi(services.reviews.getById.bind(services.reviews), config)
  
  const updateStatus = useApi(
    async (id: string, status: string) => {
      const response = await services.reviews.updateStatus(id, status)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.reviews.updateStatus(id, status)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const remove = useApi(
    async (id: string) => {
      const response = await services.reviews.delete(id)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.reviews.delete(id)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  return {
    getAll,
    getById,
    updateStatus,
    remove,
    respond: useApi(services.reviews.respond.bind(services.reviews), config),
    getMetrics: useApi(services.reviews.getMetrics.bind(services.reviews), config)
  }
}

export function useCouponsApi(config?: UseApiConfig) {
  const memoryBank = useMemoryBank()

  const getAll = useApi(services.coupons.getAll.bind(services.coupons), config)
  const getById = useApi(services.coupons.getById.bind(services.coupons), config)
  
  const create = useApi(
    async (data: any) => {
      const response = await services.coupons.create(data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.coupons.create(response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const update = useApi(
    async (id: string, data: any) => {
      const response = await services.coupons.update(id, data)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.coupons.update(id, response.data)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  const remove = useApi(
    async (id: string) => {
      const response = await services.coupons.delete(id)
      
      // Sync with memory bank
      if (response.success) {
        await memoryBank.coupons.delete(id)
      }
      
      return response
    },
    { ...config, showToasts: true }
  )

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    validate: useApi(services.coupons.validate.bind(services.coupons), config),
    getUsage: useApi(services.coupons.getUsage.bind(services.coupons), config)
  }
}

export function useShippingApi(config?: UseApiConfig) {
  return {
    zones: {
      getAll: useApi(services.shipping.getZones.bind(services.shipping), config),
      create: useApi(services.shipping.createZone.bind(services.shipping), config),
      update: useApi(services.shipping.updateZone.bind(services.shipping), config),
      remove: useApi(services.shipping.deleteZone.bind(services.shipping), config)
    },
    methods: {
      getAll: useApi(services.shipping.getMethods.bind(services.shipping), config),
      create: useApi(services.shipping.createMethod.bind(services.shipping), config),
      update: useApi(services.shipping.updateMethod.bind(services.shipping), config),
      remove: useApi(services.shipping.deleteMethod.bind(services.shipping), config)
    },
    calculateRates: useApi(services.shipping.calculateRates.bind(services.shipping), config)
  }
}

export function useAnalyticsApi(config?: UseApiConfig) {
  return {
    getDashboard: useApi(services.analytics.getDashboard.bind(services.analytics), config),
    getSales: useApi(services.analytics.getSales.bind(services.analytics), config),
    getProducts: useApi(services.analytics.getProducts.bind(services.analytics), config),
    getCategories: useApi(services.analytics.getCategories.bind(services.analytics), config),
    getCustomers: useApi(services.analytics.getCustomers.bind(services.analytics), config),
    getCartAbandonment: useApi(services.analytics.getCartAbandonment.bind(services.analytics), config),
    getConversionFunnel: useApi(services.analytics.getConversionFunnel.bind(services.analytics), config),
    getRevenueForecast: useApi(services.analytics.getRevenueForecast.bind(services.analytics), config),
    exportReport: useApi(services.analytics.exportReport.bind(services.analytics), config)
  }
}

export function useUsersApi(config?: UseApiConfig) {
  return {
    getAll: useApi(services.users.getAll.bind(services.users), config),
    getById: useApi(services.users.getById.bind(services.users), config),
    create: useApi(services.users.create.bind(services.users), config),
    update: useApi(services.users.update.bind(services.users), config),
    remove: useApi(services.users.delete.bind(services.users), config),
    updatePassword: useApi(services.users.updatePassword.bind(services.users), config),
    updatePermissions: useApi(services.users.updatePermissions.bind(services.users), config),
    getActivityLogs: useApi(services.users.getActivityLogs.bind(services.users), config)
  }
}

// Combined hooks for convenience
export function useApiServices(config?: UseApiConfig) {
  return {
    products: useProductsApi(config),
    categories: useCategoriesApi(config),
    customers: useCustomersApi(config),
    orders: useOrdersApi(config),
    inventory: useInventoryApi(config),
    reviews: useReviewsApi(config),
    coupons: useCouponsApi(config),
    shipping: useShippingApi(config),
    analytics: useAnalyticsApi(config),
    users: useUsersApi(config)
  }
}

// Data fetching hook for lists with pagination
export function useListApi<T>(
  apiCall: (params: any) => Promise<{ success: boolean; data: { items: T[]; pagination: any } }>,
  initialParams: any = {},
  config?: UseApiConfig
) {
  const [params, setParams] = useState(initialParams)
  const [items, setItems] = useState<T[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  })

  const { data, loading, error, execute } = useApi(apiCall, config)

  const fetch = useCallback(async (newParams?: any) => {
    const finalParams = { ...params, ...newParams }
    setParams(finalParams)
    
    try {
      const result = await execute(finalParams)
      setItems(result.items)
      setPagination(result.pagination)
      return result
    } catch (err) {
      setItems([])
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 10
      })
      throw err
    }
  }, [execute, params])

  const refresh = useCallback(() => fetch(params), [fetch, params])

  const goToPage = useCallback((page: number) => {
    fetch({ ...params, page })
  }, [fetch, params])

  const search = useCallback((query: string) => {
    fetch({ ...params, search: query, page: 1 })
  }, [fetch, params])

  const filter = useCallback((filters: any) => {
    fetch({ ...params, ...filters, page: 1 })
  }, [fetch, params])

  return {
    items,
    pagination,
    params,
    loading,
    error,
    fetch,
    refresh,
    goToPage,
    search,
    filter
  }
}

export default useApi 