import bex from '../swap/bex';

const contracts: { [key: number]: any } = {
  80094: {
    CrocSwapDex: '0xAB827b1Cc3535A9e549EE387A6E9C3F02F481B49',
    CrocQuery: '0x8685CE9Db06D40CBa73e3d09e6868FE476B5dC89'
  }
};
const tokens = bex.tokens;

export default {
  contracts,
  tokens,
  graph: {
    80094:
      'https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/bgt-subgraph/v1000000/gn'
  },
  officalSite: '/dex/bex/pools',
  name: 'BEX'
};
