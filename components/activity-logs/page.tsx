"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "../ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
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
import { Calendar } from "../ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Activity,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  Clock
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

// Mock data for activity logs
const activityLogs = [
  {
    id: "1",
    user_id: "admin-1",
    user_name: "Admin User",
    user_email: "admin@store.com",
    action: "product_created",
    resource_type: "product",
    resource_id: "prod-123",
    resource_name: "iPhone 15 Pro",
    description: "Created new product: iPhone 15 Pro 256GB Black",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    metadata: {
      previous_values: null,
      new_values: {
        name: "iPhone 15 Pro 256GB Black",
        price: 999.00,
        status: "active"
      }
    },
    severity: "info",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user_id: "admin-1",
    user_name: "Admin User", 
    user_email: "admin@store.com",
    action: "order_status_updated",
    resource_type: "order",
    resource_id: "ord-456",
    resource_name: "#ORD-3210",
    description: "Updated order status from 'processing' to 'shipped'",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    metadata: {
      previous_values: { status: "processing" },
      new_values: { status: "shipped", tracking_number: "1Z999AA1234567890" }
    },
    severity: "info",
    created_at: "2024-01-15T09:45:00Z",
  },
  {
    id: "3",
    user_id: "staff-1",
    user_name: "Staff Member",
    user_email: "staff@store.com",
    action: "login_failed",
    resource_type: "auth",
    resource_id: null,
    resource_name: null,
    description: "Failed login attempt from IP 203.0.113.42",
    ip_address: "203.0.113.42",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    metadata: {
      reason: "invalid_password",
      attempts_count: 3
    },
    severity: "warning",
    created_at: "2024-01-15T08:20:00Z",
  },
  {
    id: "4",
    user_id: "admin-1",
    user_name: "Admin User",
    user_email: "admin@store.com", 
    action: "user_permissions_updated",
    resource_type: "user",
    resource_id: "user-789",
    resource_name: "staff@store.com",
    description: "Updated user permissions for staff@store.com",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    metadata: {
      previous_values: { role: "staff", permissions: ["read_products"] },
      new_values: { role: "staff", permissions: ["read_products", "write_products"] }
    },
    severity: "high",
    created_at: "2024-01-14T16:15:00Z",
  },
  {
    id: "5",
    user_id: "system",
    user_name: "System",
    user_email: "system@store.com",
    action: "backup_completed",
    resource_type: "system",
    resource_id: "backup-001",
    resource_name: "Daily Backup",
    description: "Automated database backup completed successfully",
    ip_address: "127.0.0.1",
    user_agent: "System/1.0",
    metadata: {
      backup_size: "2.3 GB",
      duration: "00:05:23",
      status: "success"
    },
    severity: "info",
    created_at: "2024-01-15T02:00:00Z",
  },
  {
    id: "6",
    user_id: "admin-1",
    user_name: "Admin User",
    user_email: "admin@store.com",
    action: "customer_data_exported",
    resource_type: "customer",
    resource_id: "export-123",
    resource_name: "Customer Export",
    description: "Exported customer data (2,450 records)",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    metadata: {
      export_format: "csv",
      records_count: 2450,
      file_size: "1.2 MB"
    },
    severity: "medium",
    created_at: "2024-01-14T14:30:00Z",
  },
]

