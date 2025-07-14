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
import { CouponFormModal } from "@/components/discounts/coupon-form-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MoreHorizontal, Plus, Edit, Trash2, Copy, Percent, Tag, Calendar, Users } from "lucide-react"

// Datos simulados basados en GET /api/v1/admin/coupons
const coupons = [
  {
    id: "1",
    code: "WELCOME20",
    description: "Descuento de bienvenida para nuevos clientes",
    type: "percentage",
    value: 20,
    minimum_amount: 50,
    usage_limit: 1000,
    usage_count: 234,
    valid_from: "2024-01-01",
    valid_until: "2024-12-31",
    is_active: true,
  },
  {
    id: "2",
    code: "SUMMER50",
    description: "Descuento fijo de verano",
    type: "fixed",
    value: 50,
    minimum_amount: 200,
    usage_limit: 500,
    usage_count: 89,
    valid_from: "2024-06-01",
    valid_until: "2024-08-31",
    is_active: true,
  },
  {
    id: "3",
    code: "BLACKFRIDAY",
    description: "Descuento especial Black Friday",
    type: "percentage",
    value: 30,
    minimum_amount: 100,
    usage_limit: 2000,
    usage_count: 1456,
    valid_from: "2024-11-25",
    valid_until: "2024-11-30",
    is_active: false,
  },
]

const discountRules = [
  {
    id: "1",
    name: "Compra 2 lleva 3",
    type: "quantity",
    description: "Al comprar 2 productos, el tercero es gratis",
    conditions: { min_quantity: 2, categories: ["electronics"] },
    discount: { type: "percentage", value: 33 },
    is_active: true,
    priority: 1,
  },
  {
    id: "2",
    name: "Envío gratis +€100",
    type: "cart_total",
    description: "Envío gratuito para pedidos superiores a €100",
    conditions: { min_amount: 100 },
    discount: { type: "free_shipping" },
    is_active: true,
    priority: 2,
  },
]

function CouponsTable() {
  const getStatusBadge = (isActive: boolean, validUntil: string) => {
    const isExpired = new Date(validUntil) < new Date()

    if (isExpired) {
      return <Badge variant="secondary">Expirado</Badge>
    }
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>
    }
    return <Badge variant="outline">Inactivo</Badge>
  }

  const getDiscountDisplay = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `€${value}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Uso</TableHead>
            <TableHead>Validez</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{coupon.description}</p>
                  <p className="text-sm text-muted-foreground">Mínimo: €{coupon.minimum_amount}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{getDiscountDisplay(coupon.type, coupon.value)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {coupon.usage_count}/{coupon.usage_limit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((coupon.usage_count / coupon.usage_limit) * 100)}% usado
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <div>
                  <p>{formatDate(coupon.valid_from)}</p>
                  <p className="text-muted-foreground">hasta {formatDate(coupon.valid_until)}</p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(coupon.is_active, coupon.valid_until)}</TableCell>
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
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar código
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
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

function DiscountRulesTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discountRules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{rule.type}</Badge>
              </TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>
                {rule.is_active ? (
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                ) : (
                  <Badge variant="outline">Inactivo</Badge>
                )}
              </TableCell>
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
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
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

export default function DiscountPage() {
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false)
  
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter((c) => c.is_active).length
  const totalUsage = coupons.reduce((sum, c) => sum + c.usage_count, 0)
  const totalSavings = coupons.reduce((sum, c) => {
    const savings =
      c.type === "percentage"
        ? (c.usage_count * 50 * c.value) / 100 // Estimación
        : c.usage_count * c.value
    return sum + savings
  }, 0)

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
              <BreadcrumbPage>Descuentos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Descuentos</h2>
            <p className="text-muted-foreground">Gestiona cupones y reglas de descuento</p>
          </div>
          <Button onClick={() => setIsCouponFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Descuento
          </Button>
          <CouponFormModal 
            open={isCouponFormOpen} 
            onOpenChange={setIsCouponFormOpen}
            onSuccess={() => {
              // In a real app, this would refresh the coupons list
              // fetchCoupons()
            }}
          />
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cupones</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoupons}</div>
              <p className="text-xs text-muted-foreground">{activeCoupons} activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usos Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ahorro Clientes</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalSavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total ahorrado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">Con descuentos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="coupons" className="space-y-4">
          <TabsList>
            <TabsTrigger value="coupons">Cupones</TabsTrigger>
            <TabsTrigger value="rules">Reglas Automáticas</TabsTrigger>
          </TabsList>

          <TabsContent value="coupons" className="space-y-4">
            {/* Filtros para cupones */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar cupones..." className="pl-8" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                      <SelectItem value="expired">Expirados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Cantidad fija</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Más filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Cupones</CardTitle>
                <CardDescription>Gestiona todos los cupones de descuento</CardDescription>
              </CardHeader>
              <CardContent>
                <CouponsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reglas de Descuento Automático</CardTitle>
                <CardDescription>Descuentos que se aplican automáticamente según condiciones</CardDescription>
              </CardHeader>
              <CardContent>
                <DiscountRulesTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
