import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="flex flex-col gap-16 items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The best platform to keep track of your pdfs everywhere!
      </p>
      <Button size="lg" className="flex">
        <Link href="/dashboard" className="w-full" >Start Now!</Link>
      </Button>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
};

export default Hero;
