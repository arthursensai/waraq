import { cookies } from "next/headers";
import Header from "./_components/header";
import Footer from "@/components/sections/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import AppSidebar from "@/components/sections/sidebar";
import { PdfEngineProvider } from "@/src/features/reader/pdfEngineProvider";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <Providers>
      <PdfEngineProvider>
        <SidebarProvider defaultOpen={defaultOpen} suppressHydrationWarning>
          <AppSidebar />
          <main className="flex flex-col min-h-svh flex-1 min-w-0">
            <Header />
            <div className="flex-1 p-4">{children}</div>
            <Toaster />
            <Footer />
          </main>
        </SidebarProvider>
      </PdfEngineProvider>
    </Providers>
  );
};

export default layout;
