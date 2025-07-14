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
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Validation schema for user form
const userFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  role: z.enum(["admin", "staff"]),
  status: z.enum(["active", "inactive"]),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .optional()
    .or(z.literal('')),
  sendWelcomeEmail: z.boolean().default(true),
})

type UserFormValues = z.infer<typeof userFormSchema>

// Props for the user form modal
interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  user?: {
    id: string
    name: string
    email: string
    role: "admin" | "staff"
    status: "active" | "inactive"
  }
  mode: "create" | "edit"
}

export function UserFormModal({ open, onOpenChange, onSuccess, user, mode }: UserFormModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      sendWelcomeEmail: false,
    } : {
      name: "",
      email: "",
      role: "staff",
      status: "active",
      password: "",
      sendWelcomeEmail: true,
    }
  })

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // const endpoint = mode === 'create' ? "/api/v1/admin/users" : `/api/v1/admin/users/${user?.id}`
      // const method = mode === 'create' ? "POST" : "PUT"
      // const response = await fetch(endpoint, {
      //   method: method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) {
      //   throw new Error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} el usuario`)
      // }

      // Show success toast
      toast({
        title: mode === 'create' ? "Usuario creado" : "Usuario actualizado",
        description: `${data.name} ha sido ${mode === 'create' ? 'creado' : 'actualizado'} exitosamente`,
      })

      // Reset form and close modal
      form.reset()
      onOpenChange(false)
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} user:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${mode === 'create' ? 'crear' : 'actualizar'} el usuario. Inténtalo de nuevo.`,
      })
    } finally {
      setIsSubmitting(false)
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crea un nuevo usuario para el sistema administrativo' 
              : 'Actualiza la información del usuario'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Determina los permisos del usuario
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Un usuario inactivo no puede iniciar sesión
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{mode === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={mode === 'create' ? "Contraseña" : "Dejar en blanco para mantener la actual"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {mode === 'create' 
                        ? 'Mínimo 8 caracteres' 
                        : 'Deja este campo en blanco si no quieres cambiar la contraseña'
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === 'create' && (
                <FormField
                  control={form.control}
                  name="sendWelcomeEmail"
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
                          Enviar email de bienvenida
                        </FormLabel>
                        <FormDescription>
                          Se enviará un email con instrucciones para acceder al sistema
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
