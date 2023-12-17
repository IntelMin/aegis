"use client"
import WhitelistWrapper from "@/components/WhitelistWrapper";
import { Layout } from "@/components/layout";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "../providers";
import { getSession } from "next-auth/react";
import { getServerAuthSession } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const session = await getSession();
  //     const serversession = await getServerAuthSession();
  //     if (!session) redirect("/signin");
  //   };
  //   checkAuth();
  // }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-black font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextTopLoader color="#b0b0b0" />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* <WhitelistWrapper> */}
          <Layout>{children}</Layout>
          {/* </WhitelistWrapper> */}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
