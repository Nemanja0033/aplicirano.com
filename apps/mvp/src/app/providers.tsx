"use client";

import { AppSidebar } from '@/src/components/app-sidebar'
import Navbar from '@/src/components/Navbar'
import { SidebarProvider, SidebarTrigger } from '@/src/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from '@/src/context/AuthProvider'
import { usePathname } from 'next/navigation'

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {pathname === '/en' || pathname === "/sr" || pathname === "/privacy-policy" || pathname === "/terms-of-service" ? (
            children
          ) : (
            <>
              <Navbar />
              <SidebarProvider>
                <AppSidebar />
                <SidebarTrigger />
                {children}
              </SidebarProvider>
            </>
          )}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers
