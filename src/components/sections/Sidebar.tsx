import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { items } from "@/components/menu-items";
import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar
      side="right"
      variant="sidebar"
      className="hidden md:block"
      collapsible="icon"
    >
      {/* ✅ الهيدر */}
      <SidebarHeader className="border-b border-sidebar-border py-1">
        <div className="flex items-center gap-2 transition-all duration-300">
          <Image
            src="/logo.webp"
            width={50}
            height={50}
            alt="logo"
            className="rounded-full transition-all duration-300 
              md:w-16 md:h-16 w-12 h-12 
              data-[collapsed=true]:w-10 data-[collapsed=true]:h-6"
          />
          <div
            className="text-center transition-all duration-300 
              data-[collapsed=true]:hidden overflow-hidden"
          >
            <p className="text-xs text-gray-500 dark:text-white font-semibold">
              عسكر للمقاولات العمومية
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Askar General Contracting
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Accountant & Engineer
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* ✅ المحتوى */}
      <SidebarContent>
        <div>
          {/* ✅ الأقسام */}
          {items.map((group, index) => (
            <SidebarGroup key={index} className="mt-1">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item, idx) => (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className="flex items-center gap-x-reverse gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <item.icon className="w-6 h-6 text-gray-500" />
                          <span className="text-gray-900 dark:text-white font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
