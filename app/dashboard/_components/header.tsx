"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { staticTitles } from "@/lib/constants/titles";
import { SidebarTrigger, useSidebar } from "../../../components/ui/sidebar";

const SafeSidebarTrigger = () => {
  try {
    useSidebar();
    return <SidebarTrigger />;
  } catch (e) {
    return null;
  }
};

export function usePageTitle() {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    if (staticTitles[path]) return staticTitles[path];

    const segments = path.split("/").filter(Boolean);

    if (segments.length === 3) {
      const dynamicPath = `/${segments[0]}/${segments[1]}/:id`;
      if (staticTitles[dynamicPath]) return staticTitles[dynamicPath];
    }

    if (segments.length === 4) {
      const dynamicPath = `/${segments[0]}/${segments[1]}/:type/:id`;
      if (staticTitles[dynamicPath]) return staticTitles[dynamicPath];
    }

    if (segments.length > 0) {
      return segments[segments.length - 1].replace(/-/g, " ");
    }

    return "Page";
  };

  return getTitle(pathname);
}

const HeaderContent = () => {
  const title = usePageTitle();

  return (
    <header className="w-full flex items-center gap-4 border-b border-b-foreground/10 h-16">
      <div className="p-2">
        <SafeSidebarTrigger />
      </div>
      <h1 className={`font-bold text-lg ${title == "Waraq" ? "text-2xl text-primary" : ""}`}>{title}</h1>
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
