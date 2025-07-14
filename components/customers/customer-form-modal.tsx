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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

// Validation schema for customer form
const customerFormSchema = z.object({
  // Basic information
  email: z.string().email({ message: "Email inválido" }),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  phone: z.string().min(6, { message: "El teléfono debe tener al menos 6 caracteres" }),
  
  // Address information
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

interface CustomerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CustomerFormModal({ open, onOpenChange, onSuccess }: CustomerFormModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<"basic" | "address">("basic")
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
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

  // Check if email exists
  const checkEmailExists = async (email: string) => {
    setIsCheckingEmail(true)
    try {
      const response = await fetch(`/api/v1/users/exists?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.exists) {
        form.setError("email", { 
          type: "manual", 
          message: "Este email ya está registrado" 
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking email:", error)
      return false
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data: CustomerFormValues) => {
    if (step === "basic") {
      // Check if email exists before proceeding to address step
      const emailExists = await checkEmailExists(data.email)
      if (!emailExists) {
        setStep("address")
      }
      return
    }

    // Submit the complete form
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          lastName: data.lastName,
          phone: data.phone,
          addresses: [
            {
              line1: data.address.line1,
              line2: data.address.line2 || "",
              city: data.address.city,
              state: data.address.state,
              postalCode: data.address.postalCode,
              country: data.address.country,
              isDefault: true
            }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el cliente")
      }

      // Show success toast
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente",
      })

      // Reset form and close modal
      form.reset()
      setStep("basic")
      onOpenChange(false)
      
      // Trigger success callback (to refresh the customers list)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el cliente. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle back button in address step
  const handleBack = () => {
    setStep("basic")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          <DialogDescription>
            {step === "basic" 
              ? "Ingresa la información básica del cliente" 
              : "Ingresa la dirección del cliente"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "basic" ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="email@ejemplo.com" 
                            {...field} 
                            disabled={isCheckingEmail}
                          />
                          {isCheckingEmail && (
                            <div className="absolute right-3 top-3">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                        </div>
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
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
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
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellidos" {...field} />
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
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+34 600 123 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address.line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle y número" {...field} />
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
                        <Input placeholder="Apartamento, suite, etc. (opcional)" {...field} />
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
                          <Input placeholder="Ciudad" {...field} />
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
                          <Input placeholder="Provincia" {...field} />
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
                          <Input placeholder="Código postal" {...field} />
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
                          <Input placeholder="País" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              {step === "address" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Atrás
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isCheckingEmail || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === "basic" ? "Siguiente" : "Crear Cliente"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
