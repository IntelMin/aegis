import "@/styles/globals.css";
import { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
import { Layout } from "@/components/layout";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );

  // return (
  //   <html lang="en" suppressHydrationWarning>
  //     <head>
  //       <title>Temporarily Down for Maintenance</title>
  //       <meta name="description" content="Our site is currently down for maintenance. We'll be back shortly." />
  //     </head>
  //     <body
  //       className={clsx(
  //         "min-h-screen bg-background font-sans antialiased text-white",
  //         fontSans.variable
  //       )}
  //     >
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="text-center">
  //           <h1 className="text-lg font-semibold">We'll be back soon!</h1>
  //           <p className="mt-4">Sorry for the inconvenience but we're performing some maintenance at the moment. We'll be back up shortly!</p>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
  // );

}
