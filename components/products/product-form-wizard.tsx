"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon 
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Validation schema for product form
const productBasicSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  sku: z.string().min(3, { message: "El SKU debe tener al menos 3 caracteres" }),
  category_id: z.string().min(1, { message: "Selecciona una categoría" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
})

const productPricingSchema = z.object({
  price: z.coerce.number().min(0.01, { message: "El precio debe ser mayor a 0" }),
  cost: z.coerce.number().min(0, { message: "El costo no puede ser negativo" }),
  stock: z.coerce.number().int().min(0, { message: "El stock no puede ser negativo" }),
  low_stock_threshold: z.coerce.number().int().min(1, { message: "El umbral de stock bajo debe ser al menos 1" }),
})

const attributeSchema = z.object({
  name: z.string().min(1, { message: "El nombre del atributo es requerido" }),
  values: z.array(z.string()).min(1, { message: "Agrega al menos un valor" }),
})

const productVariantsSchema = z.object({
  has_variants: z.boolean().default(false),
  attributes: z.array(attributeSchema).optional(),
})

const productImagesSchema = z.object({
  images: z.array(z.any()).optional(),
})

// Mock categories
const categories = [
  { id: "1", name: "Smartphones" },
  { id: "2", name: "Laptops" },
  { id: "3", name: "Audio" },
  { id: "4", name: "Tablets" },
  { id: "5", name: "Wearables" },
]

type WizardStep = "basic" | "pricing" | "variants" | "images"

