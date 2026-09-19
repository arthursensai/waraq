import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CloudUpload,
  Folder,
  FileText,
  Tag,
  File,
  Layers,
} from "lucide-react";

const NotFound = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b0b0b] via-[#111] to-[#0b0b0b] text-white">

      <div className="pointer-events-none absolute inset-0">
        <FileText className="absolute left-[12%] top-[18%] h-10 w-10 text-[#e6c8a8]/40 rotate-12" />
        <Folder className="absolute left-[20%] top-[55%] h-12 w-12 text-[#e6c8a8]/25 -rotate-6" />
        <Tag className="absolute left-[28%] bottom-[22%] h-8 w-8 text-[#e6c8a8]/35 rotate-6" />
        <File className="absolute left-[8%] bottom-[30%] h-9 w-9 text-[#e6c8a8]/20 -rotate-12" />

        <Layers className="absolute left-[45%] top-[25%] h-7 w-7 text-[#e6c8a8]/20 rotate-3" />
        <FileText className="absolute left-[52%] bottom-[28%] h-8 w-8 text-[#e6c8a8]/25 -rotate-6" />

        <CloudUpload className="absolute right-[18%] top-[30%] h-10 w-10 text-[#e6c8a8]/30 rotate-6" />
        <Folder className="absolute right-[26%] bottom-[24%] h-11 w-11 text-[#e6c8a8]/25 rotate-12" />
        <Tag className="absolute right-[10%] bottom-[40%] h-8 w-8 text-[#e6c8a8]/35 -rotate-6" />
        <File className="absolute right-[14%] top-[60%] h-9 w-9 text-[#e6c8a8]/20 rotate-6" />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 px-6 text-center">
        <h1 className="text-5xl font-semibold text-primary">
          404 — Page Not Found
        </h1>

        <p className="text-xl leading-relaxed">
          This page couldn’t be found, but your documents are right where you left them.
        </p>

        <Button
          asChild
          className="mt-2 rounded-md px-6 py-2 text-black"
        >
          <Link href="/dashboard">Return Home</Link>
        </Button>
      </div>
    </section>
  );
};

export default NotFound;