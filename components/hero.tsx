import Link from "next/link";
import { Button } from "./ui/button";
import { UploadCloud, FolderTree, Globe } from "lucide-react";

const howItWorks = [
  {
    title: "Upload & Sync",
    description:
      "Drag and drop your PDF files. We'll securely sync them across all your devices instantly.",
    icon: <UploadCloud size={32} className="text-primary" />,
  },
  {
    title: "Smart Organization",
    description: "Categorize your documents with custom tags and folders to stay organized.",
    icon: <FolderTree size={32} className="text-primary" />,
  },
  {
    title: "Access Anywhere",
    description: "Read and manage your PDFs from any device, anytime, with seamless cloud access.",
    icon: <Globe size={32} className="text-primary" />,
  },
];

const Hero = () => {
  return (
    <div className="flex flex-col gap-5 items-center px-4 py-8">
      <div className="flex flex-col space-y-6 text-center gap-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          The best platform to keep track of your <span className="text-primary">PDFs</span> everywhere!
        </h1>
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Start Now!
            </Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-border to-transparent my-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {howItWorks.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 items-center text-center p-8 border-2 border-border bg-card hover:bg-accent/50 transition-colors rounded-xl shadow-sm"
          >
            <div className="bg-primary/10 rounded-full flex p-2">
               {item.icon}
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">
              {item.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;