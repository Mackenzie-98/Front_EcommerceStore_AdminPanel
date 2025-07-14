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

// Mock data based on GET /api/v1/admin/inventory
const inventoryItems = [
  {
    id: "1",
    sku: "IPH15P-256-BLK",
    name: "iPhone 15 Pro 256GB Black",
    current_stock: 45,
    reserved_stock: 5,
    available_stock: 40,
    low_stock_threshold: 10,
    cost: 899.0,
    value: 40455.0,
    last_updated: "2024-01-15T10:30:00Z",
    location: "A1-B2-C3",
  },
  {
    id: "2",
    sku: "MBA-M2-512-SLV",
    name: "MacBook Air M2 512GB Silver",
    current_stock: 23,
    reserved_stock: 2,
    available_stock: 21,
    low_stock_threshold: 5,
    cost: 1199.0,
    value: 27577.0,
    last_updated: "2024-01-14T16:45:00Z",
    location: "A2-B1-C1",
  },
  {
    id: "3",
    sku: "APP-PRO-WHT",
    name: "AirPods Pro 2nd Gen White",
    current_stock: 156,
    reserved_stock: 12,
    available_stock: 144,
    low_stock_threshold: 20,
    cost: 199.0,
    value: 31044.0,
    last_updated: "2024-01-15T09:15:00Z",
    location: "B1-A3-C2",
  },
  {
    id: "4",
    sku: "IPD-AIR-128-BLU",
    name: "iPad Air 128GB Blue",
    current_stock: 8,
    reserved_stock: 3,
    available_stock: 5,
    low_stock_threshold: 15,
    cost: 499.0,
    value: 3992.0,
    last_updated: "2024-01-13T14:20:00Z",
    location: "A1-B3-C1",
  },
  {
    id: "5",
    sku: "AWS-S9-45-RED",
    name: "Apple Watch Series 9 45mm Red",
    current_stock: 3,
    reserved_stock: 1,
    available_stock: 2,
    low_stock_threshold: 10,
    cost: 329.0,
    value: 987.0,
    last_updated: "2024-01-12T11:10:00Z",
    location: "B2-A1-C3",
  },
]

function InventoryTable({ onRefresh }: { onRefresh: () => void }) {
  const { toast } = useToast()
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
          {inventoryItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Updated: {formatDate(item.last_updated)}</p>
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
                    <DropdownMenuItem onClick={() => {
                      toast({
                        title: "Feature not implemented",
                        description: "Please use the Stock Adjustment button at the top of the page",
                      })
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add stock
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      toast({
                        title: "Feature not implemented",
                        description: "Please use the Stock Adjustment button at the top of the page",
                      })
                    }}>
                      <Minus className="mr-2 h-4 w-4" />
                      Reduce stock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      toast({
                        title: "Feature not implemented",
                        description: "This feature will be available soon",
                      })
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
  
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)
  const lowStockItems = inventoryItems.filter((item) => item.current_stock <= item.low_stock_threshold).length
  const outOfStockItems = inventoryItems.filter((item) => item.current_stock === 0).length
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.current_stock, 0)

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
                  <Input placeholder="Search by SKU or name..." className="pl-8" />
                </div>
              </div>
              <Select defaultValue="all">
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
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="A1">Zone A1</SelectItem>
                  <SelectItem value="A2">Zone A2</SelectItem>
                  <SelectItem value="B1">Zone B1</SelectItem>
                  <SelectItem value="B2">Zone B2</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More filters
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

        {/* Inventory table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Control stock for all your products</CardDescription>
          </CardHeader>
              <CardContent>
                <InventoryTable onRefresh={refreshInventory} />
              </CardContent>
        </Card>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal 
        open={stockAdjustmentModalOpen} 
        onOpenChange={setStockAdjustmentModalOpen} 
        onSuccess={refreshInventory}
      />
    </SidebarInset>
  )
}
