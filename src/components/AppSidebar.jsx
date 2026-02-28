"use client"

import * as React from "react"
import {
  Home,
  ImageIcon,
  LayoutDashboardIcon,
  PhoneIcon,
  Projector,
  ShoppingBag, // ✅ FIX #5: Replaced Calendar with ShoppingBag for Products (semantically correct)
  User,
  UserRoundCheck,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/NavMain"
import { NavUser } from "@/components/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Category } from "tabler-icons-react" // ✅ FIX #6: Removed unused Shape2 import

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },

    {
      title: "Banners",
      url: "/banners",
      icon: ImageIcon,
    },

    {
      title: "Collections",
      url: "/collections",
      icon: Projector,
    },

    {
      title: "Products",
      url: "/products",
      icon: ShoppingBag, // ✅ FIX #5: ShoppingBag is more appropriate for Products than Calendar
    },

    {
      title: "Catalogues",
      url: "/catalogue",
      icon: Category,
    },

    {
      title: "Subscriber",
      url: "/subscriber",
      icon: UserRoundCheck,
    },

    {
      title: "Users",
      url: "/users",
      icon: User,
    },

    {
      title: "Contact Request",
      url: "/contactRequest",
      icon: PhoneIcon,
    },

    {
      title: "Partner Request",
      url: "/partnerRequest",
      icon: UsersIcon,
    },

  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu >
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 bg-gradient-to-br from-tech-darkBlue to-tech-blue text-white"
            >
              <Link href="/">
                <Home className="h-5 w-5 text-white" />
                <span className="text-base text-white  font-semibold">Sumaiya Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
