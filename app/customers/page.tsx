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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Edit,
  Mail,
  Ban,
  Users,
  UserCheck,
  Crown,
  TrendingUp,
  Eye,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CustomerFormModal } from "@/components/customers/customer-form-modal"

// Datos simulados basados en GET /api/v1/admin/users
const customers = [
  {
    id: "1",
    name: "Ana García",
    email: "ana@example.com",
    phone: "+34 600 123 456",
    total_orders: 12,
    total_spent: 2340.5,
    avg_order_value: 195.04,
    last_order: "2024-01-15",
    created_at: "2023-06-15",
    status: "active",
    segment: "vip",
    location: "Madrid, España",
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos@example.com",
    phone: "+34 600 234 567",
    total_orders: 5,
    total_spent: 890.0,
    avg_order_value: 178.0,
    last_order: "2024-01-10",
    created_at: "2023-11-20",
    status: "active",
    segment: "regular",
    location: "Barcelona, España",
  },
  {
    id: "3",
    name: "María Rodríguez",
    email: "maria@example.com",
    phone: "+34 600 345 678",
    total_orders: 2,
    total_spent: 156.99,
    avg_order_value: 78.5,
    last_order: "2024-01-08",
    created_at: "2024-01-01",
    status: "active",
    segment: "new",
    location: "Valencia, España",
  },
  {
    id: "4",
    name: "Juan Martín",
    email: "juan@example.com",
    phone: "+34 600 456 789",
    total_orders: 8,
    total_spent: 1567.8,
    avg_order_value: 195.98,
    last_order: "2023-12-20",
    created_at: "2023-08-10",
    status: "inactive",
    segment: "regular",
    location: "Sevilla, España",
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura@example.com",
    phone: "+34 600 567 890",
    total_orders: 15,
    total_spent: 3456.2,
    avg_order_value: 230.41,
    last_order: "2024-01-12",
    created_at: "2023-03-22",
    status: "active",
    segment: "vip",
    location: "Bilbao, España",
  },
]

const customerSegments = [
  { name: "Nuevos", count: 1, percentage: 20, color: "bg-blue-100 text-blue-800" },
  { name: "Regulares", count: 2, percentage: 40, color: "bg-green-100 text-green-800" },
  { name: "VIP", count: 2, percentage: 40, color: "bg-purple-100 text-purple-800" },
]

function CustomersTable({ onRefresh }: { onRefresh: () => void }) {
  const router = useRouter()
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    )
  }

  const getSegmentBadge = (segment: string) => {
    const segmentConfig = {
      new: { label: "Nuevo", className: "bg-blue-100 text-blue-800" },
      regular: { label: "Regular", className: "bg-green-100 text-green-800" },
      vip: { label: "VIP", className: "bg-purple-100 text-purple-800" },
    }

    const config = segmentConfig[segment as keyof typeof segmentConfig] || segmentConfig.regular
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  const handleViewProfile = (customerId: string) => {
    router.push(`/customers/${customerId}`)
  }

  const handleToggleStatus = async (customerId: string, currentStatus: string) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/users/${customerId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     is_active: currentStatus !== "active"
      //   }),
      // })
      
      // if (!response.ok) {
      //   throw new Error("Error al actualizar el estado del cliente")
      // }

      // Show success toast
      toast({
        title: currentStatus === "active" ? "Cliente suspendido" : "Cliente activado",
        description: currentStatus === "active" 
          ? "El cliente ha sido suspendido exitosamente" 
          : "El cliente ha sido activado exitosamente",
      })

      // Refresh the customers list
      onRefresh()
    } catch (error) {
      console.error("Error toggling customer status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del cliente",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Pedidos</TableHead>
            <TableHead>Total Gastado</TableHead>
            <TableHead>Último Pedido</TableHead>
            <TableHead>Segmento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.location}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">{customer.email}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.total_orders}</p>
                  <p className="text-sm text-muted-foreground">€{customer.avg_order_value.toFixed(2)} promedio</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">€{customer.total_spent.toFixed(2)}</TableCell>
              <TableCell className="text-sm">{formatDate(customer.last_order)}</TableCell>
              <TableCell>{getSegmentBadge(customer.segment)}</TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewProfile(customer.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewProfile(customer.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {customer.status === "active" ? (
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleToggleStatus(customer.id, customer.status)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspender
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        className="text-green-600"
                        onClick={() => handleToggleStatus(customer.id, customer.status)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activar
                      </DropdownMenuItem>
                    )}
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

export default function CustomersPage() {
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // In a real app, this would be fetched from the API using SWR or React Query
  // For now, we'll use the mock data
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0)
  const avgOrderValue = customers.reduce((sum, c) => sum + c.avg_order_value, 0) / customers.length

  // Function to refresh the customers list
  const refreshCustomers = () => {
    // In a real app with SWR, you would use:
    // mutate('/api/v1/admin/users')
    
    // For now, we'll just update the refresh key to trigger a re-render
    setRefreshKey(prev => prev + 1)
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
              <BreadcrumbPage>Clientes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground">Gestiona tu base de clientes y analiza su comportamiento</p>
          </div>
          <Button onClick={() => setCustomerModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">{activeCustomers} activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">De todos los clientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Por pedido</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.filter((c) => c.segment === "vip").length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((customers.filter((c) => c.segment === "vip").length / totalCustomers) * 100)}% del total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="customers">Lista de Clientes</TabsTrigger>
            <TabsTrigger value="segments">Segmentación</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-4">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar por nombre o email..." className="pl-8" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="new">Nuevos</SelectItem>
                      <SelectItem value="regular">Regulares</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
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
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>Gestiona todos los clientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomersTable onRefresh={refreshCustomers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {customerSegments.map((segment) => (
                <Card key={segment.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Clientes {segment.name}</span>
                      <Badge className={segment.color}>{segment.count}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{segment.percentage}%</div>
                    <p className="text-sm text-muted-foreground">del total de clientes</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${segment.percentage}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Segmentación</CardTitle>
                <CardDescription>Criterios para la clasificación automática de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-blue-600">Clientes Nuevos</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        • Registrados hace menos de 30 días
                        <br />• Menos de 3 pedidos realizados
                        <br />• Gasto total menor a €200
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-green-600">Clientes Regulares</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        • Entre 3-10 pedidos realizados
                        <br />• Gasto total entre €200-€2000
                        <br />• Compra al menos cada 3 meses
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-purple-600">Clientes VIP</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        • Más de 10 pedidos realizados
                        <br />• Gasto total superior a €2000
                        <br />• Valor promedio por pedido alto
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal 
        open={customerModalOpen} 
        onOpenChange={setCustomerModalOpen} 
        onSuccess={refreshCustomers}
      />
    </SidebarInset>
  )
}
