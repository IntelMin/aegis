import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import Provider from '@/components/provider';
import '../styles.css';
import { ThemeProvider } from '@/components/theme-provider';
import { satoshi } from '@/fonts/satoshi';

export const metadata: Metadata = {
  title: 'Aegis - AI Powered Defi Aisstant',
  description: 'Superpowered AI assistant for DeFi',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/opengraph-image.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${satoshi.className} bg-[#09090B]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Provider>
            <div className="flex">
              {children}
              <Toaster />
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
