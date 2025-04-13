import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noteapp",
  description: "The connected workspace for better, faster work",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon2.jpg" sizes="10px" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="noteapp-theme"
        >
          <SupabaseProvider>
            <EdgeStoreProvider>
              <TooltipProvider>
                <Toaster position="bottom-center" />
                <ModalProvider />
                {children}
              </TooltipProvider>
            </EdgeStoreProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
