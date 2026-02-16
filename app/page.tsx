import { EnvVarWarning } from "@/components/env-var-warning";
import AuthButton from "@/components/auth-button";
import Hero from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

const Page = () => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Header />
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default Page;