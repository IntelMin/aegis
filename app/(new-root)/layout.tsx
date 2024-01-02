import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import NewLayout from "@/components/layout";
import WhitelistWrapper from "@/components/whitelist-wrapper";

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
        <WhitelistWrapper>
        <NewLayout>{children}</NewLayout>
        </WhitelistWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
