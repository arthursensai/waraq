import { ThemeSwitcher } from "../buttons/theme-switcher";
import Link from "next/link";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-muted/20">

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">

          {/* Left: Credit */}
          <p className="text-xs text-muted-foreground flex gap-4 items-center justify-center">
            Built by{" "}
            <Link
              href="https://www.instagram.com/sensai_arthur/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              <Instagram className="h-3 w-3" />
              Arthur
            </Link>
          </p>

          {/* Center: Brand */}
          <span className="font-serif text-base font-bold italic text-primary absolute left-1/2 -translate-x-1/2">
            Waraq
          </span>

          {/* Right: Theme switcher */}
          <ThemeSwitcher />

        </div>
      </div>
    </footer>
  );
};

export default Footer;