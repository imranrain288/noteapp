"use client";

import { redirect } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";

import { Spinner } from "@/components/spinner";
import { Navigation } from "./_components/Navigation";
import { SearchCommand } from "@/components/search-command";

const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useSupabase();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    redirect("/");
  }

  return ( 
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
      <SearchCommand />
    </div>
  );
}
 
export default MainLayout;
