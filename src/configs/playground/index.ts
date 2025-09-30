interface Game {
  name: string;
  path: string;
}

enum GameName {
  LuckyBera = "LuckyBera",
  BigWheel = "BigWheel",
  Magician = "Magician",
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
  [GameName.Magician]: {
    name: "Magician",
    path: "/carnival/magician",
  },
};
