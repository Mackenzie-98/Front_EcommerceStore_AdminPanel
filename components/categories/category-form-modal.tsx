import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMemoryBank } from "@/lib/memory-bank/context"
import { Category, Subcategory } from "@/lib/types"

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  subcategory?: Subcategory | null
  categories: Category[]
  onSuccess: () => void
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  subcategory,
  categories,
  onSuccess
}: CategoryFormModalProps) {
  const { toast } = useToast()
  const memoryBank = useMemoryBank()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    category_id: "none",
    is_active: true,
    sort_order: 0
  })

  // Reset form when modal opens/closes or category/subcategory changes
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || "",
          slug: category.slug,
          category_id: "none",
          is_active: category.is_active,
          sort_order: category.sort_order
        })
      } else if (subcategory) {
        setFormData({
          name: subcategory.name,
          description: subcategory.description || "",
          slug: subcategory.slug,
          category_id: subcategory.category_id,
          is_active: subcategory.is_active,
          sort_order: subcategory.sort_order
        })
      } else {
        setFormData({
          name: "",
          description: "",
          slug: "",
          category_id: "none",
          is_active: true,
          sort_order: 0
        })
      }
    }
  }, [open, category, subcategory])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${subcategory ? "Subcategory" : "Category"} name is required`
      })
      return
    }

    setLoading(true)
    try {
      if (category) {
        // Updating category
        const submitData = {
          ...formData,
          category_id: undefined
        }
        await memoryBank.categories.update(category.id, submitData)
        toast({
          title: "Success",
          description: "Category updated successfully"
        })
      } else if (subcategory) {
        // Updating subcategory
        const submitData = {
          ...formData,
          category_id: formData.category_id === "none" ? "" : formData.category_id
        }
        await memoryBank.categories.update(subcategory.id, submitData)
        toast({
          title: "Success",
          description: "Subcategory updated successfully"
        })
      } else {
        // Creating new - determine if it's a category or subcategory based on category_id
        if (formData.category_id === "none") {
          // Creating new category
          const submitData = {
            ...formData,
            category_id: undefined
          }
          await memoryBank.categories.create(submitData)
          toast({
            title: "Success", 
            description: "Category created successfully"
          })
        } else {
          // Creating new subcategory
          const submitData = {
            ...formData,
            category_id: formData.category_id
          }
          await memoryBank.categories.create(submitData)
          toast({
            title: "Success", 
            description: "Subcategory created successfully"
          })
        }
      }

      onSuccess()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save ${subcategory ? "subcategory" : "category"}`
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter out the current category from parent options to prevent circular reference
  const parentOptions = categories.filter(cat => cat.id !== category?.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : subcategory ? "Edit Subcategory" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="category-slug"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">{subcategory ? "Category" : "Parent Category"}</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={subcategory ? "Select category" : "Select parent category (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {!subcategory && <SelectItem value="none">None</SelectItem>}
                {parentOptions.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {category ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 