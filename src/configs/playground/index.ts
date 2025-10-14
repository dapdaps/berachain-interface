interface Game {
  name: string;
  path: string;
}

enum GameName {
  LuckyBera = "LuckyBera",
  BigWheel = "BigWheel",
  GuessWho = "GuessWho",
}

export const Games: Record<GameName, Game> = {
  [GameName.LuckyBera]: {
    name: "LuckyBera",
    path: "/carnival/lucky-bera",
  },
  [GameName.BigWheel]: {
    name: "BigWheel",
    path: "/carnival/big-wheel",
  },
  [GameName.GuessWho]: {
    name: "GuessWho",
    path: "/carnival/guess-who",
  },
};

export const GameLootbox: Record<string, { category: string; name: string; imgBox: string; imgBoxOpen: string; img: string; }> = {
  "SteadyTeddy": {
    category: "SteadyTeddy",
    name: "Steady Teddy",
    img: "/images/playground/magician/guess-1.png",
    imgBox: "/images/playground/magician/lootbox/box-steady-teddy.png",
    imgBoxOpen: "/images/playground/magician/lootbox/box-steady-teddy-open.png",
  },
  "Bullas": {
    category: "Bullas",
    name: "Bullas",
    img: "/images/playground/magician/guess-2.png",
    imgBox: "/images/playground/magician/lootbox/box-bullas.png",
    imgBoxOpen: "/images/playground/magician/lootbox/box-bullas-open.png",
  },
  "Mibera": {
    category: "Mibera",
    name: "Mibera",
    img: "/images/playground/magician/guess-3.png",
    imgBox: "/images/playground/magician/lootbox/box-mibera.png",
    imgBoxOpen: "/images/playground/magician/lootbox/box-mibera-open.png",
  },
  "Henlo": {
    category: "Henlo",
    name: "Henlo",
    img: "/images/playground/magician/nft-henlo.png",
    imgBox: "/images/playground/magician/lootbox/box-henlo.png",
    imgBoxOpen: "/images/playground/magician/lootbox/box-henlo-open.png",
  },
};
