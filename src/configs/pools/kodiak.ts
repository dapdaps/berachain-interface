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
  name: 'Kodiak'
};
