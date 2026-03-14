import Providers from "@/components/providers";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <main className="flex flex-col min-h-screen w-full">
        <div className="flex-1">{children}</div>
      </main>
    </Providers>
  );
};

export default layout;
