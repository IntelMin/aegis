import "@/styles/globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
import { Layout } from "@/components/layout";
import '@rainbow-me/rainbowkit/styles.css';

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

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ClerkProvider>
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
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout
