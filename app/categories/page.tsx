"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Filter, 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CategoryFormModal } from "@/components/categories"
import { useMemoryBank } from "@/lib/memory-bank/context"
import { Category } from "@/lib/types"
import { Loading } from "../../components/ui/loading"
import { EmptyState } from "../../components/ui/empty-state"

export default function CategoriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Use memory bank for local development
  const { state: memoryBankState } = useMemoryBank()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  // Simulate API response structure
  const categoriesList = {
    items: categories,
    loading,
    error,
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: categories.length,
      items_per_page: 10
    },
    fetch: () => {
      setLoading(true)
      setTimeout(() => {
        setCategories(memoryBankState.categories)
        setLoading(false)
      }, 100)
    },
    refresh: () => {
      setCategories(memoryBankState.categories)
    },
    goToPage: (page: number) => {},
    filter: (filters: any) => {
      let filtered = memoryBankState.categories
             if (filters.search) {
         filtered = filtered.filter((cat: Category) => 
           cat.name.toLowerCase().includes(filters.search.toLowerCase())
         )
       }
       if (filters.status && filters.status !== "all") {
         filtered = filtered.filter((cat: Category) => 
           cat.is_active === (filters.status === "active")
         )
       }
      setCategories(filtered)
    }
  }
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  // Initial data fetch
  useEffect(() => {
    categoriesList.fetch()
  }, [])

  // Handle search and filter changes
  useEffect(() => {
    const filters: any = {}
    if (searchQuery) filters.search = searchQuery
    if (statusFilter !== "all") filters.status = statusFilter
    
    categoriesList.filter(filters)
  }, [searchQuery, statusFilter])

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category)
    setCategoryModalOpen(true)
  }

  // Handle new category
  const handleNewCategory = () => {
    setCurrentCategory(null)
    setCategoryModalOpen(true)
  }

  // Handle view category
  const handleViewCategory = (categoryId: string) => {
    router.push(`/categories/${categoryId}`)
  }

  // Handle delete category
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  // Confirm delete category
  const confirmDelete = async () => {
    if (!categoryToDelete) return
    
    // Simulate delete operation
    setTimeout(() => {
      categoriesList.refresh()
      toast({
        title: "Category deleted",
        description: `${categoryToDelete.name} has been deleted successfully`,
      })
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }, 100)
  }

  // Handle form submission success
  const handleFormSuccess = () => {
    setCategoryModalOpen(false)
    setCurrentCategory(null)
    categoriesList.refresh()
  }

  // Get parent category name
  const getParentCategoryName = (parentId: string | undefined) => {
    if (!parentId) return "-"
    
    const parent = categoriesList.items.find(c => c.id === parentId)
    return parent ? parent.name : "-"
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
            <p className="text-muted-foreground">Manage product categories and hierarchies</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync
            </Button>
            <Button onClick={handleNewCategory}>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>
        </div>

        {/* Filters */}
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
                    placeholder="Search categories..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage product categories and their hierarchies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesList.loading ? (
              <div className="py-8">
                <Loading size="md" text="Loading categories..." />
              </div>
            ) : categoriesList.error ? (
              <div className="flex justify-center items-center py-8 text-destructive">
                <p>{categoriesList.error.message}</p>
              </div>
            ) : categoriesList.items.length === 0 ? (
              <EmptyState
                icon={FolderOpen}
                title="No categories found"
                description={
                  searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first category to organize your products"
                }
                actionLabel="Create Category"
                onAction={handleNewCategory}
              />
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Parent Category</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoriesList.items.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                                <FolderOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{category.name}</p>
                                <p className="text-sm text-muted-foreground">{category.slug}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getParentCategoryName(category.parent_id)}
                          </TableCell>
                          <TableCell>{category.products_count}</TableCell>
                          <TableCell>
                            {category.is_active ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(category.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewCategory(category.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(category)}
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

                {/* Pagination */}
                {categoriesList.pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {categoriesList.items.length} of {categoriesList.pagination.total_items} categories
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => categoriesList.goToPage(categoriesList.pagination.current_page - 1)}
                        disabled={categoriesList.pagination.current_page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <p className="text-sm">
                        Page {categoriesList.pagination.current_page} of {categoriesList.pagination.total_pages}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => categoriesList.goToPage(categoriesList.pagination.current_page + 1)}
                        disabled={categoriesList.pagination.current_page === categoriesList.pagination.total_pages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal 
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={currentCategory}
        categories={categoriesList.items}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category "{categoryToDelete?.name}" and remove it from the database.
              {categoryToDelete && categoryToDelete.products_count > 0 && (
                <p className="mt-2 text-red-500">
                  Warning: This category contains {categoryToDelete.products_count} products.
                  Deleting it may affect these products.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
} 