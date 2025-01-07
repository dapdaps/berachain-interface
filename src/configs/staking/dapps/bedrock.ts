import { beraB } from '@/configs/tokens/bera-bArtio';
export default {
  name: 'Bedrock',
  icon: '/images/dapps/bedrock.svg',
  type: 'Vaults',
  chains: {
    80084: {
      STAKE_ADDRESS: '0x97e16DB82E089D0C9c37bc07F23FcE98cfF04823',
      sourceToken: beraB["wbtc"],
      targetToken: beraB["unibtc"]
    }
  }
};