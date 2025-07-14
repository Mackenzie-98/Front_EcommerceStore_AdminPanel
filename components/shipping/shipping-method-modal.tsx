"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "../../hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
import { Loader2 } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"

// Validation schema for shipping method form
const shippingMethodSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  type: z.enum(["flat_rate", "free_shipping", "weight_based", "calculated"]),
  cost: z.coerce.number().min(0, { message: "Cost cannot be negative" }),
  min_order_value: z.coerce.number().min(0, { message: "Minimum order value cannot be negative" }),
  max_order_value: z.coerce.number().optional(),
  estimated_days_min: z.coerce.number().int().min(1, { message: "Minimum days must be at least 1" }),
  estimated_days_max: z.coerce.number().int().min(1, { message: "Maximum days must be at least 1" }),
  weight_min: z.coerce.number().optional(),
  weight_max: z.coerce.number().optional(),
  is_active: z.boolean().default(true),
  zones: z.array(z.string()).min(1, { message: "Select at least one shipping zone" }),
}).refine(data => data.estimated_days_max >= data.estimated_days_min, {
  message: "Maximum delivery days must be greater than or equal to minimum days",
  path: ["estimated_days_max"],
}).refine(data => !data.max_order_value || data.max_order_value > data.min_order_value, {
  message: "Maximum order value must be greater than minimum order value",
  path: ["max_order_value"],
})

type ShippingMethodFormValues = z.infer<typeof shippingMethodSchema>

interface ShippingMethodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  method?: any
  zones: Array<{
    id: string
    name: string
    description: string
  }>
  onSuccess?: () => void
}

export function ShippingMethodModal({ 
  open, 
  onOpenChange, 
  method, 
  zones,
  onSuccess 
}: ShippingMethodModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!method?.id

  // Initialize form with default values
  const form = useForm<ShippingMethodFormValues>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: method ? {
      name: method.name,
      description: method.description,
      type: method.type,
      cost: method.cost,
      min_order_value: method.min_order_value || 0,
      max_order_value: method.max_order_value || undefined,
      estimated_days_min: method.estimated_days_min,
      estimated_days_max: method.estimated_days_max,
      weight_min: method.weight_min || undefined,
      weight_max: method.weight_max || undefined,
      is_active: method.is_active,
      zones: method.zones || [],
    } : {
      name: "",
      description: "",
      type: "flat_rate",
      cost: 0,
      min_order_value: 0,
      max_order_value: undefined,
      estimated_days_min: 5,
      estimated_days_max: 7,
      weight_min: undefined,
      weight_max: undefined,
      is_active: true,
      zones: [],
    }
  })

  // Watch type to show/hide relevant fields
  const selectedType = form.watch("type")

  // Handle zone selection
  const handleZoneToggle = (zoneId: string) => {
    const currentZones = form.getValues("zones")
    const newZones = currentZones.includes(zoneId)
      ? currentZones.filter(id => id !== zoneId)
      : [...currentZones, zoneId]
    
    form.setValue("zones", newZones)
  }

  // Handle form submission
  const onSubmit = async (data: ShippingMethodFormValues) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // const endpoint = isEditing 
      //   ? `/api/v1/admin/shipping/methods/${method.id}`
      //   : "/api/v1/admin/shipping/methods"
      // const methodType = isEditing ? "PUT" : "POST"
      
      // const response = await fetch(endpoint, {
      //   method: methodType,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) {
      //   throw new Error(`Error ${isEditing ? 'updating' : 'creating'} shipping method`)
      // }

      // Show success toast
      toast({
        title: isEditing ? "Shipping method updated" : "Shipping method created",
        description: `${data.name} has been ${isEditing ? 'updated' : 'created'} successfully`,
      })

      // Reset form and close modal
      form.reset()
      onOpenChange(false)
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} shipping method:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${isEditing ? 'update' : 'create'} shipping method. Please try again.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case "flat_rate":
        return "Fixed cost regardless of order value or weight"
      case "free_shipping":
        return "No charge for shipping, optionally with minimum order value"
      case "weight_based":
        return "Cost calculated based on total weight"
      case "calculated":
        return "Real-time rates from shipping carriers"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when closing
        form.reset()
      }
      onOpenChange(newOpen)
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Shipping Method' : 'New Shipping Method'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the shipping method information below' 
              : 'Create a new shipping method for your customers'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Standard Shipping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of this shipping method"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flat_rate">Flat Rate</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        <SelectItem value="weight_based">Weight Based</SelectItem>
                        <SelectItem value="calculated">Calculated Rates</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {getTypeDescription(selectedType)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium">Pricing Configuration</h4>
              
              {selectedType !== "calculated" && (
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {selectedType === "free_shipping" ? "Cost (set to 0 for free)" : "Shipping Cost ($)"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          disabled={selectedType === "free_shipping"}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_order_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Value ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Minimum order required for this shipping method
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_order_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Order Value ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="No limit"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum order value (leave empty for no limit)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Weight Configuration (for weight-based shipping) */}
            {selectedType === "weight_based" && (
              <div className="space-y-4">
                <h4 className="font-medium">Weight Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="No limit"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Delivery Time */}
            <div className="space-y-4">
              <h4 className="font-medium">Delivery Time</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimated_days_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Days</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_days_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Days</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Shipping Zones */}
            <div className="space-y-4">
              <h4 className="font-medium">Available in Zones</h4>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={zone.id}
                      checked={form.watch("zones").includes(zone.id)}
                      onCheckedChange={() => handleZoneToggle(zone.id)}
                    />
                    <label 
                      htmlFor={zone.id} 
                      className="text-sm cursor-pointer flex-1"
                    >
                      <span className="font-medium">{zone.name}</span>
                      <span className="text-muted-foreground ml-2">{zone.description}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-1 flex-wrap">
                {form.watch("zones").map((zoneId) => {
                  const zone = zones.find(z => z.id === zoneId)
                  return zone ? (
                    <Badge key={zoneId} variant="secondary">
                      {zone.name}
                    </Badge>
                  ) : null
                })}
              </div>
              <FormMessage />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Active Shipping Method
                    </FormLabel>
                    <FormDescription>
                      Inactive methods will be hidden from customers at checkout
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Method' : 'Create Method'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
