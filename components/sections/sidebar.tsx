"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import ProfileModal from "@/src/features/profile/components/profileModal";
import Image from "next/image";
import {
  ChevronDown,
  LayoutDashboard,
  Library,
  NotebookPen,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import { Suspense } from "react";
import SidebarNav from "./sidebar-nav";


const addNewItems = [
  { href: "/dashboard/documents/new", label: "Document" },
  { href: "/dashboard/authors/new", label: "Author" },
  { href: "/dashboard/notes/new", label: "Note" },
];

const AppSidebar = () => {
  return (
    <Sidebar className="p-2">
      <SidebarHeader className="h-16 flex items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Image
                src="/favicons/favicon-32x32.png"
                width={32}
                height={32}
                alt="logo"
                className="rounded-full shadow-shadow"
              />

              <h1>
                <Link href="/dashboard" className="text-lg">
                  Waraq
                </Link>
              </h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={null}>
              <SidebarNav />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-accent">
                Add New
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p">
              <SidebarGroupContent>
                <SidebarMenu>
                  {addNewItems.map(({ href, label }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild>
                        <Link href={href} className="flex items-center gap-2">
                          <span className="p-2">{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <ProfileModal />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
