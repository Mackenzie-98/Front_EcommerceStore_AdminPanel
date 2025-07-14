"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  Edit, 
  Save, 
  Loader2 
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Validation schema for customer form
const customerFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  phone: z.string().min(6, { message: "El teléfono debe tener al menos 6 caracteres" }),
  address: z.object({
    line1: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
    line2: z.string().optional(),
    city: z.string().min(2, { message: "La ciudad es requerida" }),
    state: z.string().min(2, { message: "La provincia/estado es requerido" }),
    postalCode: z.string().min(3, { message: "El código postal es requerido" }),
    country: z.string().min(2, { message: "El país es requerido" }),
  })
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

// Mock customer orders
const customerOrders = [
  {
    id: "1",
    order_number: "#ORD-3210",
    status: "completed",
    total: 234.5,
    items_count: 2,
    created_at: "2024-01-15T10:30:00Z",
    payment_status: "paid",
  },
  {
    id: "2",
    order_number: "#ORD-3209",
    status: "shipped",
    total: 156.0,
    items_count: 1,
    created_at: "2024-01-10T09:15:00Z",
    payment_status: "paid",
  },
  {
    id: "3",
    order_number: "#ORD-3208",
    status: "processing",
    total: 89.99,
    items_count: 3,
    created_at: "2024-01-05T16:45:00Z",
    payment_status: "paid",
  },
]

