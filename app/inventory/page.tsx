"use client"

import { useState } from "react"
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
  Minus,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Warehouse,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StockAdjustmentModal } from "@/components/inventory/stock-adjustment-modal"
import { useMemoryBank } from "@/lib/memory-bank/context"
import { InventoryItem } from "@/lib/types"

function InventoryTable({ items, onRefresh }: { items: InventoryItem[], onRefresh: () => void }) {
  const { toast } = useToast()
  const memoryBank = useMemoryBank()
  const getStockStatus = (current: number, threshold: number) => {
    if (current === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (current <= threshold) {
      return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Updated: {formatDate(item.updated_at)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{item.sku}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.current_stock}</p>
                  <p className="text-sm text-muted-foreground">Reserved: {item.reserved_stock}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.available_stock}</TableCell>
              <TableCell>{getStockStatus(item.current_stock, item.low_stock_threshold)}</TableCell>
              <TableCell>${item.value.toLocaleString()}</TableCell>
              <TableCell className="font-mono text-sm">{item.location}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={async () => {
                      // TEST SERVICE: Quick stock adjustment via localStorage
                      try {
                        const newStock = item.current_stock + 10
                        await memoryBank.update('inventory', item.id, { 
                          current_stock: newStock,
                          available_stock: newStock - item.reserved_stock,
                          value: newStock * item.cost,
                          updated_at: new Date().toISOString()
                        })
                        toast({
                          title: "Stock updated",
                          description: `Added 10 units to ${item.name}`,
                        })
                        onRefresh()
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to update stock",
                        })
                      }
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add stock (+10)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      // TEST SERVICE: Quick stock reduction via localStorage
                      try {
                        const newStock = Math.max(0, item.current_stock - 5)
                        await memoryBank.update('inventory', item.id, { 
                          current_stock: newStock,
                          available_stock: Math.max(0, newStock - item.reserved_stock),
                          value: newStock * item.cost,
                          updated_at: new Date().toISOString()
                        })
                        toast({
                          title: "Stock updated",
                          description: `Reduced 5 units from ${item.name}`,
                        })
                        onRefresh()
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to update stock",
                        })
                      }
                    }}>
                      <Minus className="mr-2 h-4 w-4" />
                      Reduce stock (-5)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={async () => {
                      // TEST SERVICE: Adjust threshold via localStorage
                      try {
                        const newThreshold = item.low_stock_threshold === 10 ? 20 : 10
                        await memoryBank.update('inventory', item.id, { 
                          low_stock_threshold: newThreshold,
                          updated_at: new Date().toISOString()
                        })
                        toast({
                          title: "Threshold updated",
                          description: `Low stock threshold set to ${newThreshold}`,
                        })
                        onRefresh()
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to update threshold",
                        })
                      }
                    }}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Adjust threshold
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

export default function InventoryPage() {
  const [stockAdjustmentModalOpen, setStockAdjustmentModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  
  // TEST SERVICE: Using Memory Bank for local development
  // In production, this would be API calls to your backend
  const { state: memoryBankState } = useMemoryBank()
  const allInventoryItems = memoryBankState.inventory || []
  
  // Filter inventory items based on search and filters
  const filteredItems = allInventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" ||
                         (selectedStatus === "in_stock" && item.current_stock > item.low_stock_threshold) ||
                         (selectedStatus === "low_stock" && item.current_stock <= item.low_stock_threshold && item.current_stock > 0) ||
                         (selectedStatus === "out_of_stock" && item.current_stock === 0)
    
    const matchesLocation = selectedLocation === "all" ||
                           item.location.includes(selectedLocation)
    
    return matchesSearch && matchesStatus && matchesLocation
  })
  
  const inventoryItems = filteredItems
  
  const totalValue = allInventoryItems.reduce((sum: number, item: InventoryItem) => sum + item.value, 0)
  const lowStockItems = allInventoryItems.filter((item: InventoryItem) => item.current_stock <= item.low_stock_threshold).length
  const outOfStockItems = allInventoryItems.filter((item: InventoryItem) => item.current_stock === 0).length
  const totalItems = allInventoryItems.reduce((sum: number, item: InventoryItem) => sum + item.current_stock, 0)

  // Function to refresh the inventory list
  const refreshInventory = () => {
    // In a real app with SWR, you would use:
    // mutate('/api/v1/admin/inventory')
    
    // For now, we'll just update the refresh key to trigger a re-render
    setRefreshKey(prev => prev + 1)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Inventory</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-muted-foreground">Control stock and manage your warehouse</p>
          </div>
          <Button onClick={() => setStockAdjustmentModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Stock Adjustment
          </Button>
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
                    placeholder="Search by SKU or name..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="A1">Zone A1</SelectItem>
                  <SelectItem value="A2">Zone A2</SelectItem>
                  <SelectItem value="A3">Zone A3</SelectItem>
                  <SelectItem value="B1">Zone B1</SelectItem>
                  <SelectItem value="B2">Zone B2</SelectItem>
                  <SelectItem value="B3">Zone B3</SelectItem>
                  <SelectItem value="C1">Zone C1</SelectItem>
                  <SelectItem value="C2">Zone C2</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setSelectedStatus("all")
                setSelectedLocation("all")
              }}>
                <Filter className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                +5.2% since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across {inventoryItems.length} products</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Need replenishment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline mr-1 h-3 w-3 text-red-500" />
                Urgent attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory table - TEST SERVICE: Real-time filtering with localStorage */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Control stock for all your products. 
              {inventoryItems.length !== allInventoryItems.length && (
                <span className="text-muted-foreground">
                  {" "}Showing {inventoryItems.length} of {allInventoryItems.length} items
                </span>
              )}
            </CardDescription>
          </CardHeader>
              <CardContent>
                {inventoryItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No inventory items found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || selectedStatus !== "all" || selectedLocation !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first inventory item"}
                    </p>
                    <Button onClick={() => setStockAdjustmentModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stock
                    </Button>
                  </div>
                ) : (
                  <InventoryTable items={inventoryItems} onRefresh={refreshInventory} />
                )}
              </CardContent>
        </Card>
      </div>

      {/* Stock Adjustment Modal - TEST SERVICE: localStorage integration */}
      <StockAdjustmentModal 
        open={stockAdjustmentModalOpen} 
        onOpenChange={setStockAdjustmentModalOpen} 
        onSuccess={refreshInventory}
      />
    </SidebarInset>
  )
}
