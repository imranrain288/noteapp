"use client";

import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { useFirebase } from "@/components/providers/firebase-provider";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";

export const Navbar = () => {
  const { auth, provider } = useFirebase();
  const [user, loading] = useAuthState(auth);
  const scrolled = useScrollTop();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav
      className={cn(
        "sticky inset-x-0 top-0 z-50 mx-auto flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-end md:ml-auto">
        <div className="flex items-center gap-x-2">
          {loading && <Spinner />}
          {!loading && !user && (
            <>
              <Button variant="ghost" size="sm" onClick={handleSignIn}>
                Log In
              </Button>
              <Button size="sm" onClick={handleSignIn}>
                Get Noteapp Free
              </Button>
            </>
          )}

          {user && !loading && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/documents">Enter Note App</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
