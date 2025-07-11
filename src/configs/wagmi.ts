"use client";

import { cookieStorage, createStorage, fallback, http } from "wagmi";
import chains, { turbo } from "./chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, aurora, base, berachain, mainnet } from "wagmi/chains"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "BeraTown",
  description: "BeraTown",
  // origin must match your domain & subdomain
  url: "https://berachain.dapdap.net",
  icons: ["/favicon.ico"]
};

export const networks: any = Object.values(chains) //.filter((c) => c.isWalletSupport);

// const connectors: CreateConnectorFn[] = [];

// @ts-ignore
// if (typeof window !== "undefined" && window.berasig) {
//   // @ts-ignore
//   const berasig = window.berasig.ethereum;
//   const BeraSig = (config: any) => {
//     const Connector = injected({
//       shimDisconnect: false,
//       target: {
//         id: "BeraSig",
//         icon: "/images/wallets/bera-sig-wallet.avif",
//         name: "BeraSig Wallet (Recommend)",
//         // @ts-ignore
//         provider: berasig
//       }
//     })(config);
//     return {
//       ...Connector,
//       disconnect: async () => {
//         await Connector.disconnect();
//         try {
//           // TODO Useless
//           await berasig.request({
//             method: "eth_requestAccounts",
//             params: [{ eth_accounts: {} }]
//           });
//           console.log("disconnect done");
//         } catch (err: any) {
//           console.log("disconnect failed: %o", err);
//         }
//       }
//     };
//   };

//   // connectors.push(BeraSig);
// }

export const config = getDefaultConfig({
  appName: metadata.name,
  appDescription: metadata.description,
  appUrl: metadata.url,
  appIcon: metadata.icons[0],
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId: projectId,
  chains: networks,
  transports: {
    [berachain.id]: fallback([http("https://rpc.berachain.com")]),
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [turbo.id]: http(),
    [aurora.id]: http(),
  },
});

// export const wagmiAdapter = new WagmiAdapter({
//   // @ts-ignore
//   storage: createStorage({
//     storage: cookieStorage
//   }),
//   ssr: true,
//   projectId,
//   networks,
//   // @ts-ignore
//   connectors,
//   transports: {
//     80094: fallback([http("https://rpc.berachain.com")]),
//     [mainnet.id]: http(),
//     [base.id]: http(),
//     [arbitrum.id]: http(),
//     [turbo.id]: http(),
//     [aurora.id]: http(),
//   }
// });

// export const config = wagmiAdapter.wagmiConfig;
