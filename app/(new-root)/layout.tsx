import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import Layout from "@/components/new-layout";

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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;
