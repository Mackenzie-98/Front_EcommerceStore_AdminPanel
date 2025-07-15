"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FolderOpen,
  Tags,
  Package,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMemoryBank } from "@/lib/memory-bank/context"
import { Category, Subcategory } from "@/lib/types"
import { CategoryFormModal } from "@/components/categories/category-form-modal"

export default function CategoriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Use memory bank for local development
  const { state: memoryBankState } = useMemoryBank()
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null)

  // Simulate API response structure
  const categoriesList = {
    items: categories,
    loading,
    error,
    refresh: () => {
      setCategories(memoryBankState.categories)
      setSubcategories(memoryBankState.subcategories)
    }
  }

  useEffect(() => {
    if (memoryBankState.categories) {
      setCategories(memoryBankState.categories)
    }
  }, [memoryBankState.categories])

  useEffect(() => {
    if (memoryBankState.subcategories) {
      setSubcategories(memoryBankState.subcategories)
    }
  }, [memoryBankState.subcategories])

  // Handlers
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category)
    setCurrentSubcategory(null)
    setCategoryModalOpen(true)
  }

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory)
    setCurrentCategory(null)
    setCategoryModalOpen(true)
  }

  const handleNewCategory = () => {
    setCurrentCategory(null)
    setCurrentSubcategory(null)
    setCategoryModalOpen(true)
  }

  const handleNewSubcategory = (categoryId?: string) => {
    setCurrentCategory(null)
    setCurrentSubcategory(null)
    setCategoryModalOpen(true)
  }

  const handleFormSuccess = () => {
    categoriesList.refresh()
    setCategoryModalOpen(false)
    setCurrentCategory(null)
    setCurrentSubcategory(null)
  }

  const handleViewCategory = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`)
  }

  const handleDeleteClick = (category: Category) => {
    toast({
      title: "Delete Category",
      description: `Are you sure you want to delete ${category.name}?`,
    })
  }

  const handleDeleteSubcategoryClick = (subcategory: Subcategory) => {
    toast({
      title: "Delete Subcategory",
      description: `Are you sure you want to delete ${subcategory.name}?`,
    })
  }

  // Get subcategories for a category
  const getSubcategories = (categoryId: string) => {
    return subcategories?.filter(sub => sub.category_id === categoryId) || []
  }

  // Get products for a category or subcategory
  const getProductsForCategory = (categoryId?: string, subcategoryId?: string) => {
    if (!memoryBankState.products) return []
    
    if (subcategoryId) {
      return memoryBankState.products.filter(p => p.subcategory_id === subcategoryId)
    }
    return memoryBankState.products.filter(p => p.category_id === categoryId)
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Calculate stats
  const categoryStats = {
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    inactive: categories.filter(c => !c.is_active).length,
    totalProducts: categories.reduce((sum, c) => sum + c.products_count, 0)
  }

  const subcategoryStats = {
    total: subcategories?.length || 0,
    active: subcategories?.filter(s => s.is_active).length || 0,
    inactive: subcategories?.filter(s => !s.is_active).length || 0,
    totalProducts: subcategories?.reduce((sum, s) => sum + s.products_count, 0) || 0
  }

  // Handle sync
  const handleSync = async () => {
    categoriesList.refresh()
    toast({
      title: "Categories synced",
      description: "Categories have been synchronized",
    })
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
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">Manage product categories and subcategories for your clothing store</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync
            </Button>
            <Button onClick={handleNewCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categoryStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Subcategories</p>
                    <p className="text-2xl font-bold">{subcategoryStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold">{categoryStats.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{categoryStats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Categories List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                    Manage your product categories and subcategories
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button onClick={() => handleNewCategory()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg">
                    {/* Category Row */}
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleCategory(category.id)}
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FolderOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{category.slug}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {getSubcategories(category.id).length} subcategories
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {category.products_count} products
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNewSubcategory(category.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Subcategory
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewCategory(category.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(category)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Subcategories */}
                    {expandedCategories.has(category.id) && (
                      <div className="border-t bg-muted/20">
                        <div className="p-4 space-y-2">
                          {getSubcategories(category.id).map((subcategory) => (
                            <div key={subcategory.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-muted-foreground/20 rounded-full"></div>
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Tags className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{subcategory.name}</p>
                                  <p className="text-sm text-muted-foreground">{subcategory.slug}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={subcategory.is_active ? "default" : "secondary"}>
                                  {subcategory.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {subcategory.products_count} products
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditSubcategory(subcategory)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewCategory(subcategory.category_id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Products
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteSubcategoryClick(subcategory)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                          {getSubcategories(category.id).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Tags className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No subcategories yet</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleNewSubcategory(category.id)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Subcategory
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No categories yet</p>
                    <p className="mb-4">Start by creating your first category</p>
                    <Button onClick={() => handleNewCategory()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Category
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal 
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={currentCategory}
        subcategory={currentSubcategory}
        categories={categoriesList.items}
        onSuccess={handleFormSuccess}
      />
    </SidebarInset>
  )
} 