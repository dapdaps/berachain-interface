import kodiak from "../swap/kodiak";

const contracts: { [key: number]: any } = {
  80084: {
    FactoryV2: "0xb08Bfed214ba87d5d5D07B7DA573010016C44488",
    RouterV2: "0x406846114B2A9b65a8A2Ab702C2C57d27784dBA2",
    FactoryV3: "0x217Cd80795EfCa5025d47023da5c03a24fA95356",
    PositionManager: "0xc0568c6e9d5404124c8aa9efd955f3f14c8e64a6"
  }
};
const tokens = kodiak.tokens;

export default {
  contracts,
  tokens,
  officalSite: "/dex/kodiak/pools",
  name: "Kodiak",
  graph: {
    80084:
      "https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v2-berachain-bartio/latest/gn"
  },
  stakingRouter: "0x4d41822c1804fff5c038e4905cfd1044121e0e85",
  islands: {
    "0xb67d60fc02e0870eddca24d4fa8ea516c890152b": {
      name: "uniBTC-WBTC",
      farmAddress: ""
    },
    "0x78f87aa41a4c32a619467d5b36e0319f3eaf2da2": {
      name: "WBTC-mPumpBTC",
      farmAddress: ""
    },
    "0x74e852a4f88bfbeff01275bb95d5ed77f2967d12": {
      name: "MIM-HONEY",
      farmAddress: "0xB494C42b5FB24cC2B7eEaD56B1c087C76ec74255"
    },
    "0x7fd165b73775884a38aa8f2b384a53a3ca7400e6": {
      name: "IBGT-BEAR",
      farmAddress: "0x6a283822F6F03dD886c2afABA0A731e35F129391"
    },
    "0xb73dee52f38539ba854979eab6342a60dd4c8c03": {
      name: "HONEY-STGUSDC",
      farmAddress: "0x43340e50807c1244c04e74C6539fe8632597Ca39"
    },
    "0x1afe9c399b40a65c783049e732d7ad5d37e68f78": {
      name: "HONEY-DIRAC",
      farmAddress: "0x3575E94C542c9217E8E0bcc844FFbb10B84C56be"
    },
    "0x03bccf796cdef61064c4a2effdd21f1ac8c29e92": {
      name: "HONEY-MEAD",
      farmAddress: ""
    },
    "0x63b0edc427664d4330f72eec890a86b3f98ce225": {
      name: "HONEY-NECT",
      farmAddress: "0x09347F35B29bD3B8a581a8507F0831aA4d1Af8a9"
    },
    "0xbfbefcfae7a58c14292b53c2ccd95bf2c5742eb0": {
      name: "BEAR-oBERO",
      farmAddress: "0x1812FC946EF5809f8efCEF28Afa6ec9030907748"
    },
    "0xe5a2ab5d2fb268e5ff43a5564e44c3309609aff9": {
      name: "BEAR-YEET",
      farmAddress: "0xbdEE3F788a5efDdA1FcFe6bfe7DbbDa5690179e6"
    },
    "0x12c195768f65f282ea5f1b5c42755fbc910b0d8f": {
      name: "BEAR-HONEY",
      farmAddress: "0x1878eb1cA6Da5e2fC4B5213F7D170CA668A0E225"
    }
  }
};
