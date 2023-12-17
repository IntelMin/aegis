"use client";

import * as React from "react";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getSession, SessionProvider } from "next-auth/react";
import { get } from "http";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}
const { chains, publicClient } = configureChains(
  [mainnet, goerli, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "aegis ai",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export async function Providers({ children, themeProps }: ProvidersProps) {
  const session = await getSession();
  return (
    <SessionProvider session={session}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <NextUIProvider>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </NextUIProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}
