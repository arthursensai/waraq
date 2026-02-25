import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Providers from "@/components/providers";

const Page = () => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Providers>
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <Header />
          <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
            <Hero />
          </div>
          <Footer />
        </div>
      </Providers>
    </main>
  );
};

export default Page;
