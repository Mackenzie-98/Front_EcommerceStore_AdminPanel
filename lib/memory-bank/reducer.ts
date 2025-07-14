import { MemoryBankState, EntityType, EntityId } from '@/lib/types'
import { MemoryBankAction } from './context'

// Helper function to update entity in array
const updateEntityInArray = <T extends { id: string }>(
  array: T[],
  id: EntityId,
  updates: Partial<T>
): T[] => {
  return array.map(item => 
    item.id === id 
      ? { ...item, ...updates, updated_at: new Date().toISOString() }
      : item
  )
}

// Helper function to remove entity from array
const removeEntityFromArray = <T extends { id: string }>(
  array: T[],
  id: EntityId
): T[] => {
  return array.filter(item => item.id !== id)
}

// Helper function to add entity to array
const addEntityToArray = <T extends { id: string }>(
  array: T[],
  entity: T
): T[] => {
  return [...array, entity]
}

// Helper function to replace entire array
const replaceEntityArray = <T>(
  array: T[],
  newArray: T[]
): T[] => {
  return [...newArray]
}

// Main reducer
export const memoryBankReducer = (
  state: MemoryBankState,
  action: MemoryBankAction
): MemoryBankState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...action.payload,
        lastUpdated: new Date().toISOString()
      }

    case 'CREATE_ENTITY': {
      const { entity, payload } = action
      const newState = { ...state }
      
      switch (entity) {
        case 'products':
          newState.products = addEntityToArray(state.products, payload)
          // Also update inventory if product is created
          if (payload.stock && payload.stock > 0) {
            const inventoryItem = {
              id: `inv-${payload.id}`,
              product_id: payload.id,
              sku: payload.sku,
              name: payload.name,
              current_stock: payload.stock,
              reserved_stock: 0,
              available_stock: payload.stock,
              low_stock_threshold: payload.low_stock_threshold,
              cost: payload.cost,
              value: payload.stock * payload.cost,
              location: 'DEFAULT-LOCATION',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            newState.inventory = addEntityToArray(state.inventory, inventoryItem)
          }
          break
        
        case 'customers':
          newState.customers = addEntityToArray(state.customers, payload)
          break
        
        case 'orders':
          newState.orders = addEntityToArray(state.orders, payload)
          // Update product sales count
          if (payload.items) {
            payload.items.forEach((item: any) => {
              newState.products = updateEntityInArray(
                newState.products,
                item.product_id,
                { sales: (newState.products.find(p => p.id === item.product_id)?.sales || 0) + item.quantity }
              )
            })
          }
          break
        
        case 'categories':
          newState.categories = addEntityToArray(state.categories, payload)
          break
        
        case 'inventory':
          newState.inventory = addEntityToArray(state.inventory, payload)
          break
        
        case 'reviews':
          newState.reviews = addEntityToArray(state.reviews, payload)
          // Update product review count and rating
          const product = newState.products.find(p => p.id === payload.product_id)
          if (product) {
            const productReviews = newState.reviews.filter(r => r.product_id === payload.product_id)
            const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
            newState.products = updateEntityInArray(
              newState.products,
              payload.product_id,
              { 
                reviews_count: productReviews.length,
                rating: avgRating
              }
            )
          }
          break
        
        case 'coupons':
          newState.coupons = addEntityToArray(state.coupons, payload)
          break
        
        case 'discountRules':
          newState.discountRules = addEntityToArray(state.discountRules, payload)
          break
        
        case 'shippingZones':
          newState.shippingZones = addEntityToArray(state.shippingZones, payload)
          break
        
        case 'shippingMethods':
          newState.shippingMethods = addEntityToArray(state.shippingMethods, payload)
          break
        
        case 'users':
          newState.users = addEntityToArray(state.users, payload)
          break
        
        case 'activityLogs':
          newState.activityLogs = addEntityToArray(state.activityLogs, payload)
          break
        
        default:
          console.warn(`Unknown entity type: ${entity}`)
          return state
      }
      
      return {
        ...newState,
        lastUpdated: new Date().toISOString()
      }
    }

    case 'UPDATE_ENTITY': {
      const { entity, id, payload } = action
      const newState = { ...state }
      
      switch (entity) {
        case 'products':
          newState.products = updateEntityInArray(state.products, id, payload)
          // Update inventory if stock changed
          if (payload.stock !== undefined) {
            const inventoryItem = newState.inventory.find(inv => inv.product_id === id)
            if (inventoryItem) {
              newState.inventory = updateEntityInArray(
                newState.inventory,
                inventoryItem.id,
                {
                  current_stock: payload.stock,
                  available_stock: payload.stock - inventoryItem.reserved_stock,
                  value: payload.stock * inventoryItem.cost
                }
              )
            }
          }
          break
        
        case 'customers':
          newState.customers = updateEntityInArray(state.customers, id, payload)
          break
        
        case 'orders':
          newState.orders = updateEntityInArray(state.orders, id, payload)
          break
        
        case 'categories':
          newState.categories = updateEntityInArray(state.categories, id, payload)
          break
        
        case 'inventory':
          newState.inventory = updateEntityInArray(state.inventory, id, payload)
          // Update product stock if inventory changed
          if (payload.current_stock !== undefined) {
            const inventoryItem = newState.inventory.find(inv => inv.id === id)
            if (inventoryItem) {
              newState.products = updateEntityInArray(
                newState.products,
                inventoryItem.product_id,
                { stock: payload.current_stock }
              )
            }
          }
          break
        
        case 'reviews':
          newState.reviews = updateEntityInArray(state.reviews, id, payload)
          // Recalculate product rating if review updated
          const review = newState.reviews.find(r => r.id === id)
          if (review) {
            const productReviews = newState.reviews.filter(r => r.product_id === review.product_id)
            const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
            newState.products = updateEntityInArray(
              newState.products,
              review.product_id,
              { rating: avgRating }
            )
          }
          break
        
        case 'coupons':
          newState.coupons = updateEntityInArray(state.coupons, id, payload)
          break
        
        case 'discountRules':
          newState.discountRules = updateEntityInArray(state.discountRules, id, payload)
          break
        
        case 'shippingZones':
          newState.shippingZones = updateEntityInArray(state.shippingZones, id, payload)
          break
        
        case 'shippingMethods':
          newState.shippingMethods = updateEntityInArray(state.shippingMethods, id, payload)
          break
        
        case 'users':
          newState.users = updateEntityInArray(state.users, id, payload)
          break
        
        case 'activityLogs':
          newState.activityLogs = updateEntityInArray(state.activityLogs, id, payload)
          break
        
        case 'storeSettings':
          newState.storeSettings = { ...state.storeSettings, ...payload }
          break
        
        default:
          console.warn(`Unknown entity type: ${entity}`)
          return state
      }
      
      return {
        ...newState,
        lastUpdated: new Date().toISOString()
      }
    }

    case 'DELETE_ENTITY': {
      const { entity, id } = action
      const newState = { ...state }
      
      switch (entity) {
        case 'products':
          newState.products = removeEntityFromArray(state.products, id)
          // Remove associated inventory items
          newState.inventory = newState.inventory.filter(inv => inv.product_id !== id)
          // Remove associated reviews
          newState.reviews = newState.reviews.filter(rev => rev.product_id !== id)
          break
        
        case 'customers':
          newState.customers = removeEntityFromArray(state.customers, id)
          // You might want to keep orders for historical purposes
          // but mark customer as deleted or anonymize
          break
        
        case 'orders':
          newState.orders = removeEntityFromArray(state.orders, id)
          break
        
        case 'categories':
          newState.categories = removeEntityFromArray(state.categories, id)
          // Update products that reference this category
          newState.products = newState.products.map(product => 
            product.category_id === id
              ? { ...product, category_id: '', category_name: 'Uncategorized' }
              : product
          )
          break
        
        case 'inventory':
          newState.inventory = removeEntityFromArray(state.inventory, id)
          break
        
        case 'reviews':
          newState.reviews = removeEntityFromArray(state.reviews, id)
          // Recalculate product rating
          const deletedReview = state.reviews.find(r => r.id === id)
          if (deletedReview) {
            const productReviews = newState.reviews.filter(r => r.product_id === deletedReview.product_id)
            const avgRating = productReviews.length > 0 
              ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
              : 0
            newState.products = updateEntityInArray(
              newState.products,
              deletedReview.product_id,
              { 
                reviews_count: productReviews.length,
                rating: avgRating 
              }
            )
          }
          break
        
        case 'coupons':
          newState.coupons = removeEntityFromArray(state.coupons, id)
          break
        
        case 'discountRules':
          newState.discountRules = removeEntityFromArray(state.discountRules, id)
          break
        
        case 'shippingZones':
          newState.shippingZones = removeEntityFromArray(state.shippingZones, id)
          // Remove associated shipping methods
          newState.shippingMethods = newState.shippingMethods.filter(method => method.zone_id !== id)
          break
        
        case 'shippingMethods':
          newState.shippingMethods = removeEntityFromArray(state.shippingMethods, id)
          break
        
        case 'users':
          newState.users = removeEntityFromArray(state.users, id)
          break
        
        case 'activityLogs':
          newState.activityLogs = removeEntityFromArray(state.activityLogs, id)
          break
        
        default:
          console.warn(`Unknown entity type: ${entity}`)
          return state
      }
      
      return {
        ...newState,
        lastUpdated: new Date().toISOString()
      }
    }

    case 'BULK_UPDATE': {
      const { entity, payload } = action
      const newState = { ...state }
      
      switch (entity) {
        case 'products':
          newState.products = replaceEntityArray(state.products, payload)
          break
        
        case 'customers':
          newState.customers = replaceEntityArray(state.customers, payload)
          break
        
        case 'orders':
          newState.orders = replaceEntityArray(state.orders, payload)
          break
        
        case 'categories':
          newState.categories = replaceEntityArray(state.categories, payload)
          break
        
        case 'inventory':
          newState.inventory = replaceEntityArray(state.inventory, payload)
          break
        
        case 'reviews':
          newState.reviews = replaceEntityArray(state.reviews, payload)
          break
        
        case 'coupons':
          newState.coupons = replaceEntityArray(state.coupons, payload)
          break
        
        case 'discountRules':
          newState.discountRules = replaceEntityArray(state.discountRules, payload)
          break
        
        case 'shippingZones':
          newState.shippingZones = replaceEntityArray(state.shippingZones, payload)
          break
        
        case 'shippingMethods':
          newState.shippingMethods = replaceEntityArray(state.shippingMethods, payload)
          break
        
        case 'users':
          newState.users = replaceEntityArray(state.users, payload)
          break
        
        case 'activityLogs':
          newState.activityLogs = replaceEntityArray(state.activityLogs, payload)
          break
        
        default:
          console.warn(`Unknown entity type: ${entity}`)
          return state
      }
      
      return {
        ...newState,
        lastUpdated: new Date().toISOString()
      }
    }

    case 'CLEAR_ALL':
      return {
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
        isLoading: false,
        isOnline: true,
        syncStatus: 'idle',
        lastUpdated: new Date().toISOString()
      }

    case 'RESET_TO_DEFAULTS':
      // This would typically import seed data
      // For now, return empty state
      return {
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
          name: 'My Store',
          description: 'A modern ecommerce store',
          email: 'admin@mystore.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, City, State 12345',
          currency: 'USD',
          timezone: 'UTC',
          language: 'en',
          tax_rate: 0.08
        },
        isLoading: false,
        isOnline: true,
        syncStatus: 'idle',
        lastUpdated: new Date().toISOString()
      }

    default:
      console.warn(`Unknown action type: ${(action as any).type}`)
      return state
  }
}

