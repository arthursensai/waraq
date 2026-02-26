"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { staticTitles } from "@/lib/titles";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

const SafeSidebarTrigger = () => {
  try {
    useSidebar();
    return <SidebarTrigger />;
  } catch (e) {
    return null;
  }
};

const HeaderContent = () => {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    if (staticTitles[path]) return staticTitles[path];

    const segments = path.split("/").filter(Boolean);

    if (segments[0] === "books") {
      if (segments.length === 2) return segments[1].replace(/-/g, " ");
      if (segments.length === 3) return segments[2].replace(/-/g, " ");
    }

    return segments.length > 0
      ? segments[segments.length - 1].replace(/-/g, " ")
      : "Page";
  };

  const title = getTitle(pathname);

  return (
    <header className="w-full flex items-center gap-4 border-b border-b-foreground/10 h-16">
      <div className="p-2">
        <SafeSidebarTrigger />
      </div>
      <h1 className="font-bold text-lg">{title}</h1>
    </header>
  );
};

const Header = () => {
  return (
    <Suspense
      fallback={
        <header className="w-full flex items-center gap-4 border-b border-b-foreground/10 h-16">
          <div className="p-2" />
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
