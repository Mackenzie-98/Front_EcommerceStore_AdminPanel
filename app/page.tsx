"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DynamicSalesChart, DynamicCustomerSegmentationChart } from "@/components/ui/simple-dynamic-chart"

import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Eye,
  Download,
  Package,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

// Mock data based on API endpoints
const dashboardMetrics = {
  revenue: { value: "$45,231.89", change: "+20.1%", trend: "up" as const },
  orders: { value: "1,234", change: "+15.3%", trend: "up" as const },
  customers: { value: "2,350", change: "+8.2%", trend: "up" as const },
  products: { value: "456", change: "+12.5%", trend: "up" as const },
}

const salesData = [
  { name: "Jan", revenue: 4000, orders: 240, customers: 180 },
  { name: "Feb", revenue: 3000, orders: 198, customers: 150 },
  { name: "Mar", revenue: 5000, orders: 300, customers: 220 },
  { name: "Apr", revenue: 4500, orders: 278, customers: 200 },
  { name: "May", revenue: 6000, orders: 389, customers: 280 },
  { name: "Jun", revenue: 5500, orders: 349, customers: 250 },
]

const topProducts = [
  { name: "iPhone 15 Pro", sales: 1234, revenue: 1234000, stock: 45 },
  { name: "MacBook Air M2", sales: 856, revenue: 856000, stock: 23 },
  { name: "AirPods Pro", sales: 2341, revenue: 585250, stock: 156 },
  { name: "iPad Air", sales: 567, revenue: 340200, stock: 78 },
  { name: "Apple Watch", sales: 789, revenue: 236700, stock: 34 },
]

const customerSegments = [
  { name: "18-25 años", value: 25, color: "#8884d8" },
  { name: "26-35 años", value: 35, color: "#82ca9d" },
  { name: "36-45 años", value: 28, color: "#ffc658" },
  { name: "46+ años", value: 12, color: "#ff7300" },
]

const recentOrders = [
  { id: "#3210", customer: "Ana García", total: "$234.50", status: "Completed", date: "2024-01-15" },
  { id: "#3209", customer: "Carlos López", total: "$156.00", status: "Shipped", date: "2024-01-15" },
  { id: "#3208", customer: "María Rodríguez", total: "$89.99", status: "Processing", date: "2024-01-14" },
  { id: "#3207", customer: "Juan Martín", total: "$445.00", status: "Completed", date: "2024-01-14" },
]

const lowStockItems = [
  { name: "iPhone 15 Pro Max", stock: 3, minimum: 10, sku: "IPH15PM-256" },
  { name: "MacBook Pro M3", stock: 1, minimum: 5, sku: "MBP-M3-512" },
  { name: "AirPods Max", stock: 2, minimum: 8, sku: "APM-SILVER" },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
  customers: {
    label: "Customers",
    color: "hsl(var(--chart-3))",
  },
}

function KPICard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  change: string
  icon: any
  trend: "up" | "down"
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>{change}</span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentOrders() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "Pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <span className="text-sm font-medium">{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LowStockAlert() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
          Low Stock Alert
        </CardTitle>
        <CardDescription>Products need restocking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
              </div>
              <Badge variant="destructive">{item.stock} left</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.open('https://overup.store', '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            View Store
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Revenue"
            value={dashboardMetrics.revenue.value}
            change={dashboardMetrics.revenue.change}
            icon={DollarSign}
            trend={dashboardMetrics.revenue.trend}
          />
          <KPICard
            title="Orders"
            value={dashboardMetrics.orders.value}
            change={dashboardMetrics.orders.change}
            icon={ShoppingCart}
            trend={dashboardMetrics.orders.trend}
          />
          <KPICard
            title="Customers"
            value={dashboardMetrics.customers.value}
            change={dashboardMetrics.customers.change}
            icon={Users}
            trend={dashboardMetrics.customers.trend}
          />
          <KPICard
            title="Products"
            value={dashboardMetrics.products.value}
            change={dashboardMetrics.products.change}
            icon={Package}
            trend={dashboardMetrics.products.trend}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <DynamicSalesChart data={salesData} config={chartConfig} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Distribution</CardTitle>
              <CardDescription>Distribución por grupos de edad</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <DynamicCustomerSegmentationChart data={customerSegments} config={chartConfig} />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.slice(0, 4).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(product.revenue / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-muted-foreground">{product.stock} left</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <RecentOrders />
          <LowStockAlert />
        </div>
      </div>
    </SidebarInset>
  )
}