// Mock customer timeline
const customerTimeline = [
  {
    id: "1",
    event: "Cliente creado",
    date: "2023-06-15T14:30:00Z",
    description: "Registro completado con éxito",
  },
  {
    id: "2",
    event: "Primer pedido",
    date: "2023-06-20T10:15:00Z",
    description: "Pedido #ORD-3001 por €120.50",
  },
  {
    id: "3",
    event: "Actualización de dirección",
    date: "2023-08-05T16:45:00Z",
    description: "Dirección de envío actualizada",
  },
  {
    id: "4",
    event: "Segmento actualizado",
    date: "2023-12-01T09:30:00Z",
    description: "Promocionado a cliente VIP",
  },
]

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Initialize form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: "",
      name: "",
      lastName: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }
    }
  })

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true)
      try {
        // In a real app, this would be a fetch to your API
        // const response = await fetch(`/api/v1/admin/users/${params.id}`)
        // const data = await response.json()
        
        // For now, we'll use mock data
        const mockCustomer = {
          id: params.id,
          email: "ana@example.com",
          name: "Ana",
          lastName: "García",
          phone: "+34 600 123 456",
          total_orders: 12,
          total_spent: 2340.5,
          avg_order_value: 195.04,
          last_order: "2024-01-15",
          created_at: "2023-06-15",
          status: "active",
          segment: "vip",
          location: "Madrid, España",
          address: {
            line1: "Calle Gran Vía 123",
            line2: "Piso 4B",
            city: "Madrid",
            state: "Madrid",
            postalCode: "28013",
            country: "España",
          }
        }
        
        setCustomer(mockCustomer)
        
        // Set form values
        form.reset({
          email: mockCustomer.email,
          name: mockCustomer.name,
          lastName: mockCustomer.lastName,
          phone: mockCustomer.phone,
          address: {
            line1: mockCustomer.address.line1,
            line2: mockCustomer.address.line2,
            city: mockCustomer.address.city,
            state: mockCustomer.address.state,
            postalCode: mockCustomer.address.postalCode,
            country: mockCustomer.address.country,
          }
        })
      } catch (error) {
        console.error("Error fetching customer:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del cliente",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCustomer()
    }
  }, [params.id, form, toast])

  // Handle form submission
  const onSubmit = async (data: CustomerFormValues) => {
    setSaving(true)
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/users/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: data.email,
      //     name: data.name,
      //     lastName: data.lastName,
      //     phone: data.phone,
      //     addresses: [
      //       {
      //         line1: data.address.line1,
      //         line2: data.address.line2 || "",
      //         city: data.address.city,
      //         state: data.address.state,
      //         postalCode: data.address.postalCode,
      //         country: data.address.country,
      //         isDefault: true
      //       }
      //     ]
      //   }),
      // })
      
      // if (!response.ok) {
      //   throw new Error("Error al actualizar el cliente")
      // }

      // Update local state
      setCustomer({
        ...customer,
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        address: {
          line1: data.address.line1,
          line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          postalCode: data.address.postalCode,
          country: data.address.country,
        }
      })

      // Show success toast
      toast({
        title: "Cliente actualizado",
        description: "La información del cliente ha sido actualizada",
      })

      // Exit edit mode
      setEditing(false)
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la información del cliente",
      })
    } finally {
      setSaving(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    )
  }

  // Get segment badge
  const getSegmentBadge = (segment: string) => {
    const segmentConfig = {
      new: { label: "Nuevo", className: "bg-blue-100 text-blue-800" },
      regular: { label: "Regular", className: "bg-green-100 text-green-800" },
      vip: { label: "VIP", className: "bg-purple-100 text-purple-800" },
    }

    const config = segmentConfig[segment as keyof typeof segmentConfig] || segmentConfig.regular
    return <Badge className={config.className}>{config.label}</Badge>
  }

  // Get order status badge
  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Procesando", className: "bg-blue-100 text-blue-800" },
      shipped: { label: "Enviado", className: "bg-purple-100 text-purple-800" },
      completed: { label: "Completado", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <SidebarInset>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SidebarInset>
    )
  }

  if (!customer) {
    return (
      <SidebarInset>
        <div className="flex h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Cliente no encontrado</h2>
          <p className="text-muted-foreground">El cliente solicitado no existe o ha sido eliminado</p>
          <Button className="mt-4" onClick={() => router.push("/customers")}>
            Volver a Clientes
          </Button>
        </div>
      </SidebarInset>
    )
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
              <BreadcrumbLink href="/customers">Clientes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{customer.name} {customer.lastName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/customers")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{customer.name} {customer.lastName}</h2>
              <p className="text-muted-foreground">
                Cliente desde {formatDate(customer.created_at)} • {getStatusBadge(customer.status)} • {getSegmentBadge(customer.segment)}
              </p>
            </div>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          )}
        </div>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customer.total_orders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{customer.total_spent.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{customer.avg_order_value.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Último Pedido</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDate(customer.last_order)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@ejemplo.com" 
                                {...field} 
                                disabled={!editing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Nombre
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nombre" 
                                {...field} 
                                disabled={!editing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Apellidos
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Apellidos" 
                                {...field} 
                                disabled={!editing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Teléfono
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+34 600 123 456" 
                                {...field} 
                                disabled={!editing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dirección</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address.line1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Dirección
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Calle y número" 
                                {...field} 
                                disabled={!editing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.line2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección (línea 2)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Apartamento, suite, etc." 
                                {...field} 
                                disabled={!editing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ciudad" 
                                  {...field} 
                                  disabled={!editing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provincia/Estado</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Provincia" 
                                  {...field} 
                                  disabled={!editing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address.postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Postal</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Código postal" 
                                  {...field} 
                                  disabled={!editing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>País</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="País" 
                                  {...field} 
                                  disabled={!editing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pedidos</CardTitle>
                <CardDescription>Todos los pedidos realizados por este cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Artículos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell>€{order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.items_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline de Actividad</CardTitle>
                <CardDescription>Historial de actividad del cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {customerTimeline.map((event, index) => (
                    <div key={event.id} className="relative pl-8">
                      {index < customerTimeline.length - 1 && (
                        <div className="absolute left-3 top-6 bottom-0 w-px bg-border" />
                      )}
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{event.event}</h4>
                          <Badge variant="outline" className="text-xs">
                            {new Date(event.date).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
