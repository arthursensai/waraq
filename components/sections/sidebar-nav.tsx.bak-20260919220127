// components/sections/sidebar-nav.tsx
"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { LayoutDashboard, Library, NotebookPen, Users } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: Library },
  { href: "/dashboard/authors", label: "Authors", icon: Users },
  { href: "/dashboard/notes", label: "Notes", icon: NotebookPen },
];

const SidebarNav = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);

        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton asChild isActive={isActive} >
              <Link href={href}>
                <Icon className="shrink-0" />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarNav;