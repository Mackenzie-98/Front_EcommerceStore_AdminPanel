"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "../ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Truck, 
  Clock, 
  DollarSign, 
  MapPin,
  Package,
  Globe,
  Settings,
  Eye,
  Copy
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { ShippingMethodModal } from "./shipping-method-modal"
import { ShippingZoneModal } from "./shipping-zone-modal"

// Mock data for shipping methods
const shippingMethods = [
  {
    id: "1",
    name: "Standard Shipping",
    description: "5-7 business days delivery",
    type: "flat_rate",
    cost: 5.99,
    min_order_value: 0,
    max_order_value: null,
    estimated_days_min: 5,
    estimated_days_max: 7,
    is_active: true,
    zones: ["domestic", "international"],
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Express Shipping", 
    description: "2-3 business days delivery",
    type: "flat_rate",
    cost: 15.99,
    min_order_value: 0,
    max_order_value: null,
    estimated_days_min: 2,
    estimated_days_max: 3,
    is_active: true,
    zones: ["domestic"],
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "3",
    name: "Free Shipping",
    description: "Free shipping on orders over $50",
    type: "free_shipping",
    cost: 0,
    min_order_value: 50,
    max_order_value: null,
    estimated_days_min: 5,
    estimated_days_max: 7,
    is_active: true,
    zones: ["domestic"],
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "4",
    name: "Next Day Delivery",
    description: "Overnight delivery service",
    type: "flat_rate",
    cost: 29.99,
    min_order_value: 100,
    max_order_value: null,
    estimated_days_min: 1,
    estimated_days_max: 1,
    is_active: true,
    zones: ["domestic"],
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "5",
    name: "International Standard",
    description: "International shipping 10-15 business days",
    type: "weight_based",
    cost: 25.00,
    min_order_value: 0,
    max_order_value: null,
    estimated_days_min: 10,
    estimated_days_max: 15,
    is_active: false,
    zones: ["international"],
    created_at: "2024-01-15T10:30:00Z",
  },
]

// Mock data for shipping zones
const shippingZones = [
  {
    id: "domestic",
    name: "Domestic",
    description: "Shipping within the country",
    countries: ["US"],
    is_active: true,
    methods_count: 4,
  },
  {
    id: "international",
    name: "International", 
    description: "Shipping to other countries",
    countries: ["CA", "MX", "GB", "FR", "DE"],
    is_active: true,
    methods_count: 2,
  },
  {
    id: "europe",
    name: "Europe",
    description: "European Union countries",
    countries: ["FR", "DE", "IT", "ES", "NL"],
    is_active: false,
    methods_count: 0,
  },
]

