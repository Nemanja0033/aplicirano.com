"use client"
import { AppSidebar } from '@/components/app-sidebar'
import Navbar from '@/components/Navbar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from '@/context/AuthProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <>
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider attribute="class" defaultTheme="dark">
                            <Navbar />
                            <SidebarProvider>
                            <AppSidebar />
                            <SidebarTrigger />
                            {children}
                            </SidebarProvider>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </ThemeProvider>
                    </QueryClientProvider>
                </AuthProvider>
        </>
  )
}

export default Providers