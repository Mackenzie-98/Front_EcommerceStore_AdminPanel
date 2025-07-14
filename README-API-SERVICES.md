# Sistema de Servicios API - E-commerce Admin Dashboard

## Resumen del Sistema

Se ha implementado un sistema completo de servicios API para el dashboard de administración de e-commerce que incluye:

- **Servicios API centralizados** para todas las entidades del sistema
- **Integración con Memory Bank** para sincronización local/remota
- **Hooks personalizados** para facilitar el uso en componentes React
- **Manejo de errores** y estados de carga consistentes
- **Autenticación y autorización** automática
- **Sincronización online/offline** con fallbacks inteligentes

## Arquitectura del Sistema

### 1. Servicio API Base (`services/api.ts`)

```typescript
// Configuración base para todos los servicios
const apiService = new ApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  retries: 3
})

// Métodos disponibles:
apiService.get<T>(endpoint, params)
apiService.post<T>(endpoint, data)
apiService.put<T>(endpoint, data)
apiService.delete<T>(endpoint)
apiService.upload<T>(endpoint, file, additionalData)
```

**Características:**
- Autenticación automática con JWT
- Manejo de errores HTTP
- Timeouts configurables
- Retry automático
- Soporte para uploads

### 2. Servicios de Entidades (`services/entities.ts`)

Servicios especializados para cada entidad del sistema:

```typescript
// Productos
export const productsService = new ProductsService()
await productsService.getAll({ page: 1, limit: 10, category_id: 'xyz' })
await productsService.create(productData)
await productsService.updateStock(productId, quantity)
await productsService.bulkUpdate(products)
await productsService.import(csvFile)

// Categorías
export const categoriesService = new CategoriesService()
await categoriesService.getAll({ parent_id: null })
await categoriesService.getTree()
await categoriesService.reorder(categories)

// Clientes
export const customersService = new CustomersService()
await customersService.getAll({ segment: 'vip' })
await customersService.checkEmail(email)
await customersService.ban(userId, reason)

// Pedidos
export const ordersService = new OrdersService()
await ordersService.updateStatus(orderId, 'shipped', notes)
await ordersService.getTracking(orderId)
await ordersService.refund(orderId, amount, reason)

// Inventario
export const inventoryService = new InventoryService()
await inventoryService.adjustStock({ sku, delta: -5, reason: 'sold' })
await inventoryService.getLowStock()
await inventoryService.bulkAdjust(adjustments)

// Reviews
export const reviewsService = new ReviewsService()
await reviewsService.updateStatus(reviewId, 'approved')
await reviewsService.respond(reviewId, responseText)

// Cupones
export const couponsService = new CouponsService()
await couponsService.validate(code, orderTotal)
await couponsService.getUsage(couponId)

// Envíos
export const shippingService = new ShippingService()
await shippingService.calculateRates({ destination, weight, dimensions })

// Analytics
export const analyticsService = new AnalyticsService()
await analyticsService.getDashboard({ date_from, date_to })
await analyticsService.exportReport({ type, format, filters })
```

### 3. Hooks Personalizados (`hooks/use-api.ts`)

#### Hook Base - `useApi<T>`
```typescript
const { data, loading, error, execute, reset } = useApi(apiCall, {
  syncWithMemoryBank: true,
  showToasts: true,
  optimisticUpdates: false
})
```

#### Hooks Especializados
```typescript
// Productos
const productsApi = useProductsApi()
await productsApi.create.execute(productData)
await productsApi.updateStock.execute(productId, quantity)

// Categorías
const categoriesApi = useCategoriesApi()
await categoriesApi.create.execute(categoryData)
await categoriesApi.remove.execute(categoryId)

// Clientes
const customersApi = useCustomersApi()
await customersApi.checkEmail.execute(email)
await customersApi.ban.execute(userId, reason)

// Hook para listas con paginación
const productsList = useListApi<Product>(productsApi.getAll.execute, {
  page: 1,
  limit: 10,
  category_id: selectedCategory
})

// Métodos disponibles en useListApi:
productsList.fetch(params)
productsList.refresh()
productsList.goToPage(page)
productsList.search(query)
productsList.filter(filters)
```

