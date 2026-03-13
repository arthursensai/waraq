"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import ProfileModal from "@/src/features/profile/components/profileModal";
import Image from "next/image";
import {
  LayoutDashboard,
  Library,
  NotebookPen,
  Plus,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: Library },
  { href: "/dashboard/authors", label: "Authors", icon: Users },
  { href: "/dashboard/notes", label: "Notes", icon: NotebookPen },
];

const addNewItems = [
  { href: "/dashboard/documents/new", label: "Document" },
  { href: "/dashboard/authors/new", label: "Author" },
  { href: "/dashboard/notes/new", label: "Note" },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="p-2">
      {/* Header */}
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/favicons/favicon-32x32.png"
                  width={28}
                  height={28}
                  alt="logo"
                  className="rounded-full shrink-0"
                />
                <span className="text-base font-semibold tracking-tight">
                  Waraq
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="overflow-x-hidden">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Link href={href}>
                        <Icon className="shrink-0" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Add New */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Add New
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {addNewItems.map(({ href, label }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild tooltip={`New ${label}`}>
                    <Link href={href} className="flex items-center gap-2">
                      <span className="p-2">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfileModal />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
