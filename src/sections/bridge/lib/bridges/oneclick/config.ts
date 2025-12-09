// fromChainId: blockchain
export const ChainMap: Record<string, { blockchain: string; chainName: string; nativeToken: { symbol: string; decimals: number; }; }> = {
  "1": {
    blockchain: "eth",
    chainName: "Ethereum",
    nativeToken: {
      symbol: "ETH",
      decimals: 18,
    },
  },
  "10": {
    blockchain: "op",
    chainName: "Optimism",
    nativeToken: {
      symbol: "ETH",
      decimals: 18,
    },
  },
  "56": {
    blockchain: "bsc",
    chainName: "BNB Chain",
    nativeToken: {
      symbol: "BNB",
      decimals: 18,
    },
  },
  "42161": {
    blockchain: "arb",
    chainName: "Arbitrum",
    nativeToken: {
      symbol: "ETH",
      decimals: 18,
    },
  },
  "43114": {
    blockchain: "avax",
    chainName: "Avalanche",
    nativeToken: {
      symbol: "AVAX",
      decimals: 18,
    },
  },
  "8453": {
    blockchain: "base",
    chainName: "Base",
    nativeToken: {
      symbol: "ETH",
      decimals: 18,
    },
  },
  // "59144": "linea", // not support
  // "5000": "mantle", // not support
  "137": {
    blockchain: "pol",
    chainName: "Polygon",
    nativeToken: {
      symbol: "POL",
      decimals: 18,
    },
  },
  // "534352": "scroll", // not support
  "80094": {
    blockchain: "bera",
    chainName: "Berachain",
    nativeToken: {
      symbol: "BERA",
      decimals: 18,
    },
  },
};