export function ProductFormWizard() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<WizardStep>("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const [attributes, setAttributes] = useState<Array<{ name: string; values: string[] }>>([])
  const [generatedVariants, setGeneratedVariants] = useState<Array<any>>([])
  const [uploadedImages, setUploadedImages] = useState<Array<any>>([])

  // Initialize forms for each step
  const basicForm = useForm<z.infer<typeof productBasicSchema>>({
    resolver: zodResolver(productBasicSchema),
    defaultValues: {
      name: "",
      sku: "",
      category_id: "",
      description: "",
    }
  })

  const pricingForm = useForm<z.infer<typeof productPricingSchema>>({
    resolver: zodResolver(productPricingSchema),
    defaultValues: {
      price: 0,
      cost: 0,
      stock: 0,
      low_stock_threshold: 5,
    }
  })

  const variantsForm = useForm<z.infer<typeof productVariantsSchema>>({
    resolver: zodResolver(productVariantsSchema),
    defaultValues: {
      has_variants: false,
      attributes: [],
    }
  })

  const imagesForm = useForm<z.infer<typeof productImagesSchema>>({
    resolver: zodResolver(productImagesSchema),
    defaultValues: {
      images: [],
    }
  })

  // Handle basic info submission
  const onBasicSubmit = async (data: z.infer<typeof productBasicSchema>) => {
    // Move to next step
    setStep("pricing")
  }

  // Handle pricing submission
  const onPricingSubmit = async (data: z.infer<typeof productPricingSchema>) => {
    // If we have a product ID, it means we've already created the product
    if (productId) {
      setStep("variants")
      return
    }

    // Create the product
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch("/api/v1/admin/products", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: basicForm.getValues("name"),
      //     sku: basicForm.getValues("sku"),
      //     category_id: basicForm.getValues("category_id"),
      //     description: basicForm.getValues("description"),
      //     price: data.price,
      //     cost: data.cost,
      //     stock: data.stock,
      //     low_stock_threshold: data.low_stock_threshold,
      //   }),
      // })
      
      // if (!response.ok) {
      //   throw new Error("Error al crear el producto")
      // }
      
      // const result = await response.json()
      // setProductId(result.id)

      // Mock response
      setProductId("new-product-123")

      // Show success toast
      toast({
        title: "Producto creado",
        description: "La información básica del producto ha sido guardada",
      })

      // Move to next step
      setStep("variants")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el producto. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle variants submission
  const onVariantsSubmit = async (data: z.infer<typeof productVariantsSchema>) => {
    if (!data.has_variants) {
      // No variants, move to next step
      setStep("images")
      return
    }

    // Create variants
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // const response = await fetch(`/api/v1/admin/products/${productId}/variants/bulk`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     variants: generatedVariants,
      //   }),
      // })
      
      // if (!response.ok) {
      //   throw new Error("Error al crear las variantes")
      // }

      // Show success toast
      toast({
        title: "Variantes creadas",
        description: `Se han creado ${generatedVariants.length} variantes para el producto`,
      })

      // Move to next step
      setStep("images")
    } catch (error) {
      console.error("Error creating variants:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron crear las variantes. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle images submission
  const onImagesSubmit = async (data: z.infer<typeof productImagesSchema>) => {
    if (uploadedImages.length === 0) {
      // No images, finish the process
      finishProductCreation()
      return
    }

    // Upload images
    setIsSubmitting(true)
    try {
      // In a real app, this would be a fetch to your API
      // for (const image of uploadedImages) {
      //   const formData = new FormData()
      //   formData.append("image", image)
      //   
      //   const response = await fetch(`/api/v1/admin/products/${productId}/images`, {
      //     method: "POST",
      //     body: formData,
      //   })
      //   
      //   if (!response.ok) {
      //     throw new Error("Error al subir la imagen")
      //   }
      // }

      // Show success toast
      toast({
        title: "Imágenes subidas",
        description: `Se han subido ${uploadedImages.length} imágenes para el producto`,
      })

      // Finish the process
      finishProductCreation()
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron subir las imágenes. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Finish product creation
  const finishProductCreation = () => {
    toast({
      title: "Producto completado",
      description: "El producto ha sido creado exitosamente",
    })

    // Redirect to product detail page
    if (productId) {
      router.push(`/products/${productId}`)
    } else {
      router.push("/products")
    }
  }

  // Add a new attribute
  const addAttribute = () => {
    const newAttributes = [...attributes, { name: "", values: [""] }]
    setAttributes(newAttributes)
  }

  // Update attribute name
  const updateAttributeName = (index: number, name: string) => {
    const newAttributes = [...attributes]
    newAttributes[index].name = name
    setAttributes(newAttributes)
  }

  // Add a new value to an attribute
  const addAttributeValue = (attributeIndex: number) => {
    const newAttributes = [...attributes]
    newAttributes[attributeIndex].values.push("")
    setAttributes(newAttributes)
  }

  // Update attribute value
  const updateAttributeValue = (attributeIndex: number, valueIndex: number, value: string) => {
    const newAttributes = [...attributes]
    newAttributes[attributeIndex].values[valueIndex] = value
    setAttributes(newAttributes)
  }

  // Remove attribute value
  const removeAttributeValue = (attributeIndex: number, valueIndex: number) => {
    const newAttributes = [...attributes]
    newAttributes[attributeIndex].values.splice(valueIndex, 1)
    setAttributes(newAttributes)
  }

  // Remove attribute
  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes]
    newAttributes.splice(index, 1)
    setAttributes(newAttributes)
  }

  // Generate variants from attributes
  const generateVariants = () => {
    if (attributes.length === 0) return []

    // Check if attributes are valid
    const isValid = attributes.every(attr => 
      attr.name.trim() !== "" && 
      attr.values.length > 0 && 
      attr.values.every(val => val.trim() !== "")
    )

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Completa todos los atributos y valores antes de generar variantes",
      })
      return
    }

    // Generate all possible combinations
    const generateCombinations = (attrs: typeof attributes, current: Record<string, string> = {}, index = 0): Array<Record<string, string>> => {
      if (index === attrs.length) {
        return [current]
      }

      const attribute = attrs[index]
      const combinations: Array<Record<string, string>> = []

      for (const value of attribute.values) {
        combinations.push(
          ...generateCombinations(
            attrs,
            { ...current, [attribute.name]: value },
            index + 1
          )
        )
      }

      return combinations
    }

    const variants = generateCombinations(attributes)
    
    // Create variant objects
    const variantObjects = variants.map((combination, index) => {
      const variantName = Object.entries(combination)
        .map(([attr, value]) => `${value}`)
        .join(" / ")
      
      const variantSku = `${basicForm.getValues("sku")}-${index + 1}`
      
      return {
        name: `${basicForm.getValues("name")} - ${variantName}`,
        sku: variantSku,
        price: pricingForm.getValues("price"),
        cost: pricingForm.getValues("cost"),
        stock: Math.floor(pricingForm.getValues("stock") / variants.length),
        attributes: Object.entries(combination).map(([name, value]) => ({
          name,
          value
        }))
      }
    })

    setGeneratedVariants(variantObjects)
    return variantObjects
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedImages(prev => [...prev, ...newFiles])
    }
  }

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
  }

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (step === "pricing") setStep("basic")
    else if (step === "variants") setStep("pricing")
    else if (step === "images") setStep("variants")
  }

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case "basic":
        return (
          <Form {...basicForm}>
            <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
              <FormField
                control={basicForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nombre completo del producto que verán los clientes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={basicForm.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-123" {...field} />
                    </FormControl>
                    <FormDescription>
                      Código único para identificar el producto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={basicForm.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categoría a la que pertenece el producto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={basicForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descripción del producto" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Descripción corta del producto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )
      case "pricing":
        return (
          <Form {...pricingForm}>
            <form onSubmit={pricingForm.handleSubmit(onPricingSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={pricingForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Precio de venta al público
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pricingForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Costo de adquisición
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={pricingForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock inicial</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cantidad inicial disponible
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pricingForm.control}
                  name="low_stock_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Umbral de stock bajo</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cantidad mínima antes de alertar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )
      case "variants":
        return (
          <Form {...variantsForm}>
            <form onSubmit={variantsForm.handleSubmit(onVariantsSubmit)} className="space-y-6">
              <FormField
                control={variantsForm.control}
                name="has_variants"
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
                        Este producto tiene variantes
                      </FormLabel>
                      <FormDescription>
                        Activa esta opción si el producto tiene diferentes variantes (color, talla, etc.)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {variantsForm.watch("has_variants") && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Atributos y variantes</h3>
                    <Button type="button" variant="outline" onClick={addAttribute}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir atributo
                    </Button>
                  </div>

                  {attributes.map((attribute, attrIndex) => (
                    <div key={attrIndex} className="space-y-4 p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 mr-4">
                          <FormItem>
                            <FormLabel>Nombre del atributo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: Color, Talla, Material"
                                value={attribute.name}
                                onChange={(e) => updateAttributeName(attrIndex, e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttribute(attrIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <FormLabel>Valores</FormLabel>
                        {attribute.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex items-center gap-2">
                            <Input
                              placeholder="Valor del atributo"
                              value={value}
                              onChange={(e) => updateAttributeValue(attrIndex, valueIndex, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAttributeValue(attrIndex, valueIndex)}
                              disabled={attribute.values.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAttributeValue(attrIndex)}
                          className="mt-2"
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Añadir valor
                        </Button>
                      </div>
                    </div>
                  ))}

                  {attributes.length > 0 && (
                    <div className="space-y-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => generateVariants()}
                      >
                        Generar variantes
                      </Button>

                      {generatedVariants.length > 0 && (
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2">Variantes generadas ({generatedVariants.length})</h4>
                          <div className="max-h-60 overflow-y-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="text-left text-sm">
                                  <th className="pb-2">Nombre</th>
                                  <th className="pb-2">SKU</th>
                                  <th className="pb-2">Precio</th>
                                  <th className="pb-2">Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {generatedVariants.map((variant, index) => (
                                  <tr key={index} className="border-t">
                                    <td className="py-2 pr-4">{variant.name}</td>
                                    <td className="py-2 pr-4">{variant.sku}</td>
                                    <td className="py-2 pr-4">€{variant.price}</td>
                                    <td className="py-2">{variant.stock}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )
      case "images":
        return (
          <Form {...imagesForm}>
            <form onSubmit={imagesForm.handleSubmit(onImagesSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">Imágenes del producto</FormLabel>
                  <FormDescription>Sube imágenes para mostrar el producto</FormDescription>
                </div>
                
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arrastra y suelta imágenes o haz clic para seleccionar
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="image-upload"
                      onChange={handleFileUpload}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Seleccionar imágenes
                    </Button>
                  </div>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeUploadedImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Finalizar
                </Button>
              </div>
            </form>
          </Form>
        )
    }
  }

  // Render progress indicator
  const renderProgress = () => {
    const steps = [
      { id: "basic", label: "Información básica" },
      { id: "pricing", label: "Precio y stock" },
      { id: "variants", label: "Variantes" },
      { id: "images", label: "Imágenes" },
    ]

    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  s.id === step 
                    ? "bg-primary text-primary-foreground" 
                    : steps.findIndex(x => x.id === step) > i 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <div className="mt-2 text-xs text-center">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all" 
            style={{ 
              width: `${(steps.findIndex(s => s.id === step) / (steps.length - 1)) * 100}%` 
            }} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
          <CardDescription>
            Completa la información para crear un nuevo producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderProgress()}
          <div className="mt-6">
            {renderStepContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
