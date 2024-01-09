'use client';

import { SessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli, sepolia, bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { chains, publicClient } = configureChains(
  [mainnet, goerli, sepolia, bscTestnet],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: 'Aegis ai',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || '',
  chains,
});
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

interface ProviderProps {
  children: ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <QueryClientProvider client={queryClient}>
            <NextTopLoader showSpinner={false} />
            {children}
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  );
};

export default Provider;
