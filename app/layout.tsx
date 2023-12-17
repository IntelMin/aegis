
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { getServerAuthSession } from "./api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
