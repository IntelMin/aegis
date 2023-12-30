import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import Layout from "@/components/layout";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-[#09090B]">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
