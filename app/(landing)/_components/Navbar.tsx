"use client";

import { useState } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { signInWithGoogle } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Failed to sign in:", error.message);
      // You might want to show this error to the user with a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" onClick={onSignIn} disabled={isLoading}>
            {isLoading ? "Loading..." : "Get Noteapp free"}
          </Button>
        </div>
      </div>
    </div>
  );
};
