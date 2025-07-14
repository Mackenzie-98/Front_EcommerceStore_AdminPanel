"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { UserFormModal } from "@/components/settings/user-form-modal"
import { useToast } from "@/hooks/use-toast"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  CreditCard,
  Truck,
  Shield,
  Users,
  Bell,
  Globe,
  Save,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

// Datos simulados para configuración de la tienda
const storeSettings = {
  name: "Mi Tienda Online",
  description: "La mejor tienda de electrónicos",
  email: "contacto@mitienda.com",
  phone: "+34 900 123 456",
  address: "Calle Principal 123, Madrid, España",
  currency: "EUR",
  timezone: "Europe/Madrid",
  language: "es",
}

// Usuarios del sistema
type SystemUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  status: "active" | "inactive";
  last_login: string;
}

const systemUsers: SystemUser[] = [
  {
    id: "1",
    name: "Admin Principal",
    email: "admin@mitienda.com",
    role: "admin",
    status: "active",
    last_login: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "María González",
    email: "maria@mitienda.com",
    role: "staff",
    status: "active",
    last_login: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    name: "Carlos Ruiz",
    email: "carlos@mitienda.com",
    role: "staff",
    status: "inactive",
    last_login: "2024-01-10T09:20:00Z",
  },
]

function UsersTable({ onEdit, onDelete }: { onEdit: (user: SystemUser) => void, onDelete: (user: SystemUser) => void }) {
  const getRoleBadge = (role: string) => {
    return role === "admin" ? (
      <Badge className="bg-red-100 text-red-800">Admin</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">Staff</Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Último Acceso</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {systemUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell className="text-sm">{formatDate(user.last_login)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(user)}>
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

export default function SettingsPage() {
  // User management state
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  const { toast } = useToast()
  
  // Function to handle user edit
  const handleEditUser = (user: SystemUser) => {
    setSelectedUser(user)
    setIsEditUserModalOpen(true)
  }
  
  // Function to handle user delete
  const handleDeleteUser = (user: SystemUser) => {
    setSelectedUser(user)
    setIsDeleteUserDialogOpen(true)
  }
  
  // Function to confirm user deletion
  const confirmDeleteUser = () => {
    // In a real app, you would make an API call here
    // const response = await fetch(`/api/v1/admin/users/${selectedUser?.id}`, {
    //   method: "DELETE",
    // })
    
    toast({
      title: "Usuario eliminado",
      description: `${selectedUser?.name} ha sido eliminado exitosamente`,
    })
    
    setIsDeleteUserDialogOpen(false)
    setSelectedUser(null)
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
              <BreadcrumbPage>Ajustes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Ajustes</h2>
            <p className="text-muted-foreground">Configura tu tienda y gestiona el sistema</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="shipping">Envíos</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="mr-2 h-5 w-5" />
                  Información de la Tienda
                </CardTitle>
                <CardDescription>Configuración básica de tu tienda online</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Nombre de la tienda</Label>
                    <Input id="store-name" defaultValue={storeSettings.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Email de contacto</Label>
                    <Input id="store-email" type="email" defaultValue={storeSettings.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-description">Descripción</Label>
                  <Textarea id="store-description" defaultValue={storeSettings.description} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Teléfono</Label>
                    <Input id="store-phone" defaultValue={storeSettings.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-currency">Moneda</Label>
                    <Select defaultValue={storeSettings.currency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="GBP">Libra (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-address">Dirección</Label>
                  <Textarea id="store-address" defaultValue={storeSettings.address} />
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Configuración Regional
                </CardTitle>
                <CardDescription>Idioma, zona horaria y formato de fecha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue={storeSettings.language}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select defaultValue={storeSettings.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Métodos de Pago
                </CardTitle>
                <CardDescription>Configura los métodos de pago disponibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Stripe</Label>
                      <p className="text-sm text-muted-foreground">Tarjetas de crédito y débito</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PayPal</Label>
                      <p className="text-sm text-muted-foreground">Pagos con PayPal</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Transferencia Bancaria</Label>
                      <p className="text-sm text-muted-foreground">Pago por transferencia</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Contra Reembolso</Label>
                      <p className="text-sm text-muted-foreground">Pago al recibir el pedido</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Configuración de Stripe</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="stripe-public">Clave Pública</Label>
                      <Input id="stripe-public" placeholder="pk_test_..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe-secret">Clave Secreta</Label>
                      <Input id="stripe-secret" type="password" placeholder="sk_test_..." />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Configuración de Envíos
                </CardTitle>
                <CardDescription>Gestiona las opciones de envío y tarifas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Envío Gratuito</Label>
                      <p className="text-sm text-muted-foreground">Para pedidos superiores a €50</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Envío Express</Label>
                      <p className="text-sm text-muted-foreground">Entrega en 24-48 horas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recogida en Tienda</Label>
                      <p className="text-sm text-muted-foreground">Recoger en punto físico</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Tarifas de Envío</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="standard-shipping">Envío Estándar</Label>
                      <Input id="standard-shipping" defaultValue="5.99" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="express-shipping">Envío Express</Label>
                      <Input id="express-shipping" defaultValue="12.99" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="free-shipping-min">Mínimo Envío Gratis</Label>
                      <Input id="free-shipping-min" defaultValue="50.00" />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>Configura las notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Notificaciones por Email</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Nuevos Pedidos</Label>
                        <p className="text-sm text-muted-foreground">Notificar cuando llegue un nuevo pedido</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Stock Bajo</Label>
                        <p className="text-sm text-muted-foreground">Alertar cuando el stock esté bajo</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Nuevos Clientes</Label>
                        <p className="text-sm text-muted-foreground">Notificar registros de nuevos usuarios</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Configuración SMTP</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">Servidor SMTP</Label>
                      <Input id="smtp-host" placeholder="smtp.gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Puerto</Label>
                      <Input id="smtp-port" placeholder="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-user">Usuario</Label>
                      <Input id="smtp-user" placeholder="tu-email@gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Contraseña</Label>
                      <Input id="smtp-password" type="password" />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>Ajustes de seguridad y privacidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticación de Dos Factores</Label>
                      <p className="text-sm text-muted-foreground">Requerir 2FA para administradores</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Forzar HTTPS</Label>
                      <p className="text-sm text-muted-foreground">Redirigir todo el tráfico a HTTPS</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Registro de Actividad</Label>
                      <p className="text-sm text-muted-foreground">Guardar logs de acciones administrativas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Políticas de Contraseña</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min-password-length">Longitud Mínima</Label>
                      <Input id="min-password-length" defaultValue="8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Expiración (días)</Label>
                      <Input id="password-expiry" defaultValue="90" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Requerir Mayúsculas</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Requerir Números</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Requerir Símbolos Especiales</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Gestión de Usuarios
                  </div>
                  <Button onClick={() => setIsCreateUserModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                  </Button>
                </CardTitle>
                <CardDescription>Administra los usuarios del sistema y sus permisos</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable onEdit={handleEditUser} onDelete={handleDeleteUser} />
                
                {/* User Creation/Edit Modal */}
                <UserFormModal 
                  open={isCreateUserModalOpen} 
                  onOpenChange={setIsCreateUserModalOpen}
                  mode="create"
                  onSuccess={() => {
                    // In a real app, this would refresh the users list
                    // fetchUsers()
                  }}
                />
                
                {/* Edit User Modal */}
                {selectedUser && (
                  <UserFormModal 
                    open={isEditUserModalOpen} 
                    onOpenChange={setIsEditUserModalOpen}
                    mode="edit"
                    user={selectedUser}
                    onSuccess={() => {
                      // In a real app, this would refresh the users list
                      // fetchUsers()
                      setSelectedUser(null)
                    }}
                  />
                )}
                
                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El usuario {selectedUser?.name} será eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={confirmDeleteUser}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles y Permisos</CardTitle>
                <CardDescription>Configuración de roles del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-red-600 mb-2">Administrador</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Acceso completo al sistema</li>
                      <li>• Gestión de usuarios y roles</li>
                      <li>• Configuración del sistema</li>
                      <li>• Acceso a todos los reportes</li>
                      <li>• Gestión de productos y pedidos</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-blue-600 mb-2">Staff</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Gestión de productos</li>
                      <li>• Procesamiento de pedidos</li>
                      <li>• Atención al cliente</li>
                      <li>• Reportes básicos</li>
                      <li>• Sin acceso a configuración</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
