"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "../ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
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
import { Calendar as CalendarIcon, Download, FileText, Users, Package, ShoppingCart, DollarSign, Loader2, Eye, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// Mock data for generated reports
const generatedReports = [
  {
    id: "1",
    name: "Sales Report Q1 2024",
    type: "sales",
    format: "xlsx",
    status: "completed",
    created_at: "2024-01-15T10:30:00Z",
    file_size: "2.3 MB",
    download_url: "/exports/sales_20240115_103000.xlsx",
    rows_count: 1250,
  },
  {
    id: "2", 
    name: "Customer Export - January",
    type: "customers",
    format: "csv",
    status: "completed",
    created_at: "2024-01-14T16:45:00Z",
    file_size: "856 KB",
    download_url: "/exports/customers_20240114_164500.csv",
    rows_count: 4280,
  },
  {
    id: "3",
    name: "Inventory Report",
    type: "inventory", 
    format: "pdf",
    status: "processing",
    created_at: "2024-01-14T09:20:00Z",
    file_size: null,
    download_url: null,
    rows_count: null,
  },
  {
    id: "4",
    name: "Product Performance Report",
    type: "products",
    format: "xlsx",
    status: "failed",
    created_at: "2024-01-13T14:15:00Z",
    file_size: null,
    download_url: null,
    rows_count: null,
  },
]

// Report templates
const reportTemplates = [
  {
    id: "sales_summary",
    name: "Sales Summary",
    description: "Overview of sales performance with key metrics",
    icon: DollarSign,
    category: "sales",
    fields: ["revenue", "orders_count", "avg_order_value", "conversion_rate"],
    formats: ["xlsx", "csv", "pdf"],
  },
  {
    id: "sales_detailed",
    name: "Detailed Sales Report", 
    description: "Complete sales data with individual order details",
    icon: ShoppingCart,
    category: "sales",
    fields: ["order_id", "customer", "items", "total", "status", "date"],
    formats: ["xlsx", "csv"],
  },
  {
    id: "customers_list",
    name: "Customer List",
    description: "All customer information and contact details",
    icon: Users,
    category: "customers", 
    fields: ["name", "email", "phone", "total_orders", "total_spent", "last_order"],
    formats: ["xlsx", "csv"],
  },
  {
    id: "customer_analytics",
    name: "Customer Analytics",
    description: "Customer behavior analysis and segmentation data",
    icon: Users,
    category: "customers",
    fields: ["customer_id", "segment", "lifetime_value", "frequency", "recency"],
    formats: ["xlsx", "csv", "pdf"],
  },
  {
    id: "products_performance",
    name: "Product Performance",
    description: "Sales performance metrics by product",
    icon: Package,
    category: "products",
    fields: ["product_name", "sku", "units_sold", "revenue", "profit_margin"],
    formats: ["xlsx", "csv", "pdf"],
  },
  {
    id: "inventory_status",
    name: "Inventory Status",
    description: "Current stock levels and inventory valuation",
    icon: Package,
    category: "inventory",
    fields: ["product_name", "sku", "current_stock", "value", "status"],
    formats: ["xlsx", "csv", "pdf"],
  },
  {
    id: "low_stock",
    name: "Low Stock Alert",
    description: "Products with stock below threshold",
    icon: Package,
    category: "inventory",
    fields: ["product_name", "sku", "current_stock", "threshold", "reorder_point"],
    formats: ["xlsx", "csv"],
  },
  {
    id: "financial_summary",
    name: "Financial Summary",
    description: "Revenue, costs, and profit analysis",
    icon: DollarSign,
    category: "financial",
    fields: ["period", "revenue", "costs", "profit", "margin"],
    formats: ["xlsx", "pdf"],
  },
]

function ReportTemplateCard({ template, onGenerate }: { template: any, onGenerate: (template: any) => void }) {
  const IconComponent = template.icon

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-sm">{template.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline">{template.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Available formats:</p>
            <div className="flex gap-1">
              {template.formats.map((format: string) => (
                <Badge key={format} variant="secondary" className="text-xs">
                  {format.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Includes fields:</p>
            <div className="flex flex-wrap gap-1">
              {template.fields.slice(0, 4).map((field: string) => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field.replace(/_/g, ' ')}
                </Badge>
              ))}
              {template.fields.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{template.fields.length - 4} more
                </Badge>
              )}
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={() => onGenerate(template)}
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportsHistoryTable({ reports, onDownload, onDelete, onRegenerate }: { 
  reports: any[], 
  onDownload: (report: any) => void,
  onDelete: (report: any) => void,
  onRegenerate: (report: any) => void
}) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
      processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
      failed: { label: "Failed", className: "bg-red-100 text-red-800" },
      queued: { label: "Queued", className: "bg-yellow-100 text-yellow-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.queued
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales": return <DollarSign className="h-4 w-4" />
      case "customers": return <Users className="h-4 w-4" />
      case "products": return <Package className="h-4 w-4" />
      case "inventory": return <Package className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(report.type)}
                  <div>
                    <p className="font-medium">{report.name}</p>
                    {report.rows_count && (
                      <p className="text-sm text-muted-foreground">
                        {report.rows_count.toLocaleString()} rows
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{report.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{report.format.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(report.status)}</TableCell>
              <TableCell>{report.file_size || "—"}</TableCell>
              <TableCell className="text-sm">{formatDate(report.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {report.status === "completed" && (
                      <DropdownMenuItem onClick={() => onDownload(report)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                    {report.status === "failed" && (
                      <DropdownMenuItem onClick={() => onRegenerate(report)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete(report)}
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

function ReportGeneratorModal({ template, open, onOpenChange, onGenerate }: {
  template: any,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onGenerate: (config: any) => void
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedFormat, setSelectedFormat] = useState(template?.formats[0] || "xlsx")
  const [selectedFields, setSelectedFields] = useState<string[]>(template?.fields || [])
  const [isGenerating, setIsGenerating] = useState(false)

  if (!template) return null

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    const config = {
      template_id: template.id,
      format: selectedFormat,
      fields: selectedFields,
      date_range: dateRange ? {
        start: dateRange.from,
        end: dateRange.to
      } : null,
    }

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onGenerate(config)
    setIsGenerating(false)
    onOpenChange(false)
  }

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {open && (
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Generate {template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Range Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
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
                      "Select date range"
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
            </div>

            {/* Format Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {template.formats.map((format: string) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()} - {
                        format === "xlsx" ? "Excel Spreadsheet" :
                        format === "csv" ? "Comma Separated Values" :
                        "PDF Document"
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fields Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Include Fields</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {template.fields.map((field: string) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <label 
                      htmlFor={field} 
                      className="text-sm capitalize cursor-pointer"
                    >
                      {field.replace(/_/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFields.length} of {template.fields.length} fields selected
              </p>
            </div>
          </CardContent>
          <div className="flex justify-end gap-2 p-6 pt-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || selectedFields.length === 0}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Generate Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default function ReportsPage() {
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [generatorOpen, setGeneratorOpen] = useState(false)

  const handleGenerateReport = (template: any) => {
    setSelectedTemplate(template)
    setGeneratorOpen(true)
  }

  const handleGenerate = async (config: any) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch("/api/v1/admin/reports/generate", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(config),
      // })

      toast({
        title: "Report generation started",
        description: "Your report is being generated. You'll be notified when it's ready.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not start report generation",
      })
    }
  }

  const handleDownload = (report: any) => {
    // In a real app, this would trigger the download
    window.open(report.download_url, '_blank')
    
    toast({
      title: "Download started",
      description: `Downloading ${report.name}`,
    })
  }

  const handleDelete = async (report: any) => {
    try {
      // In a real app, this would be a fetch to your API
      // await fetch(`/api/v1/admin/reports/${report.id}`, {
      //   method: "DELETE",
      // })

      toast({
        title: "Report deleted",
        description: `${report.name} has been deleted`,
      })
    } catch (error) {
      console.error("Error deleting report:", error)
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Could not delete report",
      })
    }
  }

  const handleRegenerate = (report: any) => {
    // Find the template and open generator
    const template = reportTemplates.find(t => t.category === report.type)
    if (template) {
      handleGenerateReport(template)
    }
  }

  // Group templates by category
  const groupedTemplates = reportTemplates.reduce((acc, template) => {
    const category = template.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(template)
    return acc
  }, {} as Record<string, any[]>)

  const completedReports = generatedReports.filter(r => r.status === "completed").length
  const processingReports = generatedReports.filter(r => r.status === "processing").length
  const totalReports = generatedReports.length

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
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
            <p className="text-muted-foreground">Generate and export business reports</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedReports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{processingReports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportTemplates.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="history">Generated Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold capitalize mb-2">{category} Reports</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                      <ReportTemplateCard
                        key={template.id}
                        template={template}
                        onGenerate={handleGenerateReport}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports History</CardTitle>
                <CardDescription>View and download previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportsHistoryTable
                  reports={generatedReports}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onRegenerate={handleRegenerate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Generator Modal */}
      <ReportGeneratorModal
        template={selectedTemplate}
        open={generatorOpen}
        onOpenChange={setGeneratorOpen}
        onGenerate={handleGenerate}
      />
    </SidebarInset>
  )
}
