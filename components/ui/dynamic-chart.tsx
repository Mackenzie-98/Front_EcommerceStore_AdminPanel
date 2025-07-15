'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ChartFallback, ChartErrorFallback } from './chart-error-boundary'

// Simplified dynamic chart components using Next.js standard approach
export const DynamicSalesChart = dynamic(
  () => import('@/components/dashboard/sales-chart').then(m => ({ default: m.SalesChart })),
  { 
    ssr: false,
    loading: () => <ChartFallback title="Sales Chart" description="Loading sales data..." />
  }
)

export const DynamicCustomerSegmentationChart = dynamic(
  () => import('@/components/dashboard/customer-segmentation-chart').then(m => ({ default: m.CustomerSegmentationChart })),
  { 
    ssr: false,
    loading: () => <ChartFallback title="Customer Segmentation" description="Loading customer data..." />
  }
) 