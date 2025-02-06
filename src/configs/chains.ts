import { Chain } from "viem";
import {
  mainnet,
  berachainTestnetbArtio,
  arbitrum
} from "@reown/appkit/networks";

const chains: Record<number, Chain | any> = {
  80094: {
    id: 80094,
    name: "Berachain Mainnet",
    nativeCurrency: { decimals: 18, name: "BERA Token", symbol: "BERA" },
    contracts: {
      multicall3: { address: "0xcA11bde05977b3631167028862bE2a173976CA11" }
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.berachain.com"]
      }
    },
    blockExplorers: {
      default: {
        name: "Berachain Mainnet",
        url: "https://berascan.com/"
      }
    },
    isWalletSupport: true
  },
  [mainnet.id]: {
    ...mainnet,
    isWalletSupport: false
  }
};

export const icons: Record<number, string> = {
  80094: "/images/berachain.png",
  1: "/images/eth.svg"
  // 1101: '/images/berachain.png'
};

export default chains;

export const ChristmasActivityChains: Record<number, Chain | any> = {
  [arbitrum.id]: {
    ...arbitrum
  },
  [mainnet.id]: {
    ...mainnet
  },
  [berachainTestnetbArtio.id]: {
    ...berachainTestnetbArtio,
    rpcUrls: {
      default: {
        http: ["https://bartio.drpc.org", "https://bartio.rpc.berachain.com"]
      }
    }
  }
};