### 4. Memory Bank Integrado (`lib/memory-bank/context.tsx`)

El Memory Bank ahora incluye:

```typescript
// Sincronización con API
const memoryBank = useMemoryBank()
await memoryBank.syncWithApi('products')
await memoryBank.syncAll()

// Estados de conexión
memoryBank.isOnline
memoryBank.isLoading
memoryBank.syncStatus // 'idle' | 'syncing' | 'error' | 'success'

// Operaciones que se sincronizan automáticamente
await memoryBank.products.create(data) // Crea local + API
await memoryBank.products.update(id, data) // Actualiza local + API
await memoryBank.products.sync() // Sincroniza desde API

// Analytics integradas
const analytics = await memoryBank.getAnalytics()
```

## Endpoints de la API

### Autenticación
```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

### Productos
```
GET    /api/v1/admin/products
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/{id}
DELETE /api/v1/admin/products/{id}
PUT    /api/v1/admin/products/{id}/stock
POST   /api/v1/admin/products/bulk-update
POST   /api/v1/admin/products/import
POST   /api/v1/admin/products/export
POST   /api/v1/admin/products/{id}/images
GET    /api/v1/admin/products/search
GET    /api/v1/admin/products/{id}/variants
```

### Categorías
```
GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/{id}
DELETE /api/v1/admin/categories/{id}
GET    /api/v1/admin/categories/slug/{slug}
GET    /api/v1/admin/categories/tree
POST   /api/v1/admin/categories/reorder
```

### Clientes
```
GET    /api/v1/admin/users
POST   /api/v1/admin/users
PUT    /api/v1/admin/users/{id}
DELETE /api/v1/admin/users/{id}
GET    /api/v1/admin/users/check-email
GET    /api/v1/admin/users/{id}/orders
GET    /api/v1/admin/users/{id}/metrics
POST   /api/v1/admin/users/{id}/ban
POST   /api/v1/admin/users/{id}/unban
```

### Pedidos
```
GET    /api/v1/admin/orders
GET    /api/v1/admin/orders/{id}
PUT    /api/v1/admin/orders/{id}/status
POST   /api/v1/admin/orders/{id}/cancel
POST   /api/v1/admin/orders/{id}/refund
GET    /api/v1/admin/orders/{id}/invoice
GET    /api/v1/admin/orders/{id}/tracking
PUT    /api/v1/admin/orders/{id}/tracking
GET    /api/v1/admin/orders/metrics
```

### Inventario
```
GET    /api/v1/admin/inventory
POST   /api/v1/admin/inventory/adjust
POST   /api/v1/admin/inventory/bulk-adjust
GET    /api/v1/admin/inventory/low-stock
GET    /api/v1/admin/inventory/{sku}/history
POST   /api/v1/admin/inventory/import
```

### Reviews
```
GET    /api/v1/admin/reviews
PUT    /api/v1/admin/reviews/{id}/status
DELETE /api/v1/admin/reviews/{id}
POST   /api/v1/admin/reviews/{id}/respond
GET    /api/v1/admin/reviews/metrics
```

### Cupones
```
GET    /api/v1/admin/coupons
POST   /api/v1/admin/coupons
PUT    /api/v1/admin/coupons/{id}
DELETE /api/v1/admin/coupons/{id}
POST   /api/v1/admin/coupons/validate
GET    /api/v1/admin/coupons/{id}/usage
```

### Envíos
```
GET    /api/v1/admin/shipping/zones
POST   /api/v1/admin/shipping/zones
PUT    /api/v1/admin/shipping/zones/{id}
DELETE /api/v1/admin/shipping/zones/{id}
GET    /api/v1/admin/shipping/methods
POST   /api/v1/admin/shipping/methods
PUT    /api/v1/admin/shipping/methods/{id}
DELETE /api/v1/admin/shipping/methods/{id}
POST   /api/v1/admin/shipping/calculate
```

### Analytics
```
GET    /api/v1/admin/analytics/dashboard
GET    /api/v1/admin/analytics/sales
GET    /api/v1/admin/analytics/products
GET    /api/v1/admin/analytics/categories
GET    /api/v1/admin/analytics/customers
GET    /api/v1/admin/analytics/cart-abandonment
GET    /api/v1/admin/analytics/conversion-funnel
GET    /api/v1/admin/analytics/revenue-forecast
POST   /api/v1/admin/analytics/export
```

## Uso en Componentes

### Ejemplo Básico
```typescript
"use client"