// Utility functions for specific operations
export const createStockAdjustment = (
  inventoryId: string,
  adjustment: {
    type: 'add' | 'subtract' | 'set'
    quantity: number
    reason: string
    notes?: string
    user_id: string
    user_name: string
  }
) => {
  return {
    id: `adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    product_id: '', // Will be filled by the reducer
    sku: '', // Will be filled by the reducer
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...adjustment
  }
}

export const calculateOrderTotal = (items: any[], tax_rate: number = 0, shipping_cost: number = 0, discount_amount: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * tax_rate
  const total = subtotal + tax + shipping_cost - discount_amount
  
  return {
    subtotal,
    tax,
    total,
    items_count: items.reduce((sum, item) => sum + item.quantity, 0)
  }
}

export const updateProductStock = (currentStock: number, adjustment: { type: 'add' | 'subtract' | 'set', quantity: number }) => {
  switch (adjustment.type) {
    case 'add':
      return Math.max(0, currentStock + adjustment.quantity)
    case 'subtract':
      return Math.max(0, currentStock - adjustment.quantity)
    case 'set':
      return Math.max(0, adjustment.quantity)
    default:
      return currentStock
  }
}

export const validateEntityData = (entity: EntityType, data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  switch (entity) {
    case 'products':
      if (!data.name || data.name.trim().length < 3) {
        errors.push('Product name must be at least 3 characters long')
      }
      if (!data.sku || data.sku.trim().length < 3) {
        errors.push('Product SKU must be at least 3 characters long')
      }
      if (!data.category_id) {
        errors.push('Product must have a category')
      }
      if (data.price <= 0) {
        errors.push('Product price must be greater than 0')
      }
      if (data.stock < 0) {
        errors.push('Product stock cannot be negative')
      }
      break
    
    case 'customers':
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email address is required')
      }
      if (!data.name || data.name.trim().length < 2) {
        errors.push('Customer name must be at least 2 characters long')
      }
      if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Customer last name must be at least 2 characters long')
      }
      break
    
    case 'orders':
      if (!data.customer_id) {
        errors.push('Order must have a customer')
      }
      if (!data.items || data.items.length === 0) {
        errors.push('Order must have at least one item')
      }
      if (!data.shipping_address) {
        errors.push('Order must have a shipping address')
      }
      break
    
    case 'categories':
      if (!data.name || data.name.trim().length < 2) {
        errors.push('Category name must be at least 2 characters long')
      }
      if (!data.slug || data.slug.trim().length < 2) {
        errors.push('Category slug must be at least 2 characters long')
      }
      break
    
    default:
      // Add more validations as needed
      break
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
} 