import { bera } from "../tokens/bera";

export default {
  name: "BeraSwap",
  icon: "/images/dapps/beraswap.svg",
  path: "/dex/beraswap",
  defaultInputCurrency: bera["bera"],
  tokens: {
    80094: [
      bera["bera"],
      bera["wbera"],
      bera["honey"],
      bera["byusd"],
      bera["usdc.e"],
      bera["usdt0"],
      bera["wbtc"],
      bera["weth"],
      bera["ibera"],
      bera["ibgt"],
      // bera["usdbr"],
      bera["nome"],
      bera["azt"],
      bera["artio"],
      bera["lbgt"],
      bera["stbgt"],
      bera["bitcoin"]
    ]
  }
};
