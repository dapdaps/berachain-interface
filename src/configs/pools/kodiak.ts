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
    },
    "0xc227c8639a41db8393dd1b4eac41464a62d64fb4": {
      name: "OHM-BERA",
      farmAddress: "0x3c8e4d4324f7ab2e3238c23a2838a762ecb7051d",
      token0: bera["ohm"],
      token1: bera["bera"]
    },
    "0xf06ea29fcf4765200742d29e685973a1870eac98": {
      name: "WBTC-BERA",
      farmAddress: "0x0d74359866a86d0f192f5cd53d103d299043165b",
      token0: bera["wbtc"],
      token1: bera["bera"]
    },
    "0x93a913351cae2d8c82c4b85f699726947eb76d32": {
      name: "BERA-RAMEN",
      farmAddress: "0x6f22221dc5845a25597bc96629d92f2b4979d943",
      token0: bera["bera"],
      token1: bera["ramen"]
    },
    "0x218c12fe0c2f8a507929d4f5c30a83e38fbca285": {
      name: "NECT-BERA",
      farmAddress: "0x517dbcd3d89ef5a59b02a4142274e3dd5aed5626",
      token0: bera["nect"],
      token1: bera["bera"]
    },
    "0x2cafe99db26cf86ae8587f5934830d25ad5c3cb3": {
      name: "BERA-BITCOIN",
      farmAddress: "0xb4a1519956cee0798eaac3de08f1531f58a0c950",
      token0: bera["bera"],
      token1: bera["bitcoin"]
    },
    "0x28a54eaeec63fbb1175d13466a9ada5f3175d577": {
      name: "USDbr-HONEY",
      farmAddress: "0x274441c8c34b7785fada01ec0d7fe9ba2c72aea0",
      token0: bera["usdbr"],
      token1: bera["honey"]
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
    "0x98bdeede9a45c28d229285d9d6e9139e9f505391",
    "0xd6620e78b89e8fdb5dfa675d55001c7fad424bdc",
    "0x337ef1eb6c8bbed571170fc2b468608ab9e2aac8",
    "0x54c603173ca92a42b81f8838d705fd3e0f98d5d4",
    "0x8b161685135e9fbc5475169e1addc0f2c4b7c343",
    "0xd9a747880393f7c33cef1aea36909b36d421f7e5",
  ]
} as any;
