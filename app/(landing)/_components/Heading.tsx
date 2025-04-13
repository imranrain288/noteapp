"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSupabase } from "@/components/providers/supabase-provider";

export const Heading = () => {
  const { user, loading, signInWithGoogle } = useSupabase();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-5xl">
        Your Ideas, Documents & Plans. Welcome to Note App
      </h1>
      <h2 className="text-base font-medium sm:text-xl">
        Note app is the connected workspace where <br /> better, faster work
        happens.
      </h2>
      {loading && (
        <div className="flex w-full items-center justify-center">
          <Spinner size="md" />
        </div>
      )}
      {user && !loading && (
        <Button asChild>
          <Link href="/documents">
            Enter Note App
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
      {!user && !loading && (
        <Button onClick={handleSignIn}>
          Get Noteapp Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
