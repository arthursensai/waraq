import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "./env-var-warning";
import AuthButton from "./auth-button";

const Header = () => {
  return (
    <header className="w-full flex justify-between border-b border-b-foreground/10 h-16">
      <h1 className="flex gap-5 items-center font-semibold px-3">
        <Link href={"/"}>My books</Link>
      </h1>
      <nav className="flex justify-center">
        <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

export default Header;
