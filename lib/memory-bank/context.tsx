"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { MemoryBankState, MemoryBankEvent, EntityType, EntityId, Product, Customer, Order, Category, InventoryItem, Review, Coupon } from '@/lib/types'
import { apiService } from '@/services/api'
import { services } from '@/services/entities'

// Simple initial state
const initialState: MemoryBankState = {
  products: [],
  customers: [],
  orders: [],
  categories: [],
  inventory: [],
  reviews: [],
  coupons: [],
  discountRules: [],
  shippingZones: [],
  shippingMethods: [],
  users: [],
  activityLogs: [],
  storeSettings: {
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    tax_rate: 0
  },
  lastUpdated: new Date().toISOString(),
  isLoading: false,
  isOnline: true,
  syncStatus: 'idle'
}

// Simple reducer function
const memoryBankReducer = (state: MemoryBankState, action: MemoryBankAction): MemoryBankState => {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...action.payload, lastUpdated: new Date().toISOString() }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload }
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload }
    case 'CREATE_ENTITY':
      return { ...state, [action.entity]: [...(state[action.entity] as any[]), action.payload], lastUpdated: new Date().toISOString() }
    case 'UPDATE_ENTITY':
      return {
        ...state,
        [action.entity]: (state[action.entity] as any[]).map((item: any) => 
          item.id === action.id ? { ...item, ...action.payload, updated_at: new Date().toISOString() } : item
        ),
        lastUpdated: new Date().toISOString()
      }
    case 'DELETE_ENTITY':
      return {
        ...state,
        [action.entity]: (state[action.entity] as any[]).filter((item: any) => item.id !== action.id),
        lastUpdated: new Date().toISOString()
      }
    case 'BULK_UPDATE':
      return { ...state, [action.entity]: action.payload, lastUpdated: new Date().toISOString() }
    case 'SYNC_ENTITY':
      return { ...state, [action.entity]: action.payload, lastUpdated: new Date().toISOString() }
    case 'CLEAR_ALL':
      return initialState
    case 'RESET_TO_DEFAULTS':
      return initialState
    default:
      return state
  }
}

// Action types
export type MemoryBankAction =
  | { type: 'INITIALIZE'; payload: MemoryBankState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_SYNC_STATUS'; payload: 'idle' | 'syncing' | 'error' | 'success' }
  | { type: 'CREATE_ENTITY'; entity: EntityType; payload: any }
  | { type: 'UPDATE_ENTITY'; entity: EntityType; id: EntityId; payload: any }
  | { type: 'DELETE_ENTITY'; entity: EntityType; id: EntityId }
  | { type: 'BULK_UPDATE'; entity: EntityType; payload: any[] }
  | { type: 'SYNC_ENTITY'; entity: EntityType; payload: any[] }
  | { type: 'CLEAR_ALL' }
  | { type: 'RESET_TO_DEFAULTS' }

// Context type
interface MemoryBankContextType {
  state: MemoryBankState
  dispatch: React.Dispatch<MemoryBankAction>
  
  // Connection status
  isOnline: boolean
  isLoading: boolean
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
  
  // Sync operations
  syncWithApi: (entity?: EntityType) => Promise<void>
  syncAll: () => Promise<void>
  
  // Generic CRUD operations (with API integration)
  create: <T>(entity: EntityType, data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => Promise<T>
  update: <T>(entity: EntityType, id: EntityId, data: Partial<T>) => Promise<T>
  delete: (entity: EntityType, id: EntityId) => Promise<boolean>
  findById: <T>(entity: EntityType, id: EntityId) => T | undefined
  findMany: <T>(entity: EntityType, filter?: (item: T) => boolean) => T[]
  
  // Specific entity operations
  products: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getBySku: (sku: string) => any | undefined
    getByCategory: (categoryId: string) => any[]
    getLowStock: () => any[]
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    updateStock: (id: EntityId, quantity: number) => Promise<any>
    search: (query: string) => any[]
    sync: () => Promise<void>
  }
  
  customers: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getByEmail: (email: string) => any | undefined
    getBySegment: (segment: string) => any[]
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    search: (query: string) => any[]
    sync: () => Promise<void>
  }
  
  orders: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getByCustomer: (customerId: string) => any[]
    getByStatus: (status: string) => any[]
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    updateStatus: (id: EntityId, status: string) => Promise<any>
    search: (query: string) => any[]
    sync: () => Promise<void>
  }
  
  categories: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getBySlug: (slug: string) => any | undefined
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    sync: () => Promise<void>
  }
  
  inventory: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getBySku: (sku: string) => any | undefined
    getLowStock: () => any[]
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    adjustStock: (data: any) => Promise<any>
    sync: () => Promise<void>
  }
  
  reviews: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getByProduct: (productId: string) => any[]
    getByCustomer: (customerId: string) => any[]
    getByStatus: (status: string) => any[]
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    updateStatus: (id: EntityId, status: string) => Promise<any>
    sync: () => Promise<void>
  }
  
  coupons: {
    getAll: () => any[]
    getById: (id: EntityId) => any | undefined
    getByCode: (code: string) => any | undefined
    getActive: () => any[]
    create: (data: any) => Promise<any>
    update: (id: EntityId, data: any) => Promise<any>
    delete: (id: EntityId) => Promise<boolean>
    validateCoupon: (code: string, orderTotal: number) => Promise<{ valid: boolean; discount: number; error?: string }>
    sync: () => Promise<void>
  }
  
  // Utility functions
  exportData: () => Promise<string>
  importData: (data: string) => Promise<boolean>
  clearAll: () => Promise<void>
  resetToDefaults: () => Promise<void>
  
  // Analytics (with API integration)
  getAnalytics: () => Promise<{
    totalProducts: number
    totalCustomers: number
    totalOrders: number
    totalRevenue: number
    avgOrderValue: number
    lowStockProducts: number
    pendingOrders: number
    activeCustomers: number
  }>
  
  // Event handling
  addEventListener: (callback: (event: MemoryBankEvent) => void) => () => void
  removeEventListener: (callback: (event: MemoryBankEvent) => void) => void
}

