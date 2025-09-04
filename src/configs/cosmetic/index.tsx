export enum CosmeticCategory {
  Hats = "hats",
  Jackets = "jackets",
  Cars = "cars",
  Necklaces = "necklaces",
}

export interface Cosmetic {
  level: number;
  category: CosmeticCategory;
  name: string;
  img: string;
  img_not_owned: string;
  style?: React.CSSProperties;
  styleNotOwned?: React.CSSProperties;
}

export const CosmeticsList: Cosmetic[] = [
  // cars
  {
    level: 1,
    category: CosmeticCategory.Cars,
    name: "Bicycle",
    img: "/images/cave/key/key-1-1.png",
    img_not_owned: "/images/cave/key/key-1.png",
    style: {
      left: 70,
      top: 60,
    },
  },
  {
    level: 2,
    category: CosmeticCategory.Cars,
    name: "Scooter",
    img: "/images/cave/key/key-2-2.png",
    img_not_owned: "/images/cave/key/key-2.png",
    style: {
      left: 137,
      top: 54,
    },
  },
  {
    level: 3,
    category: CosmeticCategory.Cars,
    name: "Motobike",
    img: "/images/cave/key/key-3-3.png",
    img_not_owned: "/images/cave/key/key-3.png",
    style: {
      left: 204,
      top: 46,
    },
  },
  {
    level: 4,
    category: CosmeticCategory.Cars,
    name: "Lambo",
    img: "/images/cave/key/key-4-4.png",
    img_not_owned: "/images/cave/key/key-4.png",
    style: {
      left: 272,
      top: 38,
    },
  },
  // hats
  {
    level: 1,
    category: CosmeticCategory.Hats,
    name: "HenloMascotHat",
    img: "/images/cave/hat/hat-1-1.png",
    img_not_owned: "/images/cave/hat/hat-1.png",
    style: {
      width: 125,
      transform: "translateY(10px)",
    },
  },
  {
    level: 2,
    category: CosmeticCategory.Hats,
    name: "RedSkiMask",
    img: "/images/cave/hat/hat-2-2.png",
    img_not_owned: "/images/cave/hat/hat-2.png",
    style: {
      width: 117,
    },
  },
  {
    level: 3,
    category: CosmeticCategory.Hats,
    name: "BullasMask",
    img: "/images/cave/hat/hat-3-3.png",
    img_not_owned: "/images/cave/hat/hat-3.png",
    style: {
      width: 120,
      transformOrigin: "top",
      transform: "scale(1.2) translateY(10px)",
    },
  },
  {
    level: 4,
    category: CosmeticCategory.Hats,
    name: "YellowSkiMask",
    img: "/images/cave/hat/hat-4-4.png",
    img_not_owned: "/images/cave/hat/hat-4.png",
    style: {
      width: 120,
      transformOrigin: "top",
      transform: "scale(1.2) translateY(1px)",
    },
    styleNotOwned: {
      width: 102,
    },
  },
  // coats
  {
    level: 1,
    category: CosmeticCategory.Jackets,
    name: "MiberaRaveTShirt",
    img: "/images/cave/clothing/cloth-1-1.png",
    img_not_owned: "/images/cave/clothing/cloth-1.png",
    style: {
      width: 102,
      transform: "translateY(10px) translateX(10px)",
    },
  },
  {
    level: 2,
    category: CosmeticCategory.Jackets,
    name: "MiberaBearKagi",
    img: "/images/cave/clothing/cloth-2-2.png",
    img_not_owned: "/images/cave/clothing/cloth-2.png",
    style: {
      width: 102,
    },
  },
  {
    level: 3,
    category: CosmeticCategory.Jackets,
    name: "coat1",
    img: "/images/cave/clothing/cloth-3-3.png",
    img_not_owned: "/images/cave/clothing/cloth-3.png",
    style: {
      width: 120,
    },
  },
  {
    level: 4,
    category: CosmeticCategory.Jackets,
    name: "coat2",
    img: "/images/cave/clothing/cloth-4-4.png",
    img_not_owned: "/images/cave/clothing/cloth-4.png",
    style: {
      width: 120,
    },
  },
];
