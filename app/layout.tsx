import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MemoryBankProvider } from "@/lib/memory-bank/context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-commerce Admin Dashboard",
  description: "Complete administrative dashboard for e-commerce management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MemoryBankProvider>
            <SidebarProvider>
              <AppSidebar />
              {children}
              <Toaster />
            </SidebarProvider>
          </MemoryBankProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
