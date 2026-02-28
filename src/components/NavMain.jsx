"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // ✅ FIX #4: Import useSidebar to close mobile sidebar on nav click
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';
import Link from "next/link"

export function NavMain({
  items,
}) {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar(); // ✅ FIX #4: Get setOpenMobile to close sidebar on mobile

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            // ✅ FIX #3: Use startsWith for sub-routes (e.g. /products/addProduct highlights "Products")
            // Special case for /dashboard to avoid matching everything that starts with "/"
            const isActive =
              pathname === item.url ||
              (item.url !== "/" && pathname.startsWith(item.url + "/"));

            return (
            <SidebarMenuItem key={item.title}>
              <Link
                href={item.url}
                onClick={() => setOpenMobile(false)} // ✅ FIX #4: Close mobile sidebar on link click
              >
                <SidebarMenuButton tooltip={item.title} 
                className={`hover:bg-gradient-to-br from-tech-darkBlue to-tech-blue hover:text-white ${
                  isActive ? 'bg-gradient-to-br from-tech-darkBlue to-tech-blue text-white font-semibold' : ''
                }`}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
           );
        } ) }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
