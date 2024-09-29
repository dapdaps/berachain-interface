import { beraB } from '@/configs/tokens/bera-bArtio';

const basic = {
  name: 'Kodiak',
  logo: ''
};
const networks = {
  80084: {
    defaultCurrencies: {
      input: beraB['bera'],
      output: beraB['honey']
    },
    tokens: [
      beraB['bera'],
      beraB['wbera'],
      beraB['honey'],
      beraB['usdt'],
      beraB['usdc'],
      beraB['dai'],
      beraB['wbtc'],
      beraB['weth']
    ]
  }
};

export { basic, networks };
