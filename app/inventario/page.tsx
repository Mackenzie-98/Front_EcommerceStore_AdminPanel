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

// Datos simulados basados en GET /api/v1/admin/inventory
const inventoryItems = [
  {
    id: "1",
    sku: "IPH15P-256-BLK",
    name: "iPhone 15 Pro 256GB Negro",
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
    name: "MacBook Air M2 512GB Plata",
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
    name: "AirPods Pro 2ª Gen Blanco",
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
    name: "iPad Air 128GB Azul",
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
    name: "Apple Watch Series 9 45mm Rojo",
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

function InventoryTable() {
  const getStockStatus = (current: number, threshold: number) => {
    if (current === 0) {
      return <Badge variant="destructive">Sin Stock</Badge>
    }
    if (current <= threshold) {
      return <Badge className="bg-orange-100 text-orange-800">Stock Bajo</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">En Stock</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
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
            <TableHead>Producto</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock Actual</TableHead>
            <TableHead>Disponible</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
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
                    <p className="text-sm text-muted-foreground">Actualizado: {formatDate(item.last_updated)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{item.sku}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.current_stock}</p>
                  <p className="text-sm text-muted-foreground">Reservado: {item.reserved_stock}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.available_stock}</TableCell>
              <TableCell>{getStockStatus(item.current_stock, item.low_stock_threshold)}</TableCell>
              <TableCell>€{item.value.toLocaleString()}</TableCell>
              <TableCell className="font-mono text-sm">{item.location}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir stock
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Minus className="mr-2 h-4 w-4" />
                      Reducir stock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Ajustar umbral
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
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)
  const lowStockItems = inventoryItems.filter((item) => item.current_stock <= item.low_stock_threshold).length
  const outOfStockItems = inventoryItems.filter((item) => item.current_stock === 0).length
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.current_stock, 0)

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
              <BreadcrumbPage>Inventario</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
            <p className="text-muted-foreground">Controla el stock y gestiona tu almacén</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajuste de Stock
          </Button>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por SKU o nombre..." className="pl-8" />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in_stock">En Stock</SelectItem>
                  <SelectItem value="low_stock">Stock Bajo</SelectItem>
                  <SelectItem value="out_of_stock">Sin Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="A1">Zona A1</SelectItem>
                  <SelectItem value="A2">Zona A2</SelectItem>
                  <SelectItem value="B1">Zona B1</SelectItem>
                  <SelectItem value="B2">Zona B2</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Más filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                +5.2% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Unidades</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">En {inventoryItems.length} productos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Requieren reposición</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline mr-1 h-3 w-3 text-red-500" />
                Atención urgente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de inventario */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Inventario</CardTitle>
            <CardDescription>Controla el stock de todos tus productos</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
