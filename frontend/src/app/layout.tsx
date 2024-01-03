import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/provider";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aegis - AI Powered Defi Aisstant",
  description: "Superpowered AI assistant for DeFi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Provider>
          <div className="flex">
            <Sidebar />
            <div className="relative w-full">
              <Navbar />
              {children}
            </div>
            <Toaster />
          </div>
        </Provider>
      </body>
    </html>
  );
}
