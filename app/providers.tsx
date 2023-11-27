"use client";

import * as React from "react";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import {
	getDefaultWallets,
	RainbowKitProvider,
  } from '@rainbow-me/rainbowkit';
  import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli, sepolia } from 'wagmi/chains';
  import { publicProvider } from 'wagmi/providers/public';

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}
  const { chains, publicClient } = configureChains(
	  [ mainnet,goerli, sepolia],
	  [
		publicProvider()
	  ]
	);
	
	const { connectors } = getDefaultWallets({
	  appName: 'aegis ai',
	  projectId: 'YOUR_PROJECT_ID',
	  chains
	});
	
	const wagmiConfig = createConfig({
	  autoConnect: true,
	  connectors,
	  publicClient
	})

export function Providers({ children, themeProps }: ProvidersProps) {
	return (
<WagmiConfig config={wagmiConfig}>
<RainbowKitProvider chains={chains}>

		<NextUIProvider>
			<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
		</NextUIProvider>
		</RainbowKitProvider>
</WagmiConfig>
	);
}
