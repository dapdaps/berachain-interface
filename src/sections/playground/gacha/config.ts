import { IS_PRODUCTION } from "@/configs";

export interface GachaTabConfig {
  id: string;
  label: string;
  playByCost?: string;
  probabilities?: {
    name: string;
    probability: string;
  }[];
  value: number;
  tier: number;
}

export const NFTS = [
  {
    address: IS_PRODUCTION ?  "0x88888888a9361f15aadbaca355a6b2938c6a674e" : "0x42aa0a426BD85bF28c1BF619bf57B4eA3C0aeF43",
    name: "Steady Teddy",
    icon: "/images/treasure-book/reward/nft-steady-teddy.png",
    probabilities: [
      { percentage: "0.02", value: 1 },
      { percentage: "1", value: 20 },
      { percentage: "4.16", value: 50 }
    ],
    total: 20
  },
  {
    address: IS_PRODUCTION ? "0x6666397dfe9a8c469bf65dc744cb1c733416c420" : "0x11c57957Ba6dA00bFcECB9AA0059bc0a7Df08fFb",
    name: "Mibera Maker",
    icon: "/images/treasure-book/reward/nft-mibera.png",
    probabilities: [
      { percentage: "0.1", value: 1 },
      { percentage: "4", value: 20 },
      { percentage: "47.92", value: 50 }
    ],
    total: 20
  },
  {
    address: IS_PRODUCTION ? "0x333814f5e16eee61d0c0b03a5b6abbd424b381c2" : "0x11312822E0E6C508541d153d540c62ffebB09e1F",
    name: "Bullas",
    icon: "/images/treasure-book/reward/nft-bullas.png",
    probabilities: [
      { percentage: "4", value: 20 },
      { percentage: "47.92", value: 50 }
    ],
    total: 20
  }
];
export const GACHA_TABS: GachaTabConfig[] = [
  {
    id: "bera-dream",
    label: "1 Bera Dream",
    playByCost: "1 BERA",
    value: 1,
    tier: 0,
    probabilities: [
      { name: "Steady Teddy", probability: "0.02%" },
      { name: "Mibera", probability: "0.1%" },
      { name: "5 BERA", probability: "1%" },
      { name: "0.5 BERA", probability: "40%" },
      { name: "0.05 BERA", probability: "58.88%" }
    ]
  },
  {
    id: "standard-gacha",
    label: "Standard Gacha",
    playByCost: "20 BERA",
    value: 20,
    tier: 1,
    probabilities: [
      { name: "Steady Teddy", probability: "1%" },
      { name: "Mibera", probability: "4%" },
      { name: "Bullas", probability: "4%" },
      { name: "16.9 BERA", probability: "60%" },
      { name: "6.9 BERA", probability: "31%" }
    ]
  },
  {
    id: "guaranteed-nft",
    label: "Guaranteed NFT",
    playByCost: "50 BERA",
    value: 50,
    tier: 2,
    probabilities: [
      { name: "Steady Teddy", probability: "4.17%" },
      { name: "Mibera", probability: "47.92%" },
      { name: "Bullas", probability: "47.92%" }
    ]
  }
];

export const GACHA_CONTRACT_ADDRESS =
  "0x2c9306C73dBe1b9e33fcC2C28A98c98B6713b786";

export const TOKEN_MAP: Record<string, string> = {
  '0x0000000000000000000000000000000000000000': "/assets/tokens/bera.svg",
  ...NFTS.reduce((acc, nft) => {
    acc[nft.address.toLowerCase()] = nft.icon;
    return acc;
  }, {} as Record<string, string>),
};
