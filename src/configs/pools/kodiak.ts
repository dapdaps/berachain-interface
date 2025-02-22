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
  sweetenedIslands: {
    "0x4a254b11810b8ebb63c5468e438fc561cb1bb1da": {
      name: "BERA-HONEY",
      farmAddress: "0x40c4d0a87157c3c1df26267ac02505d930baeeeb",
      token0: bera["bera"],
      token1: bera["honey"]
    },
    "0x9659dc8c1565e0bd82627267e3b4eed1a377ebe6": {
      name: "WETH-BERA",
      farmAddress: "0xF41eCc551E3c7449E74a7a7464BB2674fA76954c",
      token0: bera["weth"],
      token1: bera["bera"]
    },
    "0xec8ba456b4e009408d0776cde8b91f8717d13fa1": {
      name: "YEET-BERA",
      farmAddress: "0x1c8e199c6c42d5cce652cf02002694d937118177",
      token0: bera["yeet"],
      token1: bera["bera"]
    }
  },
  islands: [
    "0xf6c6be0ff6d6f70a04dbe4f1ade62cb23053bd95",
    "0xf6b16e73d3b0e2784aae8c4cd06099be65d092bf",
    "0x58fdb6eebf7df7ce4137994436fb0e629bb84b84",
    "0xb73dee52f38539ba854979eab6342a60dd4c8c03",
    "0x12c195768f65f282ea5f1b5c42755fbc910b0d8f",
    "0xe5a2ab5d2fb268e5ff43a5564e44c3309609aff9",
    "0xd5b6ea3544a51bfdda7e6926bdf778339801dfe8",
    "0x74e852a4f88bfbeff01275bb95d5ed77f2967d12",
    "0x933b2e6a71edbf11bba75c5ad241d246b145e0b0",
    "0x78f87aa41a4c32a619467d5b36e0319f3eaf2da2",
    "0xbfbefcfae7a58c14292b53c2ccd95bf2c5742eb0",
    "0x7cebcc76a2faecc0ae378b340815fcbb71ec1fe0",
    "0x63b0edc427664d4330f72eec890a86b3f98ce225",
    "0x7fd165b73775884a38aa8f2b384a53a3ca7400e6",
    "0x03bccf796cdef61064c4a2effdd21f1ac8c29e92",
    "0x57161d6272f47cd48ba165646c802f001040c2e0",
    "0x97431f104be73fc0e6fc731ce84486da05c48871",
    "0xba4d7a7df1999d6f29de133872cddd5cb46c6694",
    "0xb67d60fc02e0870eddca24d4fa8ea516c890152b",
    "0x502eed2a3a88ffd2b49d7f5018c7ca9965c43e95",
    "0x3879451f4f69f0c2d37cad45319cff2e7d29c596",
    "0x43e487126c4f37d1915cf02a90b5c5295afb1790",
    "0x72768fed7f56ca010974aab65e1467ac8567902c",
    "0xc64794dc7c550b9a4a8f7caf68e49f31c0269d90",
    "0x377daaf5043ebdbdf15e79edb143d7e2df2ecf4a",
    "0x069759428dbf32de4cfa2d107f5205d5bbdcd02f",
    "0x7428f72b70226b6c98ddbe14f80ea23336528b1a",
    "0x42930c47c681d4c78692ae8a88eb277e494fdd27",
    "0x7297485557e5488ff416a8349af29717df7ae625",
    "0xbc865d60eccec3b412a32f764667291c54c93736",
    "0xa91d046d26b540c875bc3cc785181a270bc37704",
    "0x1d5224aff66ebb2cf46de98f69a5982f650f098c",
    "0xadd169f7e0905fb2e78cdfbee155c975db0f2cbe",
    "0xefb340d54d54e1c4e3566878a5d64a3a591e12a3",
    "0xff619bdaedf635251c3af5bfa82bcaf856c95cc3",
    "0xba86cd31c9e142ed833748ab6304e82a48d34b32",
    "0xf8163eac4c0239a81a7d8bd05b8e14498a5fd880",
    "0xfc4994e0a4780ba7536d7e79611468b6bde14cae",
    "0xc3e64469e1c333360ddb6bf0ea9b0c18e69410f0",
    "0xbd57f5ffe5e183b5cfa91b328d37730c25ddd720",
    "0x2f8c651e2f576c8c4b6de3c32210d9b4a4461d5c",
    "0xa0cabfc04fc420b3d31ba431d18eb5bd33b3f334",
    "0x6e29ec043103ff346450763ac364a22fc7fd4a7c",
    "0xad63328f4f4b8681db713ce2eb353596628fc3b2",
    "0x98bdeede9a45c28d229285d9d6e9139e9f505391"
  ]
} as any;
