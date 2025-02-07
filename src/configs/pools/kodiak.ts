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
    // "0x58fdb6eebf7df7ce4137994436fb0e629bb84b84": {
    //   name: "WBTC-uniBTC",
    //   farmAddress: "",
    //   token0: bera["wbtc"],
    //   token1: bera["unibtc"]
    // },
    // "0x78f87aa41a4c32a619467d5b36e0319f3eaf2da2": {
    //   name: "NECT-USDe",
    //   farmAddress: "",
    //   token0: bera["nect"],
    //   token1: bera["usde"]
    // },
    // "0x74e852a4f88bfbeff01275bb95d5ed77f2967d12": {
    //   name: "NECT-HONEY",
    //   farmAddress: "",
    //   token0: bera["nect"],
    //   token1: bera["honey"]
    // },
    // "0x7fd165b73775884a38aa8f2b384a53a3ca7400e6": {
    //   name: "rUSD-HONEY",
    //   farmAddress: "",
    //   token0: bera["rusd"],
    //   token1: bera["honey"]
    // },
    // "0xb73dee52f38539ba854979eab6342a60dd4c8c03": {
    //   name: "USDC.e-HONEY",
    //   farmAddress: "",
    //   token0: bera["usdc.e"],
    //   token1: bera["honey"]
    // },
    // "0x03bccf796cdef61064c4a2effdd21f1ac8c29e92": {
    //   name: "WETH-beraETH",
    //   farmAddress: "",
    //   token0: bera["weth"],
    //   token1: bera["beraeth"]
    // },
    // "0x63b0edc427664d4330f72eec890a86b3f98ce225": {
    //   name: "USDe-USDa",
    //   farmAddress: "",
    //   token0: bera["usde"],
    //   token1: bera["usda"]
    // },
    // "0xbfbefcfae7a58c14292b53c2ccd95bf2c5742eb0": {
    //   name: "HONEY-USDa",
    //   farmAddress: "",
    //   token0: bera["honey"],
    //   token1: bera["usda"]
    // },
    // "0xe5a2ab5d2fb268e5ff43a5564e44c3309609aff9": {
    //   name: "USDe-HONEY",
    //   farmAddress: "",
    //   token0: bera["usde"],
    //   token1: bera["honey"]
    // },
    // "0x12c195768f65f282ea5f1b5c42755fbc910b0d8f": {
    //   name: "USD₮0-HONEY",
    //   farmAddress: "",
    //   token0: bera["usdt0"],
    //   token1: bera["honey"]
    // }
  }
};
