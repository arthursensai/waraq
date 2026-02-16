import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true} suppressHydrationWarning>
      <Suspense fallback={<div className="bg-sidebar border-r"></div>}>
        <AppSidebar />
      </Suspense>

      <main className="flex flex-col min-h-screen w-full">
        <div className="flex items-center justify-between">
          <SidebarTrigger />
          <Header />
        </div>
        <div className="flex-1 p-8">{children}</div>
        <Toaster />
        <Footer />
      </main>
    </SidebarProvider>
  );
};

export default layout;
