import kodiak from '../swap/kodiak';

const contracts: { [key: number]: any } = {
  80084: {
    FactoryV2: '0xb08Bfed214ba87d5d5D07B7DA573010016C44488',
    RouterV2: '0x406846114B2A9b65a8A2Ab702C2C57d27784dBA2',
    FactoryV3: '0x217Cd80795EfCa5025d47023da5c03a24fA95356',
    PositionManager: '0xc0568c6e9d5404124c8aa9efd955f3f14c8e64a6'
  }
};
const tokens = kodiak.tokens;

export default {
  contracts,
  tokens,
  officalSite:
    'https://app.kodiak.finance/#/liquidity/islands?chain=berachain_bartio',
  name: 'Kodiak',
  graph: {
    80084:
      'https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v2-berachain-bartio/latest/gn'
  },
  islands: [
    '0xac9effd9dd4e1c3c617722d4aa85ede22fe6cae7',
    '0x1afad44af831703f78ce36ad917f1983ea4c488f',
    '0x774f934a4b1d1d251dcee75a3ea32d69b379a573',
    '0x9d277905376fc238a19106812cefda1eb57ded91',
    '0x15d5696803034179fca3abedfbf6878d98eb2bc0',
    '0x51d39e958a0d0b855b55ad5648f842ab4d8467a7',
    '0x9d277905376fc238a19106812cefda1eb57ded91',
    '0x15d5696803034179fca3abedfbf6878d98eb2bc0',
    '0x51d39e958a0d0b855b55ad5648f842ab4d8467a7',
    '0x12c195768f65f282ea5f1b5c42755fbc910b0d8f',
    '0xb73dee52f38539ba854979eab6342a60dd4c8c03',
    '0x63b0edc427664d4330f72eec890a86b3f98ce225',
    '0xe5a2ab5d2fb268e5ff43a5564e44c3309609aff9',
    '0x1afe9c399b40a65c783049e732d7ad5d37e68f78',
    '0x74e852a4f88bfbeff01275bb95d5ed77f2967d12',
    '0x78f87aa41a4c32a619467d5b36e0319f3eaf2da2',
    '0xbfbefcfae7a58c14292b53c2ccd95bf2c5742eb0',
    '0x7fd165b73775884a38aa8f2b384a53a3ca7400e6',
    '0x03bccf796cdef61064c4a2effdd21f1ac8c29e92',
    '0xb67d60fc02e0870eddca24d4fa8ea516c890152b'
  ]
};
