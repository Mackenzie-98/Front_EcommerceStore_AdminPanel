'use client'

import dynamic from 'next/dynamic'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Error fallback component
function ChartError({ onRetry, title = "Chart Error" }: { onRetry?: () => void, title?: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <p className="text-xs text-muted-foreground mb-4">Unable to load chart</p>
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}

// Loading fallback component
function ChartLoading({ title = "Loading chart..." }: { title?: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}

// Dynamic sales chart with proper error handling
export const DynamicSalesChart = dynamic(
  () => import('@/components/dashboard/sales-chart').then(mod => ({ default: mod.SalesChart })),
  {
    ssr: false,
    loading: () => <ChartLoading title="Loading sales chart..." />
  }
)

// Dynamic customer segmentation chart with proper error handling
export const DynamicCustomerSegmentationChart = dynamic(
  () => import('@/components/dashboard/customer-segmentation-chart').then(mod => ({ default: mod.CustomerSegmentationChart })),
  {
    ssr: false,
    loading: () => <ChartLoading title="Loading customer chart..." />
  }
) 