import { beraB } from '../tokens/bera-bArtio';

export default {
  name: 'BEX',
  icon: '/images/dapps/bex.png',
  defaultInputCurrency: beraB['bera'],
  tokens: {
    80084: [
      beraB['bera'],
      beraB['wbera'],
      beraB['honey'],
      beraB['usdt'],
      beraB['usdc'],
      beraB['dai']
    ]
  }
};
