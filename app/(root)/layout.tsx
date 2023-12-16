import WhitelistWrapper from "@/components/WhitelistWrapper";
import { Layout } from "@/components/layout";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import "@rainbow-me/rainbowkit/styles.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "../providers";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx(
        "min-h-screen bg-black font-sans antialiased",
        fontSans.variable
      )}>
        <WhitelistWrapper>
          <NextTopLoader color="#b0b0b0" />
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <Layout>{children}</Layout>
          </Providers>
        </WhitelistWrapper>
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