// Create context
const MemoryBankContext = createContext<MemoryBankContextType | undefined>(undefined)

// Helper function to generate ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Helper function to add timestamps
const addTimestamps = (data: any, isUpdate = false) => {
  const now = new Date().toISOString()
  return {
    ...data,
    id: data.id || generateId(),
    created_at: data.created_at || now,
    updated_at: now,
  }
}

// Event listeners
const eventListeners: ((event: MemoryBankEvent) => void)[] = []

const emitEvent = (event: MemoryBankEvent) => {
  eventListeners.forEach(callback => callback(event))
}

// Provider component
export const MemoryBankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(memoryBankReducer, initialState)

  // Initialize from API on mount
  useEffect(() => {
    const initializeData = async () => {
      if (apiService.isAuthenticated()) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          await syncAll()
        } catch (error) {
          console.error('Error initializing data from API:', error)
          dispatch({ type: 'SET_ONLINE', payload: false })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }
    
    initializeData()
  }, [])

  // Connection status monitoring
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true })
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Sync operations
  const syncWithApi = async (entity?: EntityType) => {
    if (!apiService.isAuthenticated()) return
    
    try {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' })
      
      if (entity) {
        const response = await getServiceForEntity(entity).getAll()
        if (response.success) {
          dispatch({ type: 'SYNC_ENTITY', entity, payload: response.data.items || response.data })
        }
      } else {
        await syncAll()
      }
      
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'success' })
    } catch (error) {
      console.error('Error syncing with API:', error)
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' })
    }
  }

  const syncAll = async () => {
    const entities: EntityType[] = ['products', 'customers', 'orders', 'categories', 'inventory', 'reviews', 'coupons']
    
    for (const entity of entities) {
      try {
        const response = await getServiceForEntity(entity).getAll()
        if (response.success) {
          dispatch({ type: 'SYNC_ENTITY', entity, payload: response.data.items || response.data })
        }
      } catch (error) {
        console.error(`Error syncing ${entity}:`, error)
      }
    }
  }

  // Helper to get service for entity
  const getServiceForEntity = (entity: EntityType): any => {
    switch (entity) {
      case 'products': return services.products
      case 'customers': return services.customers
      case 'orders': return services.orders
      case 'categories': return services.categories
      case 'inventory': return services.inventory
      case 'reviews': return services.reviews
      case 'coupons': return services.coupons
      default: throw new Error(`Unknown entity: ${entity}`)
    }
  }

  // Generic CRUD operations with API integration
  const create = async <T,>(entity: EntityType, data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await getServiceForEntity(entity).create(data)
        if (response.success) {
          const newEntity = response.data as T
          dispatch({ type: 'CREATE_ENTITY', entity, payload: newEntity })
          
          emitEvent({
            type: 'CREATE',
            entity,
            id: (newEntity as any).id,
            data: newEntity,
            timestamp: new Date().toISOString()
          })
          
          return newEntity
        }
      }
      
      // Fallback to local creation
      const newEntity = addTimestamps(data) as T
      dispatch({ type: 'CREATE_ENTITY', entity, payload: newEntity })
      
      emitEvent({
        type: 'CREATE',
        entity,
        id: (newEntity as any).id,
        data: newEntity,
        timestamp: new Date().toISOString()
      })
      
      return newEntity
    } catch (error) {
      console.error(`Error creating ${entity}:`, error)
      throw error
    }
  }

  const update = async <T,>(entity: EntityType, id: EntityId, data: Partial<T>): Promise<T> => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await getServiceForEntity(entity).update(id, data)
        if (response.success) {
          const updatedEntity = response.data as T
          dispatch({ type: 'UPDATE_ENTITY', entity, id, payload: updatedEntity })
          
          emitEvent({
            type: 'UPDATE',
            entity,
            id,
            data: updatedEntity,
            timestamp: new Date().toISOString()
          })
          
          return updatedEntity
        }
      }
      
      // Fallback to local update
      const updatedEntity = addTimestamps(data, true) as T
      dispatch({ type: 'UPDATE_ENTITY', entity, id, payload: updatedEntity })
      
      emitEvent({
        type: 'UPDATE',
        entity,
        id,
        data: updatedEntity,
        timestamp: new Date().toISOString()
      })
      
      return updatedEntity
    } catch (error) {
      console.error(`Error updating ${entity}:`, error)
      throw error
    }
  }

  const deleteEntity = async (entity: EntityType, id: EntityId): Promise<boolean> => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await getServiceForEntity(entity).delete(id)
        if (response.success) {
          dispatch({ type: 'DELETE_ENTITY', entity, id })
          
          emitEvent({
            type: 'DELETE',
            entity,
            id,
            timestamp: new Date().toISOString()
          })
          
          return true
        }
      }
      
      // Fallback to local deletion
      dispatch({ type: 'DELETE_ENTITY', entity, id })
      
      emitEvent({
        type: 'DELETE',
        entity,
        id,
        timestamp: new Date().toISOString()
      })
      
      return true
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error)
      throw error
    }
  }

  const findById = <T,>(entity: EntityType, id: EntityId): T | undefined => {
    const entities = state[entity] as T[]
    return entities.find((item: any) => item.id === id)
  }

  const findMany = <T,>(entity: EntityType, filter?: (item: T) => boolean): T[] => {
    const entities = state[entity] as T[]
    return filter ? entities.filter(filter) : entities
  }

  // Products operations
  const products = {
    getAll: () => state.products,
    getById: (id: EntityId) => findById('products', id),
    getBySku: (sku: string) => state.products.find((p: Product) => p.sku === sku),
    getByCategory: (categoryId: string) => state.products.filter((p: Product) => p.category_id === categoryId),
    getLowStock: () => state.products.filter((p: Product) => p.stock <= p.low_stock_threshold),
    create: (data: any) => create('products', data),
    update: (id: EntityId, data: any) => update('products', id, data),
    delete: (id: EntityId) => deleteEntity('products', id),
    updateStock: async (id: EntityId, quantity: number) => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await services.products.updateStock(id, quantity)
          if (response.success) {
            return update('products', id, { stock: quantity })
          }
        }
        return update('products', id, { stock: quantity })
      } catch (error) {
        console.error('Error updating stock:', error)
        throw error
      }
    },
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return state.products.filter((p: Product) => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      )
    },
    sync: () => syncWithApi('products')
  }

  // Customers operations
  const customers = {
    getAll: () => state.customers,
    getById: (id: EntityId) => findById('customers', id),
    getByEmail: (email: string) => state.customers.find((c: Customer) => c.email === email),
    getBySegment: (segment: string) => state.customers.filter((c: Customer) => c.segment === segment),
    create: (data: any) => create('customers', data),
    update: (id: EntityId, data: any) => update('customers', id, data),
    delete: (id: EntityId) => deleteEntity('customers', id),
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return state.customers.filter((c: Customer) => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.lastName.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery)
      )
    },
    sync: () => syncWithApi('customers')
  }

  // Orders operations
  const orders = {
    getAll: () => state.orders,
    getById: (id: EntityId) => findById('orders', id),
    getByCustomer: (customerId: string) => state.orders.filter((o: Order) => o.customer_id === customerId),
    getByStatus: (status: string) => state.orders.filter((o: Order) => o.status === status),
    create: (data: any) => create('orders', data),
    update: (id: EntityId, data: any) => update('orders', id, data),
    delete: (id: EntityId) => deleteEntity('orders', id),
    updateStatus: async (id: EntityId, status: string) => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await services.orders.updateStatus(id, status)
          if (response.success) {
            return update('orders', id, { status })
          }
        }
        return update('orders', id, { status })
      } catch (error) {
        console.error('Error updating order status:', error)
        throw error
      }
    },
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return state.orders.filter((o: Order) => 
        o.order_number.toLowerCase().includes(lowerQuery) ||
        o.customer.name.toLowerCase().includes(lowerQuery) ||
        o.customer.email.toLowerCase().includes(lowerQuery)
      )
    },
    sync: () => syncWithApi('orders')
  }

  // Categories operations
  const categories = {
    getAll: () => state.categories,
    getById: (id: EntityId) => findById('categories', id),
    getBySlug: (slug: string) => state.categories.find((c: Category) => c.slug === slug),
    create: (data: any) => create('categories', data),
    update: (id: EntityId, data: any) => update('categories', id, data),
    delete: (id: EntityId) => deleteEntity('categories', id),
    sync: () => syncWithApi('categories')
  }

  // Inventory operations
  const inventory = {
    getAll: () => state.inventory,
    getById: (id: EntityId) => findById('inventory', id),
    getBySku: (sku: string) => state.inventory.find((i: InventoryItem) => i.sku === sku),
    getLowStock: () => state.inventory.filter((i: InventoryItem) => i.current_stock <= i.low_stock_threshold),
    create: (data: any) => create('inventory', data),
    update: (id: EntityId, data: any) => update('inventory', id, data),
    delete: (id: EntityId) => deleteEntity('inventory', id),
    adjustStock: async (data: any) => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await services.inventory.adjustStock(data)
          if (response.success) {
            return response.data
          }
        }
        const adjustment = addTimestamps(data)
        return adjustment
      } catch (error) {
        console.error('Error adjusting stock:', error)
        throw error
      }
    },
    sync: () => syncWithApi('inventory')
  }

  // Reviews operations
  const reviews = {
    getAll: () => state.reviews,
    getById: (id: EntityId) => findById('reviews', id),
    getByProduct: (productId: string) => state.reviews.filter((r: Review) => r.product_id === productId),
    getByCustomer: (customerId: string) => state.reviews.filter((r: Review) => r.customer_id === customerId),
    getByStatus: (status: string) => state.reviews.filter((r: Review) => r.status === status),
    create: (data: any) => create('reviews', data),
    update: (id: EntityId, data: any) => update('reviews', id, data),
    delete: (id: EntityId) => deleteEntity('reviews', id),
    updateStatus: async (id: EntityId, status: string) => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await services.reviews.updateStatus(id, status)
          if (response.success) {
            return update('reviews', id, { status })
          }
        }
        return update('reviews', id, { status })
      } catch (error) {
        console.error('Error updating review status:', error)
        throw error
      }
    },
    sync: () => syncWithApi('reviews')
  }

  // Coupons operations
  const coupons = {
    getAll: () => state.coupons,
    getById: (id: EntityId) => findById('coupons', id),
    getByCode: (code: string) => state.coupons.find((c: Coupon) => c.code === code),
    getActive: () => state.coupons.filter((c: Coupon) => c.is_active),
    create: (data: any) => create('coupons', data),
    update: (id: EntityId, data: any) => update('coupons', id, data),
    delete: (id: EntityId) => deleteEntity('coupons', id),
    validateCoupon: async (code: string, orderTotal: number) => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await services.coupons.validate(code, orderTotal)
          if (response.success) {
            return response.data
          }
        }
        
        // Fallback to local validation
        const coupon = state.coupons.find((c: Coupon) => c.code === code && c.is_active)
        if (!coupon) {
          return { valid: false, discount: 0, error: 'Coupon not found or inactive' }
        }
        
        const now = new Date()
        const validFrom = new Date(coupon.valid_from)
        const validUntil = new Date(coupon.valid_until)
        
        if (now < validFrom || now > validUntil) {
          return { valid: false, discount: 0, error: 'Coupon expired' }
        }
        
        if (orderTotal < coupon.minimum_amount) {
          return { valid: false, discount: 0, error: `Minimum order amount is ${coupon.minimum_amount}` }
        }
        
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
          return { valid: false, discount: 0, error: 'Coupon usage limit reached' }
        }
        
        let discount = 0
        if (coupon.type === 'percentage') {
          discount = (orderTotal * coupon.value) / 100
          if (coupon.maximum_discount && discount > coupon.maximum_discount) {
            discount = coupon.maximum_discount
          }
        } else {
          discount = coupon.value
        }
        
        return { valid: true, discount }
      } catch (error) {
        console.error('Error validating coupon:', error)
        throw error
      }
    },
    sync: () => syncWithApi('coupons')
  }

  // Utility functions
  const exportData = async (): Promise<string> => {
    return JSON.stringify(state, null, 2)
  }

  const importData = async (data: string): Promise<boolean> => {
    try {
      const parsedData = JSON.parse(data)
      dispatch({ type: 'INITIALIZE', payload: parsedData })
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  const clearAll = async (): Promise<void> => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  const resetToDefaults = async (): Promise<void> => {
    dispatch({ type: 'RESET_TO_DEFAULTS' })
  }

  // Analytics with API integration
  const getAnalytics = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await services.analytics.getDashboard()
        if (response.success) {
          return {
            totalProducts: state.products.length,
            totalCustomers: response.data.customers?.value || 0,
            totalOrders: response.data.orders?.value || 0,
            totalRevenue: response.data.revenue?.value || 0,
            avgOrderValue: response.data.orders?.value > 0 ? response.data.revenue?.value / response.data.orders?.value : 0,
            lowStockProducts: state.products.filter((p: Product) => p.stock <= p.low_stock_threshold).length,
            pendingOrders: state.orders.filter((o: Order) => o.status === 'pending').length,
            activeCustomers: response.data.customers?.value || 0
          }
        }
      }
      
      // Fallback to local analytics
      const totalProducts = state.products.length
      const totalCustomers = state.customers.length
      const totalOrders = state.orders.length
      const totalRevenue = state.orders.reduce((sum: number, order: Order) => sum + order.total, 0)
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const lowStockProducts = state.products.filter((p: Product) => p.stock <= p.low_stock_threshold).length
      const pendingOrders = state.orders.filter((o: Order) => o.status === 'pending').length
      const activeCustomers = state.customers.filter((c: Customer) => c.status === 'active').length

      return {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
        avgOrderValue,
        lowStockProducts,
        pendingOrders,
        activeCustomers
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      throw error
    }
  }

  // Event handling
  const addEventListener = (callback: (event: MemoryBankEvent) => void) => {
    eventListeners.push(callback)
    return () => removeEventListener(callback)
  }

  const removeEventListener = (callback: (event: MemoryBankEvent) => void) => {
    const index = eventListeners.indexOf(callback)
    if (index > -1) {
      eventListeners.splice(index, 1)
    }
  }

  const contextValue: MemoryBankContextType = {
    state,
    dispatch,
    isOnline: state.isOnline,
    isLoading: state.isLoading,
    syncStatus: state.syncStatus,
    syncWithApi,
    syncAll,
    create,
    update,
    delete: deleteEntity,
    findById,
    findMany,
    products,
    customers,
    orders,
    categories,
    inventory,
    reviews,
    coupons,
    exportData,
    importData,
    clearAll,
    resetToDefaults,
    getAnalytics,
    addEventListener,
    removeEventListener
  }

  return (
    <MemoryBankContext.Provider value={contextValue}>
      {children}
    </MemoryBankContext.Provider>
  )
}

// Custom hook to use the context
export const useMemoryBank = () => {
  const context = useContext(MemoryBankContext)
  if (context === undefined) {
    throw new Error('useMemoryBank must be used within a MemoryBankProvider')
  }
  return context
}

// Export action creators for convenience
export const createEntityAction = (entity: EntityType, payload: any): MemoryBankAction => ({
  type: 'CREATE_ENTITY',
  entity,
  payload
})

export const updateEntityAction = (entity: EntityType, id: EntityId, payload: any): MemoryBankAction => ({
  type: 'UPDATE_ENTITY',
  entity,
  id,
  payload
})

export const deleteEntityAction = (entity: EntityType, id: EntityId): MemoryBankAction => ({
  type: 'DELETE_ENTITY',
  entity,
  id
})

export const bulkUpdateAction = (entity: EntityType, payload: any[]): MemoryBankAction => ({
  type: 'BULK_UPDATE',
  entity,
  payload
}) 