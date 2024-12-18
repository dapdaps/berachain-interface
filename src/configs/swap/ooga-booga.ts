import { beraB } from '../tokens/bera-bArtio';

export default {
  name: 'Ooga Booga',
  icon: '/images/dapps/ooga-booga.svg',
  path: '/dex/ooga-booga',
  defaultInputCurrency: beraB['bera'],
  tokens: {
    80084: [
      beraB['bera'],
      beraB['wbera'],
      beraB['honey'],
      beraB['usdt'],
      beraB['usdc'],
      beraB['dai'],
      beraB['yeet'],
      beraB['paw'],
    ]
  }
};