function ActivityLogsTable({ logs, selectedTimeframe }: { logs: any[], selectedTimeframe: string }) {
  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      info: { label: "Info", className: "bg-blue-100 text-blue-800" },
      warning: { label: "Warning", className: "bg-yellow-100 text-yellow-800" },
      medium: { label: "Medium", className: "bg-orange-100 text-orange-800" },
      high: { label: "High", className: "bg-red-100 text-red-800" },
      critical: { label: "Critical", className: "bg-red-600 text-white" },
    }

    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("auth")) {
      return <Shield className="h-4 w-4" />
    }
    if (action.includes("created") || action.includes("added")) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    if (action.includes("deleted") || action.includes("failed")) {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
    if (action.includes("updated") || action.includes("modified")) {
      return <RefreshCw className="h-4 w-4 text-blue-600" />
    }
    return <Activity className="h-4 w-4" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (selectedTimeframe === "today") {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getResourceTypeBadge = (resourceType: string) => {
    const typeConfig = {
      product: { label: "Product", className: "bg-green-100 text-green-800" },
      order: { label: "Order", className: "bg-blue-100 text-blue-800" },
      customer: { label: "Customer", className: "bg-purple-100 text-purple-800" },
      user: { label: "User", className: "bg-orange-100 text-orange-800" },
      auth: { label: "Auth", className: "bg-red-100 text-red-800" },
      system: { label: "System", className: "bg-gray-100 text-gray-800" },
    }

    const config = typeConfig[resourceType as keyof typeof typeConfig] || typeConfig.system
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="group">
              <TableCell className="font-medium">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {log.action}
                      </code>
                      {log.resource_type && getResourceTypeBadge(log.resource_type)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{log.user_name}</p>
                    <p className="text-xs text-muted-foreground">{log.user_email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {log.resource_name ? (
                  <div>
                    <p className="font-medium text-sm">{log.resource_name}</p>
                    {log.resource_id && (
                      <p className="text-xs text-muted-foreground font-mono">{log.resource_id}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{getSeverityBadge(log.severity)}</TableCell>
              <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{formatDate(log.created_at)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function ActivityLogsPage() {
  const { toast } = useToast()
  const [selectedTimeframe, setSelectedTimeframe] = useState("today")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter logs based on current filters
  const filteredLogs = activityLogs.filter(log => {
    if (selectedSeverity !== "all" && log.severity !== selectedSeverity) return false
    if (selectedAction !== "all" && !log.action.includes(selectedAction)) return false
    if (searchQuery && !log.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.resource_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleExportLogs = () => {
    toast({
      title: "Export started",
      description: "Activity logs are being exported to CSV format",
    })
  }

  const handleRefreshLogs = () => {
    toast({
      title: "Logs refreshed",
      description: "Activity logs have been updated with the latest data",
    })
  }

  // Calculate stats
  const totalLogs = filteredLogs.length
  const criticalLogs = filteredLogs.filter(log => log.severity === "critical" || log.severity === "high").length
  const warningLogs = filteredLogs.filter(log => log.severity === "warning").length
  const uniqueUsers = new Set(filteredLogs.map(log => log.user_id)).size
  const failedLogins = filteredLogs.filter(log => log.action.includes("login_failed")).length

  // Get unique actions for filter
  const uniqueActions = [...new Set(activityLogs.map(log => log.action.split('_')[0]))]

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
              <BreadcrumbPage>Activity Logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
            <p className="text-muted-foreground">Monitor system activity and user actions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefreshLogs}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLogs}</div>
              <p className="text-xs text-muted-foreground">In selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical/High</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalLogs}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{warningLogs}</div>
              <p className="text-xs text-muted-foreground">Review recommended</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">Unique users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedLogins}</div>
              <p className="text-xs text-muted-foreground">Security events</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search activities..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTimeframe === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Pick a date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="system">System Events</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  All user and system activities in chronological order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLogsTable logs={filteredLogs} selectedTimeframe={selectedTimeframe} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>
                  Authentication, authorization, and security-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLogsTable 
                  logs={filteredLogs.filter(log => 
                    log.action.includes("login") || 
                    log.action.includes("auth") || 
                    log.action.includes("permission") ||
                    log.severity === "high" ||
                    log.severity === "critical"
                  )} 
                  selectedTimeframe={selectedTimeframe} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Events</CardTitle>
                <CardDescription>
                  Automated system activities, backups, and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLogsTable 
                  logs={filteredLogs.filter(log => 
                    log.user_id === "system" || 
                    log.resource_type === "system" ||
                    log.action.includes("backup") ||
                    log.action.includes("maintenance")
                  )} 
                  selectedTimeframe={selectedTimeframe} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
