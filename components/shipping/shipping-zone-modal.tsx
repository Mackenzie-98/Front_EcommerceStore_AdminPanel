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
import { Loader2, X } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"

// Validation schema for shipping zone form
const shippingZoneSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  countries: z.array(z.string()).min(1, { message: "Select at least one country" }),
  is_active: z.boolean().default(true),
})

type ShippingZoneFormValues = z.infer<typeof shippingZoneSchema>

// Mock list of countries (in a real app, this would come from an API)
const availableCountries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "IN", name: "India" },
  { code: "TH", name: "Thailand" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "RU", name: "Russia" },
  { code: "TR", name: "Turkey" },
]

// Predefined regions for quick selection
const regions = [
  {
    name: "North America",
    countries: ["US", "CA", "MX"]
  },
  {
    name: "European Union",
    countries: ["FR", "DE", "IT", "ES", "NL"]
  },
  {
    name: "Asia Pacific",
    countries: ["AU", "JP", "KR", "SG", "TH"]
  },
  {
    name: "South America",
    countries: ["BR", "AR", "CL", "CO", "PE"]
  }
]

interface ShippingZoneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zone?: any
  onSuccess?: () => void
}

export function ShippingZoneModal({ 
  open, 
  onOpenChange, 
  zone, 
  onSuccess 
}: ShippingZoneModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")

  const isEditing = !!zone?.id

  // Initialize form with default values
  const form = useForm<ShippingZoneFormValues>({
    resolver: zodResolver(shippingZoneSchema),
    defaultValues: zone ? {
      name: zone.name,
      description: zone.description,
      countries: zone.countries || [],
      is_active: zone.is_active,
    } : {
      name: "",
      description: "",
      countries: [],
      is_active: true,
    }
  })

  // Handle country selection
  const handleCountryToggle = (countryCode: string) => {
    const currentCountries = form.getValues("countries")
    const newCountries = currentCountries.includes(countryCode)
      ? currentCountries.filter(code => code !== countryCode)
      : [...currentCountries, countryCode]
    
    form.setValue("countries", newCountries)
  }

  // Handle region selection
  const handleRegionSelect = (regionCountries: string[]) => {
    const currentCountries = form.getValues("countries")
    const newCountries = [...new Set([...currentCountries, ...regionCountries])]
    form.setValue("countries", newCountries)
  }

  // Remove country
  const removeCountry = (countryCode: string) => {
    const currentCountries = form.getValues("countries")
    form.setValue("countries", currentCountries.filter(code => code !== countryCode))
  }

  // Filter countries based on search
  const filteredCountries = availableCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  )

  // Handle form submission
  const onSubmit = async (data: ShippingZoneFormValues) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // const endpoint = isEditing 
      //   ? `/api/v1/admin/shipping/zones/${zone.id}`
      //   : "/api/v1/admin/shipping/zones"
      // const method = isEditing ? "PUT" : "POST"
      
      // const response = await fetch(endpoint, {
      //   method: method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) {
      //   throw new Error(`Error ${isEditing ? 'updating' : 'creating'} shipping zone`)
      // }

      // Show success toast
      toast({
        title: isEditing ? "Shipping zone updated" : "Shipping zone created",
        description: `${data.name} has been ${isEditing ? 'updated' : 'created'} successfully`,
      })

      // Reset form and close modal
      form.reset()
      setCountrySearch("")
      onOpenChange(false)
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} shipping zone:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${isEditing ? 'update' : 'create'} shipping zone. Please try again.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCountryName = (countryCode: string) => {
    const country = availableCountries.find(c => c.code === countryCode)
    return country ? country.name : countryCode
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when closing
        form.reset()
        setCountrySearch("")
      }
      onOpenChange(newOpen)
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Shipping Zone' : 'New Shipping Zone'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the shipping zone information below' 
              : 'Create a new shipping zone to group countries with similar shipping options'
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
                    <FormLabel>Zone Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Domestic, International, Europe" {...field} />
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
                        placeholder="Brief description of this shipping zone"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quick Region Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Quick Region Selection</h4>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Button
                    key={region.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegionSelect(region.countries)}
                  >
                    Add {region.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Selected Countries */}
            <div className="space-y-4">
              <h4 className="font-medium">Selected Countries</h4>
              {form.watch("countries").length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-32 overflow-y-auto">
                  {form.watch("countries").map((countryCode) => (
                    <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
                      {getCountryName(countryCode)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeCountry(countryCode)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3 border rounded-md">
                  No countries selected. Use the search below or quick region buttons above.
                </p>
              )}
            </div>

            {/* Country Search and Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Add Countries</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {filteredCountries.map((country) => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={country.code}
                        checked={form.watch("countries").includes(country.code)}
                        onCheckedChange={() => handleCountryToggle(country.code)}
                      />
                      <label 
                        htmlFor={country.code} 
                        className="text-sm cursor-pointer flex-1"
                      >
                        <span className="font-medium">{country.name}</span>
                        <span className="text-muted-foreground ml-2">({country.code})</span>
                      </label>
                    </div>
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No countries found matching "{countrySearch}"
                    </p>
                  )}
                </div>
              </div>
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
                      Active Shipping Zone
                    </FormLabel>
                    <FormDescription>
                      Inactive zones will not be available for shipping method configuration
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Zone' : 'Create Zone'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
