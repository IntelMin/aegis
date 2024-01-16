import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster';
import Provider from '@/components/provider';
import { ThemeProvider } from '@/components/theme-provider';

const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Light.otf',
      weight: '300',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Aegis - AI Powered Defi Aisstant',
  description: 'Superpowered AI assistant for DeFi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${satoshi.className} bg-black`}>
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
