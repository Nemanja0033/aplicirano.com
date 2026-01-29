"use client";
import {
  ScrollText,
  Inbox,
  ChartBar,
  BotIcon,
  ChartBarIncreasingIcon,
  Home,
  User2,
  File,
} from "lucide-react";

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
} from "@/src/components/ui/sidebar";
import SignInButton from "../features/user/components/AuthToggler";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const items = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t("jobs"),
      url: "/dashboard/jobs", // promenjeno
      icon: ScrollText,
    },
    {
      title: "AI Chatbot",
      url: "/dashboard/chatbot", // ako želiš da i ovo bude u dashboardu
      icon: BotIcon,
    },
    {
      title: t("stats"),
      url: "/dashboard/stats", // isto
      icon: ChartBar,
    },
    {
      title: t("profile"),
      url: "/dashboard/profile", // isto
      icon: User2,
    },
    {
      title: t("resume"),
      url: "/dashboard/resume", // isto
      icon: File,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between h-full px-2 py-4">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="flex gap-2 items-center justify-center text-2xl py-7 text-primary font-bold px-3 mb-2 border-b rounded-none">
              {/* <span className="bg-primary rounded-lg text-white p-1 text-md">JT</span> JobTrakify */}
              <img className="w-full mr-20" src="/logo.svg" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`${pathname === item.url.slice(0) ? "bg-primary/20 text-primary" : ""}`}
                      asChild
                    >
                      <Link
                        href={item.url}
                        className="flex items-center text-lg px-3 py-2 rounded-md transition-colors"
                      >
                        <item.icon size={40} />
                        <span className="text-md font-medium">
                          {item.title}
                        </span>

                        {item.title.includes('AI Chatbot') && <span className="text-primary font-bold">|Beta</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter>
          <SignInButton />
          <hr />
          <span className="text-[9px] text-muted-foreground absolute bottom-1 left-[40%]">v.0.1.0</span>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
