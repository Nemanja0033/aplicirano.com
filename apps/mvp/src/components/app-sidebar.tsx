"use client";
import {
  ScrollText,
  Inbox,
  ChartBar,
  BotIcon,
  Home,
  User2,
  File,
  ChartLine,
  MessageCircle,
  FileText,
  Sparkle,
  SparkleIcon,
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
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "../i18n/navigation";
import { Button } from "./ui/button";
import { useCurrentUser } from "../features/user/hooks/useCurrentUser";
import { useAuthContext } from "../context/AuthProvider";
import UpgradeButton from "./UpgradeButton";

export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations("Sidebar");
  const { currentUserData } = useCurrentUser();
  const { token } = useAuthContext();

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
      title: "Chatbot",
      url: "/dashboard/chatbot", // ako želiš da i ovo bude u dashboardu
      icon: MessageCircle,
    },
    {
      title: t("stats"),
      url: "/dashboard/stats", // isto
      icon: ChartLine,
    },
    {
      title: t("profile"),
      url: "/dashboard/profile", // isto
      icon: User2,
    },
    {
      title: t("resume"),
      url: "/dashboard/resume", // isto
      icon: FileText,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between h-full p-2">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="flex w-full border-b-1 py-7 items-center justify-start">
              <img src="/logo.png" className="w-12" alt="" />
              <span className="text-2xl font-semibold text-primary">Aplicirano</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`${pathname.split("/dashboard")[1] === item.url.split("/dashboard")[1] ? "bg-gray-400/10" : ""}`}
                      asChild
                    >
                      <Link
                        href={item.url}
                        className="flex items-center text-lg p-5 rounded-md transition-colors"
                      >
                        <item.icon size={40} strokeWidth={1} />
                        <span className="text-md">
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
          {!currentUserData?.isProUSer && token !== null ? (
            <div className="bg-primary/20 p-[16px] rounded-[8px] grid gap-3">
              <Button className="bg-primary/20 text-primary font-semibold w-fit hover:bg-primary/20 cursor-default"><SparkleIcon className="text-primary" />Pro plan</Button>
              <p className="text-primary/80 text-sm">{t("pro_plan_message")}</p>
              <UpgradeButton />
            </div>
          ) : null}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
