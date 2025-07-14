import { MemoryBankState } from '@/lib/types'

// Storage keys
const STORAGE_KEY = 'ecommerce-admin-memory-bank'
const STORAGE_VERSION = '1.0'
const STORAGE_VERSION_KEY = 'ecommerce-admin-version'

// IndexedDB configuration
const DB_NAME = 'EcommerceAdminDB'
const DB_VERSION = 1
const STORE_NAME = 'memoryBank'

// Compression utilities
const compressData = (data: any): string => {
  return JSON.stringify(data)
}

const decompressData = (data: string): any => {
  return JSON.parse(data)
}

// LocalStorage implementation
class LocalStorageManager {
  async save(data: MemoryBankState): Promise<void> {
    try {
      const compressed = compressData(data)
      localStorage.setItem(STORAGE_KEY, compressed)
      localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      throw new Error('Failed to save data to localStorage')
    }
  }

  async load(): Promise<MemoryBankState | null> {
    try {
      const version = localStorage.getItem(STORAGE_VERSION_KEY)
      if (version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, clearing localStorage')
        this.clear()
        return null
      }

      const compressed = localStorage.getItem(STORAGE_KEY)
      if (!compressed) {
        return null
      }

      return decompressData(compressed)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_VERSION_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  isAvailable(): boolean {
    try {
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}

// IndexedDB implementation
class IndexedDBManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  async save(data: MemoryBankState): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      
      const compressed = compressData(data)
      const request = store.put({
        id: STORAGE_KEY,
        data: compressed,
        version: STORAGE_VERSION,
        timestamp: new Date().toISOString()
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async load(): Promise<MemoryBankState | null> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(STORAGE_KEY)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        if (!result) {
          resolve(null)
          return
        }

        if (result.version !== STORAGE_VERSION) {
          console.warn('Storage version mismatch, clearing IndexedDB')
          this.clear()
          resolve(null)
          return
        }

        try {
          const data = decompressData(result.data)
          resolve(data)
        } catch (error) {
          console.error('Error decompressing data:', error)
          resolve(null)
        }
      }
    })
  }

  async clear(): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(STORAGE_KEY)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  isAvailable(): boolean {
    return typeof indexedDB !== 'undefined'
  }
}

// Main persistence manager
class PersistenceManager {
  private localStorage: LocalStorageManager
  private indexedDB: IndexedDBManager
  private preferredStorage: 'localStorage' | 'indexedDB'

  constructor() {
    this.localStorage = new LocalStorageManager()
    this.indexedDB = new IndexedDBManager()
    
    // Prefer IndexedDB for larger storage capacity
    this.preferredStorage = this.indexedDB.isAvailable() ? 'indexedDB' : 'localStorage'
  }

  async save(data: MemoryBankState): Promise<void> {
    const errors: Error[] = []

    // Try preferred storage first
    if (this.preferredStorage === 'indexedDB') {
      try {
        await this.indexedDB.save(data)
        return
      } catch (error) {
        errors.push(error as Error)
        console.warn('IndexedDB save failed, falling back to localStorage:', error)
      }
    }

    // Fallback to localStorage
    if (this.localStorage.isAvailable()) {
      try {
        await this.localStorage.save(data)
        return
      } catch (error) {
        errors.push(error as Error)
        console.error('localStorage save failed:', error)
      }
    }

    // If all storage methods fail
    if (errors.length > 0) {
      throw new Error(`All storage methods failed: ${errors.map(e => e.message).join(', ')}`)
    }
  }

  async load(): Promise<MemoryBankState | null> {
    // Try preferred storage first
    if (this.preferredStorage === 'indexedDB') {
      try {
        const data = await this.indexedDB.load()
        if (data) {
          return data
        }
      } catch (error) {
        console.warn('IndexedDB load failed, falling back to localStorage:', error)
      }
    }

    // Fallback to localStorage
    if (this.localStorage.isAvailable()) {
      try {
        const data = await this.localStorage.load()
        if (data) {
          return data
        }
      } catch (error) {
        console.error('localStorage load failed:', error)
      }
    }

    return null
  }

