import Providers from "@/components/providers";
import Header from "./_components/header";
import Footer from "@/components/sections/footer";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
    </Providers>
  );
};

export default LandingLayout;