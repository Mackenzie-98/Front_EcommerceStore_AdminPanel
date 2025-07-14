"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2, Search, Package, Plus, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Validation schema for stock adjustment form
const stockAdjustmentSchema = z.object({
  sku: z.string().min(1, { message: "El SKU es requerido" }),
  quantity: z.coerce.number().int().min(1, { message: "La cantidad debe ser al menos 1" }),
  type: z.enum(["add", "remove"]),
  reason: z.enum(["reception", "damage", "correction", "sale", "return", "other"]),
  notes: z.string().optional(),
})

type StockAdjustmentValues = z.infer<typeof stockAdjustmentSchema>

// Mock product search results
const mockProducts = [
  { sku: "IPH15P-256-BLK", name: "iPhone 15 Pro 256GB Black", stock: 45 },
  { sku: "MBA-M2-512-SLV", name: "MacBook Air M2 512GB Silver", stock: 23 },
  { sku: "APP-PRO-WHT", name: "AirPods Pro 2nd Gen White", stock: 156 },
  { sku: "IPD-AIR-128-BLU", name: "iPad Air 128GB Blue", stock: 78 },
  { sku: "AWS-S9-45-RED", name: "Apple Watch Series 9 45mm Red", stock: 34 },
]

interface StockAdjustmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StockAdjustmentModal({ open, onOpenChange, onSuccess }: StockAdjustmentModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockProducts>([])
  const [selectedProduct, setSelectedProduct] = useState<(typeof mockProducts)[0] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Initialize form with default values
  const form = useForm<StockAdjustmentValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      sku: "",
      quantity: 1,
      type: "add",
      reason: "reception",
      notes: "",
    }
  })

  // Search for products by SKU or name
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/products/search?q=${encodeURIComponent(query)}`)
      // const data = await response.json()
      // setSearchResults(data)

      // For now, we'll use mock data
      const filteredProducts = mockProducts.filter(
        product => 
          product.sku.toLowerCase().includes(query.toLowerCase()) || 
          product.name.toLowerCase().includes(query.toLowerCase())
      )
      
      // Simulate API delay
      setTimeout(() => {
        setSearchResults(filteredProducts)
        setIsSearching(false)
      }, 500)
    } catch (error) {
      console.error("Error searching products:", error)
      setSearchResults([])
      setIsSearching(false)
    }
  }

  // Handle product selection
  const handleSelectProduct = (product: (typeof mockProducts)[0]) => {
    setSelectedProduct(product)
    form.setValue("sku", product.sku)
    setSearchResults([])
    setSearchQuery("")
  }

  // Handle form submission
  const onSubmit = (data: StockAdjustmentValues) => {
    // Show confirmation before submitting
    setShowConfirmation(true)
  }

  // Handle final confirmation and submission
  const handleConfirmAdjustment = async () => {
    const data = form.getValues()
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch("/api/v1/admin/inventory/adjust", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     sku: data.sku,
      //     delta: data.type === "add" ? data.quantity : -data.quantity,
      //     reason: data.reason,
      //     notes: data.notes,
      //   }),
      // })

      // if (!response.ok) {
      //   throw new Error("Error al ajustar el inventario")
      // }

      // Show success toast
      toast({
        title: "Inventario ajustado",
        description: `Se ha ${data.type === "add" ? "añadido" : "removido"} ${data.quantity} unidades de ${selectedProduct?.name || data.sku}`,
      })

      // Reset form and close modal
      form.reset()
      setSelectedProduct(null)
      setShowConfirmation(false)
      onOpenChange(false)
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error adjusting inventory:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo ajustar el inventario. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get reason label
  const getReasonLabel = (reason: string) => {
    const reasons = {
      reception: "Recepción de mercancía",
      damage: "Producto dañado",
      correction: "Corrección de inventario",
      sale: "Venta manual",
      return: "Devolución",
      other: "Otro",
    }
    return reasons[reason as keyof typeof reasons] || reason
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when closing
        form.reset()
        setSelectedProduct(null)
        setShowConfirmation(false)
      }
      onOpenChange(newOpen)
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Ajuste de Stock</DialogTitle>
          <DialogDescription>
            Busca un producto por SKU o nombre y ajusta su inventario
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product search */}
              <div className="space-y-4">
                <FormLabel>Buscar producto</FormLabel>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por SKU o nombre..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      searchProducts(e.target.value)
                    }}
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-2.5">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-md max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.sku}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="text-sm">
                          Stock: <span className="font-medium">{product.stock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected product */}
                {selectedProduct && (
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center mr-3">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedProduct.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        Stock actual: <span className="font-medium">{selectedProduct.stock}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de ajuste</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="add">
                            <div className="flex items-center">
                              <Plus className="mr-2 h-4 w-4 text-green-500" />
                              Añadir stock
                            </div>
                          </SelectItem>
                          <SelectItem value="remove">
                            <div className="flex items-center">
                              <Minus className="mr-2 h-4 w-4 text-red-500" />
                              Remover stock
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un motivo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reception">Recepción de mercancía</SelectItem>
                        <SelectItem value="damage">Producto dañado</SelectItem>
                        <SelectItem value="correction">Corrección de inventario</SelectItem>
                        <SelectItem value="sale">Venta manual</SelectItem>
                        <SelectItem value="return">Devolución</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Notas adicionales sobre el ajuste" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={!selectedProduct}>
                  Continuar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Confirmar ajuste de inventario</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Producto:</span>
                      <span className="font-medium">{selectedProduct?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-mono">{form.getValues("sku")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock actual:</span>
                      <span className="font-medium">{selectedProduct?.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ajuste:</span>
                      <span className={`font-medium ${form.getValues("type") === "add" ? "text-green-600" : "text-red-600"}`}>
                        {form.getValues("type") === "add" ? "+" : "-"}{form.getValues("quantity")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nuevo stock:</span>
                      <span className="font-medium">
                        {form.getValues("type") === "add" 
                          ? (selectedProduct?.stock || 0) + form.getValues("quantity")
                          : (selectedProduct?.stock || 0) - form.getValues("quantity")}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Motivo:</span>
                      <span>{getReasonLabel(form.getValues("reason"))}</span>
                    </div>
                    {form.getValues("notes") && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notas:</span>
                        <span>{form.getValues("notes")}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                Volver
              </Button>
              <Button 
                type="button" 
                onClick={handleConfirmAdjustment}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar ajuste
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
