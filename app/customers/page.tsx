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
import { useMemoryBank } from "@/lib/memory-bank/context"
import { Customer } from "@/lib/types"

function CustomersTable({ customers, onRefresh }: { customers: Customer[], onRefresh: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const memoryBank = useMemoryBank()

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
      // TEST SERVICE: Using localStorage via Memory Bank for development
      // In production, this would be a fetch to your API:
      // const response = await fetch(`/api/v1/admin/users/${customerId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     is_active: currentStatus !== "active"
      //   }),
      // })
      
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      await memoryBank.update('customers', customerId, { 
        status: newStatus as "active" | "inactive" | "blocked"
      })

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
              <TableCell className="text-sm">{customer.last_order ? formatDate(customer.last_order) : "N/A"}</TableCell>
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  
  // TEST SERVICE: Using Memory Bank for local development
  // In production, this would be API calls to your backend
  const { state: memoryBankState } = useMemoryBank()
  const allCustomers = memoryBankState.customers || []
  
  // Filter customers based on search and filters
  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    
    const matchesSegment = selectedSegment === "all" || customer.segment === selectedSegment
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus
    
    return matchesSearch && matchesSegment && matchesStatus
  })
  
  const customers = filteredCustomers
  const totalCustomers = allCustomers.length
  const activeCustomers = allCustomers.filter((c) => c.status === "active").length
  const totalRevenue = allCustomers.reduce((sum, c) => sum + c.total_spent, 0)
  const avgOrderValue = allCustomers.reduce((sum, c) => sum + c.avg_order_value, 0) / allCustomers.length || 0
  
  // Calculate customer segments
  const customerSegments = [
    { 
      name: "Nuevos", 
      count: allCustomers.filter(c => c.segment === "new").length,
      percentage: Math.round((allCustomers.filter(c => c.segment === "new").length / totalCustomers) * 100) || 0,
      color: "bg-blue-100 text-blue-800" 
    },
    { 
      name: "Regulares", 
      count: allCustomers.filter(c => c.segment === "regular").length,
      percentage: Math.round((allCustomers.filter(c => c.segment === "regular").length / totalCustomers) * 100) || 0,
      color: "bg-green-100 text-green-800" 
    },
    { 
      name: "VIP", 
      count: allCustomers.filter(c => c.segment === "vip").length,
      percentage: Math.round((allCustomers.filter(c => c.segment === "vip").length / totalCustomers) * 100) || 0,
      color: "bg-purple-100 text-purple-800" 
    },
  ]

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

        {/* Estadísticas rápidas - TEST SERVICE: Real-time calculations with localStorage */}
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
                      <Input 
                        placeholder="Buscar por nombre o email..." 
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
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
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("")
                    setSelectedSegment("all")
                    setSelectedStatus("all")
                  }}>
                    <Filter className="mr-2 h-4 w-4" />
                    Limpiar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                  Gestiona todos los clientes registrados.
                  {customers.length !== allCustomers.length && (
                    <span className="text-muted-foreground">
                      {" "}Mostrando {customers.length} de {allCustomers.length} clientes
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No customers found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || selectedSegment !== "all" || selectedStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first customer"}
                    </p>
                    <Button onClick={() => setCustomerModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                  </div>
                ) : (
                  <CustomersTable customers={customers} onRefresh={refreshCustomers} />
                )}
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

      {/* Customer Form Modal - TEST SERVICE: localStorage integration */}
      <CustomerFormModal 
        open={customerModalOpen} 
        onOpenChange={setCustomerModalOpen} 
        onSuccess={refreshCustomers}
      />
    </SidebarInset>
  )
}
