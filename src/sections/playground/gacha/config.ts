export interface GachaTabConfig {
  id: string;
  label: string;
  playByCost?: string;
  probabilities?: {
    name: string;
    probability: string;
  }[];
}

export const GACHA_TABS: GachaTabConfig[] = [
  {
    id: "bera-dream",
    label: "1 Bera Dream",
    playByCost: "1 BERA",
    probabilities: [
      { name: "Steady Teddy", probability: "0.02%" },
      { name: "Mibera", probability: "0.1%" },
      { name: "5 BERA", probability: "1%" },
      { name: "0.5 BERA", probability: "40%" },
      { name: "0.05 BERA", probability: "58.88%" },
    ],
  },
  {
    id: "standard-gacha",
    label: "Standard Gacha",
    playByCost: "20 BERA",
    probabilities: [
      { name: "Steady Teddy", probability: "1%" },
      { name: "Mibera", probability: "4%" },
      { name: "Bullas", probability: "4%" },
      { name: "16.9 BERA", probability: "60%" },
      { name: "6.9 BERA", probability: "31%" },
    ],
  },
  {
    id: "guaranteed-nft",
    label: "Guaranteed NFT",
    playByCost: "50 BERA",
    probabilities: [
      { name: "Steady Teddy", probability: "4.17%" },
      { name: "Mibera", probability: "47.92%" },
      { name: "Bullas", probability: "47.92%" },
    ],
  },
];