import { useProductsApi } from '@/hooks/use-api'

export default function ProductsPage() {
  const productsApi = useProductsApi()
  
  const handleCreate = async (data: ProductData) => {
    try {
      await productsApi.create.execute(data)
      // El hook maneja automáticamente:
      // - Sincronización con Memory Bank
      // - Mostrar toast de éxito
      // - Actualizar estado de loading
    } catch (error) {
      // Los errores se manejan automáticamente
    }
  }
  
  return (
    <div>
      <button 
        onClick={() => handleCreate(productData)}
        disabled={productsApi.create.loading}
      >
        {productsApi.create.loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </div>
  )
}
```

### Ejemplo con Lista y Paginación
```typescript
"use client"

import { useProductsApi, useListApi } from '@/hooks/use-api'

export default function ProductsListPage() {
  const productsApi = useProductsApi()
  const productsList = useListApi<Product>(productsApi.getAll.execute, {
    page: 1,
    limit: 10
  })
  
  useEffect(() => {
    productsList.fetch()
  }, [])
  
  return (
    <div>
      {productsList.loading && <div>Cargando...</div>}
      {productsList.error && <div>Error: {productsList.error.message}</div>}
      
      {productsList.items.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      <Pagination 
        currentPage={productsList.pagination.current_page}
        totalPages={productsList.pagination.total_pages}
        onPageChange={productsList.goToPage}
      />
    </div>
  )
}
```

## Configuración del Proyecto

### 1. Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Configuración de Autenticación
```typescript
// Login
const { data } = await apiService.login({ email, password })
// El token se guarda automáticamente en localStorage

// Logout
await apiService.logout()
// El token se elimina automáticamente
```

### 3. Manejo de Errores
```typescript
// Los errores se manejan automáticamente en los hooks
// Pero puedes personalizar el manejo:

const productsApi = useProductsApi({
  showToasts: false, // Deshabilitar toasts automáticos
  syncWithMemoryBank: false // Deshabilitar sincronización
})
```

## Características Avanzadas

### 1. Sincronización Offline/Online
- Detección automática de estado de conexión
- Fallback a datos locales cuando no hay conexión
- Sincronización automática al recuperar conexión

### 2. Optimistic Updates
- Actualizaciones optimistas opcionales
- Rollback automático en caso de error
- Sincronización eventual con el servidor

### 3. Caching y Performance
- Cache automático en Memory Bank
- Invalidación inteligente de cache
- Lazy loading de datos

### 4. Seguridad
- Autenticación JWT automática
- Renovación automática de tokens
- Manejo de sesiones expiradas

## Próximos Pasos

### Para Integrar con API Real:
1. Configurar `NEXT_PUBLIC_API_URL` en `.env.local`
2. Implementar endpoints según la especificación
3. Ajustar tipos de datos si es necesario
4. Configurar middleware de autenticación

### Para Desarrollo:
1. Los servicios incluyen fallbacks a datos mock
2. El Memory Bank funciona completamente offline
3. Todos los hooks están listos para usar

### Para Producción:
1. Implementar rate limiting en el cliente
2. Agregar retry strategies más avanzadas
3. Implementar cache persistente
4. Agregar métricas y monitoring 