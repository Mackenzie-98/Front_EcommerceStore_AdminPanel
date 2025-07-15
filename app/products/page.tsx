"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Package, Upload, Download, Loader2, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMemoryBank } from "@/lib/memory-bank/context"
import { Product } from "@/lib/types"

const categories = ["All", "Hombre", "Mujer", "Oversized", "Packs", "Conjuntos", "Esentials"]

function ProductsTable({ products, onRefresh }: { products: Product[], onRefresh: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const memoryBank = useMemoryBank()

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "draft") {
      return <Badge variant="secondary">Draft</Badge>
    }
    if (stock < 10) {
      return <Badge variant="destructive">Low Stock</Badge>
    }
    if (status === "active") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Active
        </Badge>
      )
    }
    return <Badge variant="outline">Inactive</Badge>
  }

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const handleEditProduct = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      // TEST SERVICE: Using localStorage via Memory Bank for development
      // In production, this would be a fetch to your API:
      // const response = await fetch(`/api/v1/admin/products/${productId}`, {
      //   method: "DELETE",
      // })
      
      await memoryBank.delete('products', productId)

      // Show success toast
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente",
      })

      // Refresh the products list
      onRefresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el producto",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.variants.length} variants</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
              <TableCell>{product.sales}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("all")
  
  // TEST SERVICE: Using Memory Bank for local development
  // In production, this would be API calls to your backend
  const { state: memoryBankState } = useMemoryBank()
  const allProducts = memoryBankState.products || []
  
  // Filter products based on search and filters
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || 
                           product.category_name === selectedCategory ||
                           product.subcategory_name === selectedCategory
    
    const matchesStatus = selectedStatus === "all" ||
                         (selectedStatus === "active" && product.status === "active") ||
                         (selectedStatus === "draft" && product.status === "draft") ||
                         (selectedStatus === "low_stock" && product.stock < product.low_stock_threshold)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
  
  const products = filteredProducts

  // Function to refresh the products list
  const refreshProducts = () => {
    // In a real app with SWR, you would use:
    // mutate('/api/v1/admin/products')
    
    // For now, we'll just update the refresh key to trigger a re-render
    setRefreshKey(prev => prev + 1)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona un archivo para importar",
      })
      return
    }

    setIsImporting(true)
    try {
      // TEST SERVICE: In production, this would be a fetch to your API
      // const formData = new FormData()
      // formData.append("file", importFile)
      
      // const response = await fetch("/api/v1/admin/products/import", {
      //   method: "POST",
      //   body: formData,
      // })
      
      // For now, we simulate the import process
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Show success toast
      toast({
        title: "Productos importados",
        description: "Los productos han sido importados exitosamente (simulated)",
      })

      // Close modal and refresh products
      setImportModalOpen(false)
      setImportFile(null)
      refreshProducts()
    } catch (error) {
      console.error("Error importing products:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron importar los productos",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setImportModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={() => {
              // TEST SERVICE: In production, this would export to CSV/Excel
              const dataStr = JSON.stringify(products, null, 2)
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
              const exportFileDefaultName = 'products.json'
              const linkElement = document.createElement('a')
              linkElement.setAttribute('href', dataUri)
              linkElement.setAttribute('download', exportFileDefaultName)
              linkElement.click()
              toast({
                title: "Products exported",
                description: "Products have been exported as JSON (test format)",
              })
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => router.push("/products/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          </div>
        </div>

        {/* Filters and search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSelectedStatus("all")
              }}>
                <Filter className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats - TEST SERVICE: Real-time calculations with localStorage */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProducts.length}</div>
              <p className="text-xs text-muted-foreground">
                {products.length !== allProducts.length ? 
                  `${products.length} filtered` : 
                  `${allProducts.length} total`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProducts.filter((p) => p.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((allProducts.filter((p) => p.status === "active").length / allProducts.length) * 100)}% of catalog
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProducts.filter((p) => p.stock < p.low_stock_threshold).length}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${allProducts.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>
        </div>

        {/* Products table - TEST SERVICE: Real-time filtering with localStorage */}
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              Manage all your products from here. 
              {products.length !== allProducts.length && (
                <span className="text-muted-foreground">
                  {" "}Showing {products.length} of {allProducts.length} products
                </span>
              )}
            </CardDescription>
          </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No products found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || selectedCategory !== "All" || selectedStatus !== "all" 
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first product"}
                    </p>
                    <Button onClick={() => router.push("/products/new")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                ) : (
                  <ProductsTable products={products} onRefresh={refreshProducts} />
                )}
              </CardContent>
        </Card>
      </div>

      {/* Import Modal */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Products</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import products in bulk
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {importFile ? importFile.name : "Drag and drop or click to select a file"}
                </p>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">File format requirements:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>CSV or Excel file with headers</li>
                <li>Required columns: name, sku, price, stock</li>
                <li>Optional columns: description, category, cost, low_stock_threshold</li>
                <li>Maximum 1000 products per import</li>
              </ul>
              <a href="#" className="text-primary hover:underline block mt-2">
                Download template
              </a>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importFile || isImporting}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}
