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
import { Toaster } from 'sonner';
import TopBanner from '../components/AppBanner';
import { useIsMobile } from '../hooks/use-mobile';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isMobile = useIsMobile()

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {pathname === '/en' || pathname.includes("auth") || pathname === "/sr" || pathname.includes("privacy-policy") || pathname.includes("terms-of-service") ? (
            children
          ) : (
            <>
              {/* {!isMobile ? ( */}
                <>
                  <TopBanner />
                  <main className='mt-5'>
                    <Navbar />
                    <SidebarProvider>
                      <AppSidebar />
                      <SidebarTrigger />
                      {children}
                    </SidebarProvider>
                  </main>
                </>
              {/* ) : (
                <div className="flex items-center justify-center h-screen">
                  <p className="text-center text-lg font-semibold">
                    This application is best viewed on a larger screen. Please switch to a desktop or tablet for the best experience.
                  </p>
                </div>
              )} */}
            </>
          )}
          <Toaster position='top-center' />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers
