
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SessionProvider from "./authProvider";
import getServerSession from "next-auth";
import { getServerAuthSession } from "./api/auth/[...nextauth]/auth";

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
  const session= await getServerAuthSession();
  console.log({session});
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <SessionProvider session= {session}>
         {children}
         </SessionProvider></body>
    </html>
  );
};

export default RootLayout;
