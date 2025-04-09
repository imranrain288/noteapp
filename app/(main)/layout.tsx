"use client";

import { Spinner } from "@/components/spinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import { SearchCommand } from "@/components/search-command";
import { useFirebase } from "@/components/providers/firebase-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useFirebase();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
