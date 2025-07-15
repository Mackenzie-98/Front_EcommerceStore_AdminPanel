# System Patterns: E-commerce Admin Dashboard

## Architecture Overview

The system follows a **client-side architecture** with localStorage as the primary data persistence layer, designed for easy migration to a full-stack solution.

```
┌─────────────────────────────────────────────┐
│                Frontend Layer                │
├─────────────────────────────────────────────┤
│  App Router (Next.js 14) + React Components │
│  ├── Pages (app/*)                          │
│  ├── Components (components/*)               │
│  └── Hooks (hooks/*)                        │
├─────────────────────────────────────────────┤
│               State Management               │
│  ├── Memory Bank Context (lib/memory-bank/) │
│  ├── React Context API                      │
│  └── Custom Hooks                           │
├─────────────────────────────────────────────┤
│               Data Layer                     │
│  ├── localStorage (Development)             │
│  ├── API Services (services/*)              │
│  └── Type Definitions (lib/types/)          │
└─────────────────────────────────────────────┘
```

## Core Design Patterns

### 1. Memory Bank Pattern
**Purpose**: Centralized state management with localStorage persistence

**Components**:
- `context.tsx`: React Context provider
- `reducer.ts`: State management reducer
- `persistence.ts`: localStorage operations
- `seed-data.ts`: Initial data seeding

**Usage**:
```typescript
const memoryBank = useMemoryBank()
const products = memoryBank.products.getAll()
await memoryBank.products.create(newProduct)
```

### 2. Entity Service Pattern
**Purpose**: Consistent CRUD operations for all entities

**Structure**:
```typescript
interface EntityService<T> {
  getAll(): T[]
  getById(id: string): T | null
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<boolean>
  search(query: string): T[]
}
```

### 3. Hook-based Data Access
**Purpose**: Reusable data operations with loading states

**Pattern**:
```typescript
export const useProducts = () => {
  const memoryBank = useMemoryBank()
  const [loading, setLoading] = useState(false)
  
  return {
    products: memoryBank.products.getAll(),
    loading,
    create: memoryBank.products.create,
    // ... other operations
  }
}
```

## Data Flow Architecture

### 1. Component → Hook → Memory Bank → localStorage
```
User Action → Component → Custom Hook → Memory Bank → localStorage
     ↓              ↓           ↓            ↓            ↓
UI Update ← React State ← Hook State ← Context State ← Persisted Data
```

### 2. Real-time Updates
```
Data Change → Memory Bank Reducer → Context Update → Component Re-render
```

## Component Architecture

### 1. Page Components (`app/*/page.tsx`)
- **Purpose**: Route-level components
- **Responsibilities**: Layout, data fetching, state management
- **Pattern**: Use custom hooks for data operations

### 2. Feature Components (`components/*/`)
- **Purpose**: Reusable business logic components
- **Responsibilities**: Specific functionality (forms, tables, modals)
- **Pattern**: Props-based configuration

### 3. UI Components (`components/ui/`)
- **Purpose**: Base UI primitives
- **Responsibilities**: Styling, accessibility, reusability
- **Pattern**: Radix UI + Tailwind CSS

## State Management Patterns

### 1. Local Component State
```typescript
// For UI-only state
const [isOpen, setIsOpen] = useState(false)
const [loading, setLoading] = useState(false)
```

### 2. Memory Bank State
```typescript
// For business data
const { products, categories, customers } = useMemoryBank()
```

### 3. Form State
```typescript
// For form handling
const form = useForm<ProductForm>({
  resolver: zodResolver(productSchema),
  defaultValues: product
})
```

## Error Handling Patterns

### 1. Try-Catch with Toast Notifications
```typescript
try {
  await memoryBank.products.create(data)
  toast({ title: "Success", description: "Product created" })
} catch (error) {
  toast({ 
    variant: "destructive", 
    title: "Error", 
    description: error.message 
  })
}
```

### 2. Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProductsList />
</ErrorBoundary>
```

## Performance Patterns

### 1. Lazy Loading
```typescript
const ProductForm = lazy(() => import('./product-form'))
```

### 2. Memoization
```typescript
const expensiveCalculation = useMemo(() => {
  return products.filter(p => p.status === 'active')
}, [products])
```

### 3. Virtual Scrolling
```typescript
// For large lists
<VirtualizedList items={products} />
```

## Security Patterns

### 1. Input Validation
```typescript
const schema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0)
})
```

### 2. XSS Prevention
```typescript
// Sanitize user inputs
const sanitizedHtml = DOMPurify.sanitize(userInput)
```

## Testing Patterns

### 1. Component Testing
```typescript
describe('ProductForm', () => {
  it('creates product successfully', async () => {
    render(<ProductForm />)
    // Test implementation
  })
})
```

### 2. Hook Testing
```typescript
describe('useProducts', () => {
  it('returns products list', () => {
    const { result } = renderHook(() => useProducts())
    expect(result.current.products).toBeDefined()
  })
})
```

## Migration Patterns

### 1. API Integration Readiness
```typescript
// Current: localStorage
const products = memoryBank.products.getAll()

// Future: API integration
const products = await api.products.getAll()
```

### 2. Environment-based Data Source
```typescript
const dataSource = process.env.NODE_ENV === 'development' 
  ? memoryBank 
  : apiService
```

## Key Design Decisions

1. **localStorage for Development**: Enables immediate testing without backend
2. **Type-Safe Operations**: Full TypeScript coverage for data operations
3. **Modular Architecture**: Easy to extend and maintain
4. **React Patterns**: Follows React best practices and patterns
5. **Performance Focus**: Optimized for fast rendering and updates 