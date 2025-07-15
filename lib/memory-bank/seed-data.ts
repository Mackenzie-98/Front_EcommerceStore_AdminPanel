import { MemoryBankState } from '@/lib/types'

// Generate current timestamp
const now = new Date().toISOString()

// Helper function to generate dates
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

export const seedData: MemoryBankState = {
  // Store Settings
  storeSettings: {
    name: "E-commerce Admin Store",
    description: "The best electronics store with premium products and excellent service",
    email: "admin@ecommerce-store.com",
    phone: "+1 (555) 123-4567",
    address: "123 Commerce Street, Business District, NY 10001",
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
    tax_rate: 0.08,
    logo: "/placeholder-logo.png",
    favicon: "/placeholder-logo.svg",
    shipping_policy: "Free shipping on orders over $100",
    return_policy: "30-day return policy",
    privacy_policy: "We respect your privacy",
    terms_of_service: "Terms and conditions apply"
  },

  // Categories
  categories: [
    {
      id: "cat-1",
      name: "Hombre",
      description: "Men's clothing and accessories",
      slug: "hombre",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 1,
      products_count: 8,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    },
    {
      id: "cat-2",
      name: "Mujer",
      description: "Women's clothing and accessories",
      slug: "mujer",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 2,
      products_count: 2,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    }
  ],

  // Subcategories
  subcategories: [
    {
      id: "subcat-1",
      name: "Oversized",
      description: "Oversized t-shirts and shirts for men",
      slug: "oversized-hombre",
      category_id: "cat-1",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 1,
      products_count: 2,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    },
    {
      id: "subcat-2",
      name: "Packs",
      description: "Product packs for men",
      slug: "packs-hombre",
      category_id: "cat-1",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 2,
      products_count: 2,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    },
    {
      id: "subcat-3",
      name: "Conjuntos",
      description: "Clothing sets for men",
      slug: "conjuntos-hombre",
      category_id: "cat-1",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 3,
      products_count: 2,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    },
    {
      id: "subcat-4",
      name: "Esentials",
      description: "Essential clothing for men",
      slug: "esentials-hombre",
      category_id: "cat-1",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 4,
      products_count: 2,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    },
    {
      id: "subcat-5",
      name: "Oversized",
      description: "Oversized clothing for women",
      slug: "oversized-mujer",
      category_id: "cat-2",
      image: "/placeholder.jpg",
      is_active: true,
      sort_order: 1,
      products_count: 2,
      created_at: daysAgo(30),
      updated_at: daysAgo(30)
    }
  ],

  // Products
  products: [
    {
      id: "prod-1",
      name: "Camisa Cuello Neru Oversized",
      description: "Camisa oversized con cuello neru, perfecta para un look relajado y moderno",
      sku: "OV001",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-1",
      subcategory_name: "Oversized",
      price: 89.00,
      cost: 45.00,
      stock: 45,
      low_stock_threshold: 10,
      status: "active",
      images: ["/placeholder.jpg", "/placeholder.svg"],
      variants: [],
      has_variants: false,
      sales: 234,
      rating: 4.5,
      reviews_count: 12,
      tags: ["Camisa", "Oversized", "Cuello Neru", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Blanco",
        size: "Oversized",
        material: "Algodón"
      },
      seo_title: "Camisa Cuello Neru Oversized - Ropa Urbana Moderna",
      seo_description: "Camisa oversized con cuello neru, perfecta para un look urbano y relajado. Envío gratis.",
      weight: 0.3,
      dimensions: {
        length: 75.0,
        width: 65.0,
        height: 2.0
      },
      created_at: daysAgo(15),
      updated_at: daysAgo(5)
    },
    {
      id: "prod-2",
      name: "Oversized Galleta",
      description: "Camiseta oversized con diseño galleta, perfecta para un look urbano y divertido",
      sku: "OV002",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-1",
      subcategory_name: "Oversized",
      price: 79.00,
      cost: 40.00,
      stock: 23,
      low_stock_threshold: 5,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 156,
      rating: 4.7,
      reviews_count: 8,
      tags: ["Oversized", "Galleta", "Camiseta", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Beige",
        size: "Oversized",
        material: "Algodón"
      },
      seo_title: "Oversized Galleta - Camiseta Urbana Divertida",
      seo_description: "Camiseta oversized con diseño galleta, perfecta para un look urbano y divertido. Envío gratis.",
      weight: 0.25,
      dimensions: {
        length: 70.0,
        width: 60.0,
        height: 2.0
      },
      created_at: daysAgo(20),
      updated_at: daysAgo(10)
    },
    {
      id: "prod-3",
      name: "Conjunto Alto Relieve",
      description: "Conjunto oversized con diseño alto relieve, incluye sudadera y pantalón",
      sku: "OV003",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-3",
      subcategory_name: "Conjuntos",
      price: 159.00,
      cost: 85.00,
      stock: 156,
      low_stock_threshold: 20,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 445,
      rating: 4.3,
      reviews_count: 25,
      tags: ["Conjunto", "Alto Relieve", "Sudadera", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Gris",
        size: "Oversized",
        material: "Algodón Premium"
      },
      seo_title: "Conjunto Alto Relieve - Sudadera y Pantalón Oversized",
      seo_description: "Conjunto oversized con diseño alto relieve, incluye sudadera y pantalón. Envío gratis.",
      weight: 0.8,
      dimensions: {
        length: 80.0,
        width: 70.0,
        height: 5.0
      },
      created_at: daysAgo(25),
      updated_at: daysAgo(8)
    },
    {
      id: "prod-4",
      name: "Sudadera Oversized Essential",
      description: "Sudadera oversized básica de la línea esencial, perfecta para uso diario",
      sku: "OV004",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-4",
      subcategory_name: "Esentials",
      price: 99.00,
      cost: 55.00,
      stock: 78,
      low_stock_threshold: 15,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 89,
      rating: 4.6,
      reviews_count: 6,
      tags: ["Sudadera", "Oversized", "Essential", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Negro",
        size: "Oversized",
        material: "Algodón Premium"
      },
      seo_title: "Sudadera Oversized Essential - Básico Premium",
      seo_description: "Sudadera oversized básica de la línea esencial, perfecta para uso diario. Envío gratis.",
      weight: 0.6,
      dimensions: {
        length: 75.0,
        width: 65.0,
        height: 3.0
      },
      created_at: daysAgo(18),
      updated_at: daysAgo(12)
    },
    {
      id: "prod-5",
      name: "Camiseta Oversized Mujer",
      description: "Camiseta oversized femenina con corte moderno y cómodo",
      sku: "OV005",
      category_id: "cat-2",
      category_name: "Mujer",
      subcategory_id: "subcat-5",
      subcategory_name: "Oversized",
      price: 69.00,
      cost: 35.00,
      stock: 34,
      low_stock_threshold: 10,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 167,
      rating: 4.4,
      reviews_count: 15,
      tags: ["Camiseta", "Oversized", "Mujer", "Moderno"],
      attributes: {
        brand: "Oversized Store",
        color: "Rosa",
        size: "Oversized",
        material: "Algodón Suave"
      },
      seo_title: "Camiseta Oversized Mujer - Corte Moderno y Cómodo",
      seo_description: "Camiseta oversized femenina con corte moderno y cómodo. Envío gratis.",
      weight: 0.2,
      dimensions: {
        length: 68.0,
        width: 55.0,
        height: 2.0
      },
      created_at: daysAgo(22),
      updated_at: daysAgo(7)
    },
    {
      id: "prod-6",
      name: "Pack Básico Oversized",
      description: "Pack de 3 camisetas oversized básicas en colores neutros",
      sku: "PK001",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-2",
      subcategory_name: "Packs",
      price: 159.00,
      cost: 85.00,
      stock: 25,
      low_stock_threshold: 5,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 89,
      rating: 4.6,
      reviews_count: 18,
      tags: ["Pack", "Básico", "Oversized", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Multicolor",
        size: "Oversized",
        material: "Algodón",
        items_count: "3"
      },
      seo_title: "Pack Básico Oversized - 3 Camisetas Básicas",
      seo_description: "Pack de 3 camisetas oversized básicas en colores neutros. Envío gratis.",
      weight: 0.6,
      dimensions: {
        length: 70.0,
        width: 60.0,
        height: 6.0
      },
      created_at: daysAgo(18),
      updated_at: daysAgo(5)
    },
    {
      id: "prod-7",
      name: "Pack Premium Streetwear",
      description: "Pack premium con sudadera, camiseta y gorra oversized",
      sku: "PK002",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-2",
      subcategory_name: "Packs",
      price: 219.00,
      cost: 120.00,
      stock: 15,
      low_stock_threshold: 3,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 45,
      rating: 4.8,
      reviews_count: 12,
      tags: ["Pack", "Premium", "Streetwear", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Negro",
        size: "Oversized",
        material: "Algodón Premium",
        items_count: "3"
      },
      seo_title: "Pack Premium Streetwear - Sudadera + Camiseta + Gorra",
      seo_description: "Pack premium con sudadera, camiseta y gorra oversized. Envío gratis.",
      weight: 1.2,
      dimensions: {
        length: 75.0,
        width: 65.0,
        height: 8.0
      },
      created_at: daysAgo(20),
      updated_at: daysAgo(8)
    },
    {
      id: "prod-8",
      name: "Conjunto Deportivo Urban",
      description: "Conjunto deportivo urban con sudadera con capucha y joggers",
      sku: "CJ001",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-3",
      subcategory_name: "Conjuntos",
      price: 129.00,
      cost: 70.00,
      stock: 32,
      low_stock_threshold: 8,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 123,
      rating: 4.4,
      reviews_count: 22,
      tags: ["Conjunto", "Deportivo", "Urban", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Gris Oscuro",
        size: "Oversized",
        material: "Algodón Deportivo"
      },
      seo_title: "Conjunto Deportivo Urban - Sudadera + Joggers",
      seo_description: "Conjunto deportivo urban con sudadera con capucha y joggers. Envío gratis.",
      weight: 0.9,
      dimensions: {
        length: 80.0,
        width: 70.0,
        height: 5.0
      },
      created_at: daysAgo(16),
      updated_at: daysAgo(4)
    },
    {
      id: "prod-9",
      name: "Hoodie Essential Negro",
      description: "Sudadera con capucha negra de la línea esencial, perfecta para uso diario",
      sku: "ES001",
      category_id: "cat-1",
      category_name: "Hombre",
      subcategory_id: "subcat-4",
      subcategory_name: "Esentials",
      price: 89.00,
      cost: 48.00,
      stock: 67,
      low_stock_threshold: 12,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 156,
      rating: 4.7,
      reviews_count: 28,
      tags: ["Hoodie", "Essential", "Negro", "Hombre"],
      attributes: {
        brand: "Oversized Store",
        color: "Negro",
        size: "Oversized",
        material: "Algodón Premium"
      },
      seo_title: "Hoodie Essential Negro - Sudadera Básica Premium",
      seo_description: "Sudadera con capucha negra de la línea esencial, perfecta para uso diario. Envío gratis.",
      weight: 0.7,
      dimensions: {
        length: 75.0,
        width: 65.0,
        height: 3.0
      },
      created_at: daysAgo(14),
      updated_at: daysAgo(3)
    },
    {
      id: "prod-10",
      name: "Crop Top Oversized Mujer",
      description: "Crop top oversized femenino con diseño moderno y cómodo",
      sku: "OV006",
      category_id: "cat-2",
      category_name: "Mujer",
      subcategory_id: "subcat-5",
      subcategory_name: "Oversized",
      price: 59.00,
      cost: 30.00,
      stock: 41,
      low_stock_threshold: 10,
      status: "active",
      images: ["/placeholder.jpg"],
      variants: [],
      has_variants: false,
      sales: 87,
      rating: 4.3,
      reviews_count: 14,
      tags: ["Crop Top", "Oversized", "Mujer", "Moderno"],
      attributes: {
        brand: "Oversized Store",
        color: "Beige",
        size: "Oversized",
        material: "Algodón Suave"
      },
      seo_title: "Crop Top Oversized Mujer - Diseño Moderno",
      seo_description: "Crop top oversized femenino con diseño moderno y cómodo. Envío gratis.",
      weight: 0.15,
      dimensions: {
        length: 50.0,
        width: 55.0,
        height: 2.0
      },
      created_at: daysAgo(12),
      updated_at: daysAgo(2)
    }
  ],

  // Inventory
  inventory: [
    {
      id: "inv-1",
      product_id: "prod-1",
      sku: "OV001",
      name: "Camisa Cuello Neru Oversized",
      current_stock: 45,
      reserved_stock: 5,
      available_stock: 40,
      low_stock_threshold: 10,
      cost: 45.00,
      value: 2025.00,
      location: "A1-B2-C3",
      last_restocked: daysAgo(5),
      created_at: daysAgo(15),
      updated_at: daysAgo(1)
    },
    {
      id: "inv-2",
      product_id: "prod-2",
      sku: "OV002",
      name: "Oversized Galleta",
      current_stock: 23,
      reserved_stock: 2,
      available_stock: 21,
      low_stock_threshold: 5,
      cost: 40.00,
      value: 920.00,
      location: "A2-B1-C1",
      last_restocked: daysAgo(10),
      created_at: daysAgo(20),
      updated_at: daysAgo(3)
    },
    {
      id: "inv-3",
      product_id: "prod-3",
      sku: "OV003",
      name: "Conjunto Alto Relieve",
      current_stock: 156,
      reserved_stock: 12,
      available_stock: 144,
      low_stock_threshold: 20,
      cost: 85.00,
      value: 13260.00,
      location: "B1-A3-C2",
      last_restocked: daysAgo(8),
      created_at: daysAgo(25),
      updated_at: daysAgo(2)
    },
    {
      id: "inv-4",
      product_id: "prod-4",
      sku: "OV004",
      name: "Sudadera Oversized Essential",
      current_stock: 78,
      reserved_stock: 8,
      available_stock: 70,
      low_stock_threshold: 15,
      cost: 55.00,
      value: 4290.00,
      location: "A1-B3-C1",
      last_restocked: daysAgo(12),
      created_at: daysAgo(18),
      updated_at: daysAgo(4)
    },
    {
      id: "inv-5",
      product_id: "prod-5",
      sku: "OV005",
      name: "Camiseta Oversized Mujer",
      current_stock: 34,
      reserved_stock: 4,
      available_stock: 30,
      low_stock_threshold: 10,
      cost: 35.00,
      value: 1190.00,
      location: "B2-A1-C3",
      last_restocked: daysAgo(7),
      created_at: daysAgo(22),
      updated_at: daysAgo(1)
    },
    {
      id: "inv-6",
      product_id: "prod-6",
      sku: "PK001",
      name: "Pack Básico Oversized",
      current_stock: 25,
      reserved_stock: 3,
      available_stock: 22,
      low_stock_threshold: 5,
      cost: 85.00,
      value: 2125.00,
      location: "C1-A2-B1",
      last_restocked: daysAgo(6),
      created_at: daysAgo(18),
      updated_at: daysAgo(2)
    },
    {
      id: "inv-7",
      product_id: "prod-7",
      sku: "PK002",
      name: "Pack Premium Streetwear",
      current_stock: 15,
      reserved_stock: 2,
      available_stock: 13,
      low_stock_threshold: 3,
      cost: 120.00,
      value: 1800.00,
      location: "C2-A1-B2",
      last_restocked: daysAgo(9),
      created_at: daysAgo(20),
      updated_at: daysAgo(3)
    },
    {
      id: "inv-8",
      product_id: "prod-8",
      sku: "CJ001",
      name: "Conjunto Deportivo Urban",
      current_stock: 32,
      reserved_stock: 4,
      available_stock: 28,
      low_stock_threshold: 8,
      cost: 70.00,
      value: 2240.00,
      location: "A3-B1-C2",
      last_restocked: daysAgo(4),
      created_at: daysAgo(16),
      updated_at: daysAgo(1)
    },
    {
      id: "inv-9",
      product_id: "prod-9",
      sku: "ES001",
      name: "Hoodie Essential Negro",
      current_stock: 67,
      reserved_stock: 7,
      available_stock: 60,
      low_stock_threshold: 12,
      cost: 48.00,
      value: 3216.00,
      location: "B3-A2-C1",
      last_restocked: daysAgo(3),
      created_at: daysAgo(14),
      updated_at: daysAgo(1)
    },
    {
      id: "inv-10",
      product_id: "prod-10",
      sku: "OV006",
      name: "Crop Top Oversized Mujer",
      current_stock: 41,
      reserved_stock: 5,
      available_stock: 36,
      low_stock_threshold: 10,
      cost: 30.00,
      value: 1230.00,
      location: "B2-A3-C1",
      last_restocked: daysAgo(2),
      created_at: daysAgo(12),
      updated_at: daysAgo(1)
    }
  ],

  // Customers
  customers: [
    {
      id: "cust-1",
      email: "ana.garcia@email.com",
      name: "Ana",
      lastName: "García",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder-user.jpg",
      total_orders: 12,
      total_spent: 2340.50,
      avg_order_value: 195.04,
      last_order: daysAgo(2),
      status: "active",
      segment: "vip",
      location: "Madrid, Spain",
      addresses: [
        {
          line1: "123 Main Street",
          line2: "Apt 4B",
          city: "Madrid",
          state: "Madrid",
          postalCode: "28013",
          country: "Spain",
          isDefault: true
        }
      ],
      notes: "VIP customer, prefers express shipping",
      created_at: daysAgo(180),
      updated_at: daysAgo(2)
    },
    {
      id: "cust-2",
      email: "carlos.lopez@email.com",
      name: "Carlos",
      lastName: "López",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder-user.jpg",
      total_orders: 5,
      total_spent: 890.00,
      avg_order_value: 178.00,
      last_order: daysAgo(5),
      status: "active",
      segment: "regular",
      location: "Barcelona, Spain",
      addresses: [
        {
          line1: "456 Oak Avenue",
          city: "Barcelona",
          state: "Catalonia",
          postalCode: "08001",
          country: "Spain",
          isDefault: true
        }
      ],
      created_at: daysAgo(120),
      updated_at: daysAgo(5)
    },
    {
      id: "cust-3",
      email: "maria.rodriguez@email.com",
      name: "María",
      lastName: "Rodríguez",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder-user.jpg",
      total_orders: 2,
      total_spent: 156.99,
      avg_order_value: 78.50,
      last_order: daysAgo(7),
      status: "active",
      segment: "new",
      location: "Valencia, Spain",
      addresses: [
        {
          line1: "789 Pine Street",
          city: "Valencia",
          state: "Valencia",
          postalCode: "46001",
          country: "Spain",
          isDefault: true
        }
      ],
      created_at: daysAgo(30),
      updated_at: daysAgo(7)
    },
    {
      id: "cust-4",
      email: "juan.martin@email.com",
      name: "Juan",
      lastName: "Martín",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder-user.jpg",
      total_orders: 8,
      total_spent: 1567.80,
      avg_order_value: 195.98,
      last_order: daysAgo(45),
      status: "inactive",
      segment: "regular",
      location: "Sevilla, Spain",
      addresses: [
        {
          line1: "321 Elm Street",
          city: "Sevilla",
          state: "Andalusia",
          postalCode: "41001",
          country: "Spain",
          isDefault: true
        }
      ],
      created_at: daysAgo(200),
      updated_at: daysAgo(45)
    },
    {
      id: "cust-5",
      email: "laura.sanchez@email.com",
      name: "Laura",
      lastName: "Sánchez",
      phone: "+1 (555) 567-8901",
      avatar: "/placeholder-user.jpg",
      total_orders: 15,
      total_spent: 3456.20,
      avg_order_value: 230.41,
      last_order: daysAgo(3),
      status: "active",
      segment: "vip",
      location: "Bilbao, Spain",
      addresses: [
        {
          line1: "654 Maple Avenue",
          city: "Bilbao",
          state: "Basque Country",
          postalCode: "48001",
          country: "Spain",
          isDefault: true
        }
      ],
      notes: "Frequent buyer, eligible for special discounts",
      created_at: daysAgo(300),
      updated_at: daysAgo(3)
    }
  ],

  // Orders
  orders: [
    {
      id: "ord-1",
      order_number: "#ORD-3210",
      customer_id: "cust-1",
      customer: {
        name: "Ana García",
        email: "ana.garcia@email.com",
        phone: "+1 (555) 123-4567"
      },
      status: "completed",
      payment_status: "paid",
      total: 234.50,
      subtotal: 217.13,
      tax: 17.37,
      shipping_cost: 0.00,
      discount_amount: 0.00,
      items: [
        {
          id: "item-1",
          product_id: "prod-3",
          sku: "APP-PRO-WHT",
          name: "AirPods Pro 2nd Gen White",
          price: 279.00,
          cost: 199.00,
          quantity: 1,
          total: 279.00,
          image: "/placeholder.jpg"
        }
      ],
      items_count: 1,
      shipping_address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "Madrid",
        state: "Madrid",
        postalCode: "28013",
        country: "Spain"
      },
      billing_address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "Madrid",
        state: "Madrid",
        postalCode: "28013",
        country: "Spain"
      },
      tracking_number: "1Z999AA1234567890",
      payment_method: "credit_card",
      fulfillment_status: "fulfilled",
      created_at: daysAgo(2),
      updated_at: daysAgo(1)
    },
    {
      id: "ord-2",
      order_number: "#ORD-3209",
      customer_id: "cust-2",
      customer: {
        name: "Carlos López",
        email: "carlos.lopez@email.com",
        phone: "+1 (555) 234-5678"
      },
      status: "shipped",
      payment_status: "paid",
      total: 156.00,
      subtotal: 144.44,
      tax: 11.56,
      shipping_cost: 0.00,
      discount_amount: 0.00,
      items: [
        {
          id: "item-2",
          product_id: "prod-3",
          sku: "APP-PRO-WHT",
          name: "AirPods Pro 2nd Gen White",
          price: 279.00,
          cost: 199.00,
          quantity: 1,
          total: 279.00,
          image: "/placeholder.jpg"
        }
      ],
      items_count: 1,
      shipping_address: {
        line1: "456 Oak Avenue",
        city: "Barcelona",
        state: "Catalonia",
        postalCode: "08001",
        country: "Spain"
      },
      billing_address: {
        line1: "456 Oak Avenue",
        city: "Barcelona",
        state: "Catalonia",
        postalCode: "08001",
        country: "Spain"
      },
      tracking_number: "1Z999AA1234567891",
      payment_method: "paypal",
      fulfillment_status: "partial",
      created_at: daysAgo(5),
      updated_at: daysAgo(4)
    },
    {
      id: "ord-3",
      order_number: "#ORD-3208",
      customer_id: "cust-3",
      customer: {
        name: "María Rodríguez",
        email: "maria.rodriguez@email.com",
        phone: "+1 (555) 345-6789"
      },
      status: "processing",
      payment_status: "paid",
      total: 89.99,
      subtotal: 83.32,
      tax: 6.67,
      shipping_cost: 0.00,
      discount_amount: 0.00,
      items: [
        {
          id: "item-3",
          product_id: "prod-3",
          sku: "APP-PRO-WHT",
          name: "AirPods Pro 2nd Gen White",
          price: 279.00,
          cost: 199.00,
          quantity: 1,
          total: 279.00,
          image: "/placeholder.jpg"
        }
      ],
      items_count: 1,
      shipping_address: {
        line1: "789 Pine Street",
        city: "Valencia",
        state: "Valencia",
        postalCode: "46001",
        country: "Spain"
      },
      billing_address: {
        line1: "789 Pine Street",
        city: "Valencia",
        state: "Valencia",
        postalCode: "46001",
        country: "Spain"
      },
      payment_method: "credit_card",
      fulfillment_status: "pending",
      created_at: daysAgo(7),
      updated_at: daysAgo(6)
    },
    {
      id: "ord-4",
      order_number: "#ORD-3207",
      customer_id: "cust-4",
      customer: {
        name: "Juan Martín",
        email: "juan.martin@email.com",
        phone: "+1 (555) 456-7890"
      },
      status: "completed",
      payment_status: "paid",
      total: 445.00,
      subtotal: 412.04,
      tax: 32.96,
      shipping_cost: 0.00,
      discount_amount: 0.00,
      items: [
        {
          id: "item-4",
          product_id: "prod-5",
          sku: "AWS-S9-45-RED",
          name: "Apple Watch Series 9 45mm Red",
          price: 429.00,
          cost: 329.00,
          quantity: 1,
          total: 429.00,
          image: "/placeholder.jpg"
        }
      ],
      items_count: 1,
      shipping_address: {
        line1: "321 Elm Street",
        city: "Sevilla",
        state: "Andalusia",
        postalCode: "41001",
        country: "Spain"
      },
      billing_address: {
        line1: "321 Elm Street",
        city: "Sevilla",
        state: "Andalusia",
        postalCode: "41001",
        country: "Spain"
      },
      tracking_number: "1Z999AA1234567892",
      payment_method: "credit_card",
      fulfillment_status: "fulfilled",
      created_at: daysAgo(45),
      updated_at: daysAgo(44)
    },
    {
      id: "ord-5",
      order_number: "#ORD-3206",
      customer_id: "cust-5",
      customer: {
        name: "Laura Sánchez",
        email: "laura.sanchez@email.com",
        phone: "+1 (555) 567-8901"
      },
      status: "pending",
      payment_status: "pending",
      total: 67.50,
      subtotal: 62.50,
      tax: 5.00,
      shipping_cost: 0.00,
      discount_amount: 0.00,
      items: [
        {
          id: "item-5",
          product_id: "prod-3",
          sku: "APP-PRO-WHT",
          name: "AirPods Pro 2nd Gen White",
          price: 279.00,
          cost: 199.00,
          quantity: 1,
          total: 279.00,
          image: "/placeholder.jpg"
        }
      ],
      items_count: 1,
      shipping_address: {
        line1: "654 Maple Avenue",
        city: "Bilbao",
        state: "Basque Country",
        postalCode: "48001",
        country: "Spain"
      },
      billing_address: {
        line1: "654 Maple Avenue",
        city: "Bilbao",
        state: "Basque Country",
        postalCode: "48001",
        country: "Spain"
      },
      payment_method: "credit_card",
      fulfillment_status: "pending",
      created_at: daysAgo(3),
      updated_at: daysAgo(3)
    }
  ],

  // Reviews
  reviews: [
    {
      id: "rev-1",
      product_id: "prod-1",
      customer_id: "cust-1",
      order_id: "ord-1",
      rating: 5,
      title: "Excellent iPhone!",
      comment: "This iPhone is amazing. The camera quality is outstanding and the battery life is great. Highly recommend!",
      user: {
        id: "cust-1",
        name: "Ana García",
        email: "ana.garcia@email.com",
        avatar: "/placeholder-user.jpg"
      },
      product: {
        id: "prod-1",
        name: "iPhone 15 Pro 256GB Black",
        sku: "IPH15P-256-BLK",
        image: "/placeholder.jpg"
      },
      is_verified_purchase: true,
      helpful_count: 12,
      images: ["/placeholder.jpg"],
      status: "approved",
      created_at: daysAgo(1),
      updated_at: daysAgo(1)
    },
    {
      id: "rev-2",
      product_id: "prod-2",
      customer_id: "cust-2",
      rating: 4,
      title: "Good laptop but pricey",
      comment: "The MacBook works very well and the build quality is excellent. However, I think it's a bit overpriced for what you get.",
      user: {
        id: "cust-2",
        name: "Carlos López",
        email: "carlos.lopez@email.com"
      },
      product: {
        id: "prod-2",
        name: "MacBook Air M2 512GB Silver",
        sku: "MBA-M2-512-SLV",
        image: "/placeholder.jpg"
      },
      is_verified_purchase: true,
      helpful_count: 3,
      images: [],
      status: "approved",
      created_at: daysAgo(4),
      updated_at: daysAgo(4)
    },
    {
      id: "rev-3",
      product_id: "prod-3",
      customer_id: "cust-3",
      rating: 2,
      title: "Not impressed",
      comment: "The sound quality is decent but I expected better noise cancellation. Also had connectivity issues.",
      user: {
        id: "cust-3",
        name: "María Rodríguez",
        email: "maria.rodriguez@email.com"
      },
      product: {
        id: "prod-3",
        name: "AirPods Pro 2nd Gen White",
        sku: "APP-PRO-WHT",
        image: "/placeholder.jpg"
      },
      is_verified_purchase: false,
      helpful_count: 1,
      images: [],
      status: "pending",
      created_at: daysAgo(6),
      updated_at: daysAgo(6)
    }
  ],

  // Coupons
  coupons: [
    {
      id: "coup-1",
      code: "WELCOME20",
      description: "Welcome discount for new customers",
      type: "percentage",
      value: 20,
      minimum_amount: 50,
      maximum_discount: 100,
      usage_limit: 1000,
      usage_count: 234,
      valid_from: daysAgo(365),
      valid_until: daysAgo(-365),
      is_active: true,
      applies_to: "all",
      applies_to_ids: [],
      customer_eligibility: "new",
      created_at: daysAgo(365),
      updated_at: daysAgo(30)
    },
    {
      id: "coup-2",
      code: "SUMMER50",
      description: "Summer fixed discount",
      type: "fixed",
      value: 50,
      minimum_amount: 200,
      usage_limit: 500,
      usage_count: 89,
      valid_from: daysAgo(60),
      valid_until: daysAgo(-30),
      is_active: true,
      applies_to: "categories",
      applies_to_ids: ["cat-1", "cat-2"],
      customer_eligibility: "all",
      created_at: daysAgo(60),
      updated_at: daysAgo(30)
    },
    {
      id: "coup-3",
      code: "BLACKFRIDAY",
      description: "Black Friday special discount",
      type: "percentage",
      value: 30,
      minimum_amount: 100,
      usage_limit: 2000,
      usage_count: 1456,
      valid_from: daysAgo(100),
      valid_until: daysAgo(95),
      is_active: false,
      applies_to: "all",
      applies_to_ids: [],
      customer_eligibility: "all",
      created_at: daysAgo(100),
      updated_at: daysAgo(95)
    }
  ],

  // Discount Rules
  discountRules: [
    {
      id: "rule-1",
      name: "Buy 2 Get 1 Free",
      type: "quantity",
      description: "When you buy 2 products, get the third one free",
      conditions: {
        min_quantity: 2,
        categories: ["cat-3"]
      },
      discount: {
        type: "percentage",
        value: 33
      },
      is_active: true,
      priority: 1,
      valid_from: daysAgo(30),
      valid_until: daysAgo(-30),
      created_at: daysAgo(30),
      updated_at: daysAgo(20)
    },
    {
      id: "rule-2",
      name: "Free Shipping Over $100",
      type: "cart_total",
      description: "Free shipping for orders over $100",
      conditions: {
        min_amount: 100
      },
      discount: {
        type: "free_shipping"
      },
      is_active: true,
      priority: 2,
      created_at: daysAgo(60),
      updated_at: daysAgo(30)
    }
  ],

  // Shipping Zones
  shippingZones: [
    {
      id: "zone-1",
      name: "Domestic",
      description: "United States shipping",
      countries: ["US"],
      is_active: true,
      methods: [],
      created_at: daysAgo(90),
      updated_at: daysAgo(30)
    },
    {
      id: "zone-2",
      name: "International",
      description: "International shipping",
      countries: ["CA", "MX", "GB", "FR", "DE", "ES", "IT"],
      is_active: true,
      methods: [],
      created_at: daysAgo(90),
      updated_at: daysAgo(30)
    }
  ],

  // Shipping Methods
  shippingMethods: [
    {
      id: "method-1",
      name: "Standard Shipping",
      description: "5-7 business days",
      zone_id: "zone-1",
      type: "flat_rate",
      cost: 5.99,
      estimated_days: { min: 5, max: 7 },
      is_active: true,
      sort_order: 1,
      created_at: daysAgo(90),
      updated_at: daysAgo(30)
    },
    {
      id: "method-2",
      name: "Express Shipping",
      description: "2-3 business days",
      zone_id: "zone-1",
      type: "flat_rate",
      cost: 15.99,
      estimated_days: { min: 2, max: 3 },
      is_active: true,
      sort_order: 2,
      created_at: daysAgo(90),
      updated_at: daysAgo(30)
    },
    {
      id: "method-3",
      name: "Free Shipping",
      description: "Free for orders over $100",
      zone_id: "zone-1",
      type: "free",
      cost: 0,
      min_order_amount: 100,
      estimated_days: { min: 5, max: 7 },
      is_active: true,
      sort_order: 3,
      created_at: daysAgo(90),
      updated_at: daysAgo(30)
    }
  ],

  // Users
  users: [
    {
      id: "user-1",
      email: "admin@store.com",
      name: "Admin",
      lastName: "User",
      phone: "+1 (555) 000-0001",
      role: "admin",
      status: "active",
      avatar: "/placeholder-user.jpg",
      last_login: daysAgo(1),
      permissions: ["all"],
      created_at: daysAgo(365),
      updated_at: daysAgo(1)
    },
    {
      id: "user-2",
      email: "manager@store.com",
      name: "Store",
      lastName: "Manager",
      phone: "+1 (555) 000-0002",
      role: "manager",
      status: "active",
      last_login: daysAgo(2),
      permissions: ["products", "orders", "customers", "inventory"],
      created_at: daysAgo(180),
      updated_at: daysAgo(2)
    },
    {
      id: "user-3",
      email: "staff@store.com",
      name: "Staff",
      lastName: "Member",
      phone: "+1 (555) 000-0003",
      role: "staff",
      status: "active",
      last_login: daysAgo(3),
      permissions: ["products", "orders"],
      created_at: daysAgo(90),
      updated_at: daysAgo(3)
    }
  ],

  // Activity Logs
  activityLogs: [
    {
      id: "log-1",
      user_id: "user-1",
      user_name: "Admin User",
      user_email: "admin@store.com",
      action: "product_created",
      resource_type: "product",
      resource_id: "prod-1",
      resource_name: "iPhone 15 Pro 256GB Black",
      description: "Created new product: iPhone 15 Pro 256GB Black",
      ip_address: "192.168.1.100",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      metadata: {
        previous_values: null,
        new_values: {
          name: "iPhone 15 Pro 256GB Black",
          price: 1199.00,
          status: "active"
        }
      },
      severity: "info",
      created_at: daysAgo(15),
      updated_at: daysAgo(15)
    },
    {
      id: "log-2",
      user_id: "user-1",
      user_name: "Admin User",
      user_email: "admin@store.com",
      action: "order_status_updated",
      resource_type: "order",
      resource_id: "ord-1",
      resource_name: "#ORD-3210",
      description: "Updated order status from 'processing' to 'shipped'",
      ip_address: "192.168.1.100",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      metadata: {
        previous_values: { status: "processing" },
        new_values: { status: "shipped", tracking_number: "1Z999AA1234567890" }
      },
      severity: "info",
      created_at: daysAgo(1),
      updated_at: daysAgo(1)
    },
    {
      id: "log-3",
      user_id: "user-2",
      user_name: "Store Manager",
      user_email: "manager@store.com",
      action: "inventory_adjusted",
      resource_type: "product",
      resource_id: "prod-3",
      resource_name: "AirPods Pro 2nd Gen White",
      description: "Adjusted inventory stock from 150 to 156 units",
      ip_address: "192.168.1.101",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      metadata: {
        previous_values: { stock: 150 },
        new_values: { stock: 156 },
        reason: "Inventory recount"
      },
      severity: "info",
      created_at: daysAgo(2),
      updated_at: daysAgo(2)
    },
    {
      id: "log-4",
      user_id: "system",
      user_name: "System",
      user_email: "system@store.com",
      action: "backup_completed",
      resource_type: "system",
      resource_id: "backup-001",
      resource_name: "Daily Backup",
      description: "Automated database backup completed successfully",
      ip_address: "127.0.0.1",
      user_agent: "System/1.0",
      metadata: {
        backup_size: "2.3 GB",
        duration: "00:05:23",
        status: "success"
      },
      severity: "info",
      created_at: daysAgo(1),
      updated_at: daysAgo(1)
    }
  ],

  isLoading: false,
  isOnline: true,
  syncStatus: 'idle',
  lastUpdated: now
} 