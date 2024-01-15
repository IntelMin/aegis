'use client';

import { SessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';

import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli, sepolia, bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, goerli, sepolia, bscTestnet],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: 'Aegis ai',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || ' ',
  chains,
});
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

interface ProviderProps {
  children: ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          modalSize="compact"
          chains={chains}
          theme={darkTheme({
            accentColor: '#06B266',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
        >
          <NextTopLoader showSpinner={false} />
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  );
};

export default Provider;
