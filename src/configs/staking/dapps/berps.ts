import { beraB } from "@/configs/tokens/bera-bArtio";

export default {
  name: "Berps",
  icon: "/images/dapps/infrared/berps.svg",
  path: "/staking/berps?id=BHONEY",
  chains: {
    80094: {
      description:
        "Deposit HONEY in exchange for bHONEY, stakers receive fees from each trade placed on the platform. bHONEY Accumulates these fees in real-time.",
      pairs: [
        // {
        //   id: 'BHONEY',
        //   strategy: 'Dynamic',
        //   strategy2: '',
        //   tokens: ['bHONEY'],
        //   images: ['/images/dapps/infrared/bhoney.svg'],
        //   decimals: 18,
        //   decimals0: 18,
        //   decimals1: 18,
        //   LP_ADDRESS: '0x1306d3c36ec7e38dd2c128fbe3097c2c2449af64',
        //   depositToken: beraB.honey,
        //   withdrawToken: beraB.bhoney
        // },
      ]
    }
  }
};