function ShippingMethodsTable({ methods, onEdit, onDelete, onToggleStatus, onDuplicate }: {
  methods: any[],
  onEdit: (method: any) => void,
  onDelete: (method: any) => void,
  onToggleStatus: (method: any) => void,
  onDuplicate: (method: any) => void
}) {
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      flat_rate: { label: "Flat Rate", className: "bg-blue-100 text-blue-800" },
      free_shipping: { label: "Free", className: "bg-green-100 text-green-800" },
      weight_based: { label: "Weight Based", className: "bg-purple-100 text-purple-800" },
      calculated: { label: "Calculated", className: "bg-orange-100 text-orange-800" },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.flat_rate
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`
  }

  const formatDeliveryTime = (minDays: number, maxDays: number) => {
    if (minDays === maxDays) {
      return `${minDays} day${minDays > 1 ? 's' : ''}`
    }
    return `${minDays}-${maxDays} days`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Method</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Zones</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {methods.map((method) => (
            <TableRow key={method.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(method.type)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{formatPrice(method.cost)}</p>
                  {method.min_order_value > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Min order: ${method.min_order_value}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDeliveryTime(method.estimated_days_min, method.estimated_days_max)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {method.zones.slice(0, 2).map((zone: string) => (
                    <Badge key={zone} variant="outline" className="text-xs">
                      {zone}
                    </Badge>
                  ))}
                  {method.zones.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{method.zones.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(method.is_active)}</TableCell>
              <TableCell className="text-sm">{formatDate(method.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(method)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(method)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(method)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {method.is_active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete(method)}
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
  )
}

function ShippingZonesTable({ zones, onEdit, onDelete, onToggleStatus }: {
  zones: any[],
  onEdit: (zone: any) => void,
  onDelete: (zone: any) => void,
  onToggleStatus: (zone: any) => void
}) {
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Zone</TableHead>
            <TableHead>Countries</TableHead>
            <TableHead>Methods</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-muted-foreground">{zone.description}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {zone.countries.slice(0, 3).map((country: string) => (
                    <Badge key={country} variant="outline" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                  {zone.countries.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{zone.countries.length - 3} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{zone.methods_count} methods</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(zone.is_active)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(zone)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(zone)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {zone.is_active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete(zone)}
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
  )
}

export default function ShippingPage() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("methods")
  const [methodModalOpen, setMethodModalOpen] = useState(false)
  const [zoneModalOpen, setZoneModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState(null)
  const [editingZone, setEditingZone] = useState(null)

  const handleEditMethod = (method: any) => {
    setEditingMethod(method)
    setMethodModalOpen(true)
  }

  const handleDeleteMethod = async (method: any) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/shipping/methods/${method.id}`, {
      //   method: "DELETE",
      // })

      toast({
        title: "Shipping method deleted",
        description: `${method.name} has been deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting shipping method:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete shipping method",
      })
    }
  }

  const handleToggleMethodStatus = async (method: any) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/shipping/methods/${method.id}`, {
      //   method: "PUT",
      //   body: JSON.stringify({ is_active: !method.is_active }),
      // })

      toast({
        title: "Shipping method updated",
        description: `${method.name} has been ${method.is_active ? 'deactivated' : 'activated'}`,
      })
    } catch (error) {
      console.error("Error updating shipping method:", error)
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Could not update shipping method",
      })
    }
  }

  const handleDuplicateMethod = (method: any) => {
    const duplicatedMethod = {
      ...method,
      id: undefined,
      name: method.name + " (Copy)",
    }
    setEditingMethod(duplicatedMethod)
    setMethodModalOpen(true)
  }

  const handleEditZone = (zone: any) => {
    setEditingZone(zone)
    setZoneModalOpen(true)
  }

  const handleDeleteZone = async (zone: any) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/shipping/zones/${zone.id}`, {
      //   method: "DELETE",
      // })

      toast({
        title: "Shipping zone deleted",
        description: `${zone.name} has been deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting shipping zone:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete shipping zone",
      })
    }
  }

  const handleToggleZoneStatus = async (zone: any) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/shipping/zones/${zone.id}`, {
      //   method: "PUT",
      //   body: JSON.stringify({ is_active: !zone.is_active }),
      // })

      toast({
        title: "Shipping zone updated",
        description: `${zone.name} has been ${zone.is_active ? 'deactivated' : 'activated'}`,
      })
    } catch (error) {
      console.error("Error updating shipping zone:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update shipping zone",
      })
    }
  }

  const handleModalClose = () => {
    setMethodModalOpen(false)
    setZoneModalOpen(false)
    setEditingMethod(null)
    setEditingZone(null)
  }

  const totalMethods = shippingMethods.length
  const activeMethods = shippingMethods.filter(m => m.is_active).length
  const totalZones = shippingZones.length
  const activeZones = shippingZones.filter(z => z.is_active).length
  const averageCost = shippingMethods.reduce((sum, m) => sum + m.cost, 0) / shippingMethods.length

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
              <BreadcrumbPage>Shipping</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shipping Management</h2>
            <p className="text-muted-foreground">Configure shipping methods and zones</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipping Methods</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMethods}</div>
              <p className="text-xs text-muted-foreground">{activeMethods} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipping Zones</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalZones}</div>
              <p className="text-xs text-muted-foreground">{activeZones} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per shipment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Shipping</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shippingMethods.filter(m => m.type === 'free_shipping').length}
              </div>
              <p className="text-xs text-muted-foreground">Methods available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(shippingZones.flatMap(z => z.countries)).size}
              </div>
              <p className="text-xs text-muted-foreground">Supported countries</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
              <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              {selectedTab === "methods" && (
                <Button onClick={() => setMethodModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Method
                </Button>
              )}
              {selectedTab === "zones" && (
                <Button onClick={() => setZoneModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Zone
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="methods" className="space-y-4">
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
                      <Input placeholder="Search shipping methods..." className="pl-8" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="flat_rate">Flat Rate</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      <SelectItem value="weight_based">Weight Based</SelectItem>
                      <SelectItem value="calculated">Calculated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    More filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Methods</CardTitle>
                <CardDescription>Configure how customers can receive their orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ShippingMethodsTable
                  methods={shippingMethods}
                  onEdit={handleEditMethod}
                  onDelete={handleDeleteMethod}
                  onToggleStatus={handleToggleMethodStatus}
                  onDuplicate={handleDuplicateMethod}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Zones</CardTitle>
                <CardDescription>Define geographical areas for different shipping options</CardDescription>
              </CardHeader>
              <CardContent>
                <ShippingZonesTable
                  zones={shippingZones}
                  onEdit={handleEditZone}
                  onDelete={handleDeleteZone}
                  onToggleStatus={handleToggleZoneStatus}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic shipping configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Default Shipping Origin</label>
                    <Input placeholder="123 Main St, City, State 12345" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Weight Unit</label>
                    <Select defaultValue="kg">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="oz">Ounces (oz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Dimension Unit</label>
                    <Select defaultValue="cm">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="m">Meters (m)</SelectItem>
                        <SelectItem value="ft">Feet (ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carrier Integration</CardTitle>
                  <CardDescription>Connect with shipping carriers for real-time rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">FedEx</p>
                      <p className="text-sm text-muted-foreground">Real-time shipping rates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">UPS</p>
                      <p className="text-sm text-muted-foreground">Real-time shipping rates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">USPS</p>
                      <p className="text-sm text-muted-foreground">Real-time shipping rates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Shipping Method Modal */}
      <ShippingMethodModal 
        open={methodModalOpen} 
        onOpenChange={handleModalClose}
        method={editingMethod}
        zones={shippingZones}
        onSuccess={() => {
          // In a real app, this would refresh the methods list
          handleModalClose()
        }}
      />

      {/* Shipping Zone Modal */}
      <ShippingZoneModal 
        open={zoneModalOpen} 
        onOpenChange={handleModalClose}
        zone={editingZone}
        onSuccess={() => {
          // In a real app, this would refresh the zones list
          handleModalClose()
        }}
      />
    </SidebarInset>
  )
}
