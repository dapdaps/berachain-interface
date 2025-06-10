"use client";

import { config, projectId, metadata } from "@/configs/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { berasigWallet, metaMaskWallet, coinbaseWallet, okxWallet, bitgetWallet, binanceWallet } from '@rainbow-me/rainbowkit/wallets';
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, createConfig, fallback, http } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/configs";
import "@rainbow-me/rainbowkit/styles.css";
import { createClient } from "viem";
import { berachain } from "viem/chains";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const connectors: any = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        berasigWallet,
        metaMaskWallet,
        coinbaseWallet,
        okxWallet,
        bitgetWallet,
        binanceWallet,
      ],
    },
  ],
  {
    appName: metadata.name,
    projectId,
  }
);

// const defaultNetwork = networks.find((it: any) => it.id === 80094);

// const customWallets: any = [];
// @ts-ignore
// if (typeof window !== "undefined" && !window.berasig) {
//   customWallets.push({
//     id: "BeraSig",
//     name: "BeraSig Wallet (Recommend)",
//     homepage: "https://docs.beraji.com/wallet-integration",
//     image_url: "/images/wallets/bera-sig-wallet.avif"
//   });
// }

// Create the modal
// const modal = createAppKit({
//   adapters: [wagmiAdapter],
//   projectId,
//   networks: networks as any,
//   defaultNetwork: defaultNetwork || networks[0],
//   metadata: metadata,
//   featuredWalletIds: [
//     "BeraSig",
//     // Explorer: https://explorer.walletconnect.com/
//     "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // Metamask
//     "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
//     "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX
//     "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget
//     "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4" // Binance
//   ],
//   customWallets,
//   features: {
//     analytics: true, // Optional - defaults to your Cloud configuration
//     email: true,
//     socials: [
//       "google",
//       "x",
//       "github",
//       "discord",
//       "apple",
//       "facebook",
//       "farcaster"
//     ],
//     emailShowWallets: true // default to true
//   },
//   allWallets: "SHOW",
//   enableInjected: true,
//   enableWalletConnect: true,
//   enableEIP6963: true,
//   enableCoinbase: true,
//   allowUnsupportedChain: true
// });

const wagmiConfig = createConfig({
  ...config,
  connectors,
  client: ({ chain }) => {
    if (chain.id === berachain.id) {
      return createClient({
        chain,
        transport: fallback([http("https://rpc.berachain.com")]),
      })
    }
    return createClient({
      chain,
      transport: http()
    })
  }
});

function ContextProvider({
  children,
  cookies
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  
  const initialState = cookieToInitialState(
    wagmiConfig,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          initialChain={DEFAULT_CHAIN_ID}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
