import { beraB } from '../tokens/bera-bArtio';

export default {
  name: 'Kodiak',
  icon: '/images/dapps/kodiak.svg',
  defaultInputCurrency: beraB['bera'],
  tokens: {
    80084: [
      beraB['bera'],
      beraB['wbera'],
      beraB['honey'],
      beraB['usdt'],
      beraB['usdc'],
      beraB['dai'],
      beraB['spepe']
    ]
  }
};