  async clear(): Promise<void> {
    const promises: Promise<void>[] = []

    if (this.indexedDB.isAvailable()) {
      promises.push(this.indexedDB.clear().catch(console.error))
    }

    if (this.localStorage.isAvailable()) {
      promises.push(this.localStorage.clear().catch(console.error))
    }

    await Promise.all(promises)
  }

  async getStorageInfo(): Promise<{
    available: string[]
    preferred: string
    size: number
  }> {
    const available: string[] = []
    
    if (this.indexedDB.isAvailable()) {
      available.push('indexedDB')
    }
    
    if (this.localStorage.isAvailable()) {
      available.push('localStorage')
    }

    // Estimate storage size
    let size = 0
    try {
      const data = await this.load()
      if (data) {
        size = JSON.stringify(data).length
      }
    } catch (error) {
      console.error('Error calculating storage size:', error)
    }

    return {
      available,
      preferred: this.preferredStorage,
      size
    }
  }

  async export(): Promise<string> {
    const data = await this.load()
    if (!data) {
      throw new Error('No data to export')
    }

    return JSON.stringify({
      version: STORAGE_VERSION,
      exported_at: new Date().toISOString(),
      data
    }, null, 2)
  }

  async import(jsonData: string): Promise<MemoryBankState> {
    try {
      const parsed = JSON.parse(jsonData)
      
      // Validate structure
      if (!parsed.data || !parsed.version) {
        throw new Error('Invalid export format')
      }

      // Version compatibility check
      if (parsed.version !== STORAGE_VERSION) {
        console.warn(`Version mismatch: expected ${STORAGE_VERSION}, got ${parsed.version}`)
        // Could implement migration logic here
      }

      // Validate data structure
      const data = parsed.data as MemoryBankState
      if (!this.validateDataStructure(data)) {
        throw new Error('Invalid data structure')
      }

      // Save the imported data
      await this.save(data)
      
      return data
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private validateDataStructure(data: any): data is MemoryBankState {
    // Basic validation of required fields
    const requiredFields = [
      'products', 'customers', 'orders', 'categories', 'inventory',
      'reviews', 'coupons', 'discountRules', 'shippingZones', 
      'shippingMethods', 'users', 'activityLogs', 'storeSettings'
    ]

    for (const field of requiredFields) {
      if (!data.hasOwnProperty(field)) {
        console.error(`Missing required field: ${field}`)
        return false
      }
    }

    // Validate arrays
    const arrayFields = requiredFields.filter(field => field !== 'storeSettings')
    for (const field of arrayFields) {
      if (!Array.isArray(data[field])) {
        console.error(`Field ${field} should be an array`)
        return false
      }
    }

    return true
  }

  // Backup management
  async createBackup(): Promise<string> {
    const data = await this.load()
    if (!data) {
      throw new Error('No data to backup')
    }

    const backup = {
      version: STORAGE_VERSION,
      created_at: new Date().toISOString(),
      data,
      metadata: {
        products_count: data.products.length,
        customers_count: data.customers.length,
        orders_count: data.orders.length,
        total_revenue: data.orders.reduce((sum, order) => sum + order.total, 0)
      }
    }

    return JSON.stringify(backup, null, 2)
  }

  async restoreBackup(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData)
      
      if (!backup.data || !backup.version) {
        throw new Error('Invalid backup format')
      }

      if (!this.validateDataStructure(backup.data)) {
        throw new Error('Invalid backup data structure')
      }

      await this.save(backup.data)
    } catch (error) {
      console.error('Error restoring backup:', error)
      throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Migration utilities
  async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    // Placeholder for future migration logic
    console.log(`Migrating data from ${fromVersion} to ${toVersion}`)
    // Implementation would depend on specific version differences
  }
}

// Export singleton instance
export const persistenceManager = new PersistenceManager()

// Export utility functions
export const exportData = () => persistenceManager.export()
export const importData = (data: string) => persistenceManager.import(data)
export const createBackup = () => persistenceManager.createBackup()
export const restoreBackup = (backup: string) => persistenceManager.restoreBackup(backup)
export const clearAllData = () => persistenceManager.clear()
export const getStorageInfo = () => persistenceManager.getStorageInfo()

// Storage event listener for cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      // Emit custom event for cross-tab synchronization
      window.dispatchEvent(new CustomEvent('memoryBankDataChanged', {
        detail: { source: 'storage' }
      }))
    }
  })
} 