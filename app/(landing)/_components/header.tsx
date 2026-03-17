import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const HeaderActions = async () => {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data;

  return (
    <div className="w-fit flex items-center justify-center gap-6">
      {user ? (
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      ) : (
        <>
          <Button variant="default" size="lg" asChild>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </>
      )}
    </div>
  );
};

const Header = () => {
  return (
   <header className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between border-b border-b-foreground/10 h-16 px-6 bg-background/80 backdrop-blur-sm">
      <h1 className="font-bold text-2xl text-primary/90">Waraq</h1>
      <HeaderActions />
    </header>
  );
};

export default Header;
