import kodiak from "../swap/kodiak";
import { bera } from "../tokens/bera";

const contracts: { [key: number]: any } = {
  80094: {
    FactoryV2: "0x5e705e184d233ff2a7cb1553793464a9d0c3028f",
    RouterV2: "0xd91dd58387Ccd9B66B390ae2d7c66dBD46BC6022",
    FactoryV3: "0xD84CBf0B02636E7f53dB9E5e45A616E05d710990",
    PositionManager: "0xFE5E8C83FFE4d9627A75EaA7Fee864768dB989bD"
  }
};
const tokens = kodiak.tokens;

export default {
  contracts,
  tokens,
  officalSite: "/dex/kodiak/pools",
  name: "Kodiak",
  graph: {
    80094:
      "https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v3-berachain-mainnet/latest/gn"
  },
  stakingRouter: "0x679a7C63FC83b6A4D9C1F931891d705483d4791F",
  islands: {
    "0x58fdb6eebf7df7ce4137994436fb0e629bb84b84": {
      name: "WBTC-WETH",
      farmAddress: "",
      token0: bera["wbtc"],
      token1: bera["weth"]
    }
  }
};
