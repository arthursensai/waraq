import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { LightRays } from "@/components/ui/light-rays";

const Page = () => {
  return (
    <Providers>
      <main className="relative min-h-screen flex flex-col items-center">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <LightRays
            color="rgba(245, 236, 225, 0.2)"
            length="100%"
            count={5}
            speed={10}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="flex-1 w-full flex flex-col items-center">
          <Header />

          <section className="flex-1 flex flex-col w-full max-w-5xl px-6 py-12 md:py-24">
            <Hero />
          </section>

          <Footer />
        </div>
      </main>
    </Providers>
  );
};

export default Page;
