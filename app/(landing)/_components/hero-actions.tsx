"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LogIn } from "lucide-react";

const HeroActions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setIsLoggedIn(true);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-12 w-40 animate-pulse rounded-sm bg-muted" />
        <div className="h-12 w-28 animate-pulse rounded-sm bg-muted" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className="group inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        Go to dashboard
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/auth/sign-up"
        className="group inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        Start your library
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 rounded-sm border border-border px-7 py-3.5 text-sm font-semibold tracking-wide text-foreground transition-all duration-200 hover:bg-accent active:scale-[0.98]"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </Link>
    </>
  );
};

export default HeroActions;