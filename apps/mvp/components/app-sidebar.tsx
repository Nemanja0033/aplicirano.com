"use client"
import {
  ScrollText,
  Inbox,
  ChartBar,
  BotIcon,
  ChartBarIncreasingIcon,
  Home
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SignInButton from "../features/auth/components/AuthToggler"
import { usePathname } from "next/navigation"
import Link from "next/link"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home
  },
  {
    title: "Jobs List",
    url: "/jobs",
    icon: ScrollText,
  },
  {
    title: "JobTrack AI",
    url: "/chatbot",
    icon: BotIcon,
  },
  {
    title: "Statistics",
    url: "/stats",
    icon: ChartBar
  }
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between h-full px-2 py-4">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="flex gap-2 items-center text-2xl p-10.5 text-primary font-bold px-3 mb-2 border-b rounded-none">
              <span className="bg-primary rounded-lg text-white p-1 text-md">JT</span> JobTrakify
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className={`${pathname === item.url.slice(0) ? 'bg-primary/20 text-primary' : ''}`} asChild>
                      <Link
                        href={item.url}
                        className="flex items-center text-lg gap-3 px-3 py-2 rounded-md transition-colors"
                      >
                        <item.icon size={40} />
                        <span className="text-md font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter className="px-3 flex pt-4 border-t">
          <SignInButton />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
