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
