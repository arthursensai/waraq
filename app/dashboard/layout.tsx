import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sections/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers"

const layout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <Providers>
      <SidebarProvider defaultOpen={true} suppressHydrationWarning>
          <AppSidebar />
        <main className="flex flex-col min-h-screen w-full">
          <div className="flex items-center justify-between">
            <Header />
          </div>
          <div className="flex-1 p-4">{children}</div>
          <Toaster />
          <Footer />
        </main>
      </SidebarProvider>
    </Providers>
  );
};

export default layout;
