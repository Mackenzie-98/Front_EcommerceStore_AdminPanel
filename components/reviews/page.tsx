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
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Star, 
  MessageSquare, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ThumbsUp
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"

// Mock data based on reviews API
const reviews = [
  {
    id: "1",
    rating: 5,
    title: "Excellent product!",
    comment: "This iPhone is amazing. The camera quality is outstanding and the battery life is great.",
    user: {
      id: "u1",
      name: "Ana García",
      email: "ana@example.com",
    },
    product: {
      id: "p1", 
      name: "iPhone 15 Pro 256GB Black",
      sku: "IPH15P-256-BLK",
    },
    is_verified_purchase: true,
    helpful_count: 12,
    images: ["/placeholder.svg?height=100&width=100"],
    status: "approved",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    rating: 3,
    title: "Good but expensive",
    comment: "The laptop works well but I think it's overpriced for what you get.",
    user: {
      id: "u2",
      name: "Carlos López", 
      email: "carlos@example.com",
    },
    product: {
      id: "p2",
      name: "MacBook Air M2 512GB Silver", 
      sku: "MBA-M2-512-SLV",
    },
    is_verified_purchase: true,
    helpful_count: 3,
    images: [],
    status: "approved",
    created_at: "2024-01-14T16:45:00Z",
    updated_at: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    rating: 1,
    title: "Terrible quality",
    comment: "This product is completely useless. Don't waste your money on this garbage.",
    user: {
      id: "u3",
      name: "Anonymous User",
      email: "fake@email.com",
    },
    product: {
      id: "p3",
      name: "AirPods Pro 2nd Gen White",
      sku: "APP-PRO-WHT", 
    },
    is_verified_purchase: false,
    helpful_count: 0,
    images: [],
    status: "pending",
    created_at: "2024-01-13T09:20:00Z", 
    updated_at: "2024-01-13T09:20:00Z",
  },
  {
    id: "4",
    rating: 4,
    title: "Very satisfied",
    comment: "Great tablet for work and entertainment. The screen is beautiful and the performance is smooth.",
    user: {
      id: "u4",
      name: "María Rodríguez",
      email: "maria@example.com",
    },
    product: {
      id: "p4",
      name: "iPad Air 128GB Blue",
      sku: "IPD-AIR-128-BLU",
    },
    is_verified_purchase: true,
    helpful_count: 8,
    images: [],
    status: "approved",
    created_at: "2024-01-12T14:15:00Z",
    updated_at: "2024-01-12T14:15:00Z",
  },
  {
    id: "5",
    rating: 2,
    title: "Issues with connectivity",
    comment: "The watch has connectivity problems and the battery drains too fast.",
    user: {
      id: "u5", 
      name: "Juan Martín",
      email: "juan@example.com",
    },
    product: {
      id: "p5",
      name: "Apple Watch Series 9 45mm Red",
      sku: "AWS-S9-45-RED",
    },
    is_verified_purchase: true,
    helpful_count: 1,
    images: [],
    status: "flagged",
    created_at: "2024-01-11T11:30:00Z",
    updated_at: "2024-01-11T11:30:00Z",
  },
]

function ReviewsTable({ reviews, onStatusChange, onDelete }: { 
  reviews: any[], 
  onStatusChange: (reviewId: string, status: string) => void,
  onDelete: (review: any) => void 
}) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      flagged: { label: "Flagged", className: "bg-red-100 text-red-800" },
      rejected: { label: "Rejected", className: "bg-gray-100 text-gray-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Review</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">
                <div className="max-w-sm">
                  <p className="font-medium text-sm mb-1">{review.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {review.is_verified_purchase && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {review.helpful_count > 0 && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {review.helpful_count}
                      </div>
                    )}
                    {review.images.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {review.images.length} image{review.images.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{review.product.name}</p>
                  <p className="text-xs text-muted-foreground">{review.product.sku}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{review.user.name}</p>
                  <p className="text-xs text-muted-foreground">{review.user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(review.status)}</TableCell>
              <TableCell className="text-sm">{formatDate(review.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    {review.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => onStatusChange(review.id, "approved")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(review.id, "rejected")}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {review.status === "approved" && (
                      <DropdownMenuItem onClick={() => onStatusChange(review.id, "flagged")}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Flag review
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete(review)}
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

export default function ReviewsPage() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<any>(null)

  const handleStatusChange = async (reviewId: string, status: string) => {
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/reviews/${reviewId}/status`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ status }),
      // })

      toast({
        title: "Review updated",
        description: `Review has been ${status}`,
      })
    } catch (error) {
      console.error("Error updating review:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update review status",
      })
    }
  }

  const handleDelete = (review: any) => {
    setReviewToDelete(review)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!reviewToDelete) return

    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/reviews/${reviewToDelete.id}`, {
      //   method: "DELETE",
      // })

      toast({
        title: "Review deleted",
        description: "The review has been permanently deleted",
      })

      setDeleteDialogOpen(false)
      setReviewToDelete(null)
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Could not delete review",
      })
    }
  }

  // Filter reviews based on selected tab
  const filteredReviews = selectedTab === "all" 
    ? reviews 
    : reviews.filter(review => review.status === selectedTab)

  // Calculate stats
  const totalReviews = reviews.length
  const pendingReviews = reviews.filter(r => r.status === "pending").length
  const approvedReviews = reviews.filter(r => r.status === "approved").length
  const flaggedReviews = reviews.filter(r => r.status === "flagged").length
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const verifiedPurchases = reviews.filter(r => r.is_verified_purchase).length

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
              <BreadcrumbPage>Reviews</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <p className="text-muted-foreground">Manage customer reviews and feedback</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{flaggedReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedPurchases}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((verifiedPurchases / totalReviews) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingReviews})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search reviews..." className="pl-8 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More filters
              </Button>
            </div>
          </div>

          <TabsContent value={selectedTab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTab === "all" ? "All Reviews" : 
                   selectedTab === "pending" ? "Pending Reviews" :
                   selectedTab === "approved" ? "Approved Reviews" : "Flagged Reviews"}
                </CardTitle>
                <CardDescription>
                  {selectedTab === "pending" && "Reviews waiting for moderation approval"}
                  {selectedTab === "approved" && "Reviews that are live on the site"}
                  {selectedTab === "flagged" && "Reviews that have been flagged for review"}
                  {selectedTab === "all" && "All customer reviews across all products"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsTable 
                  reviews={filteredReviews}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the review 
              "{reviewToDelete?.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
