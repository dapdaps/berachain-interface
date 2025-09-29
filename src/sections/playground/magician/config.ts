export enum EMove {
  Bear = 0,
  Rabbit = 1,
  Panda = 2,
}

export interface IMove {
  name: string;
  avatar: string;
  imgWhite: string;
  imgYellow: string;
  value: EMove;
}

export const Moves: Record<EMove, IMove> = {
  [EMove.Bear]: {
    name: "Bear",
    avatar: "/images/playground/magician/bear.png",
    imgWhite: "/images/playground/magician/bear-white-border.png",
    imgYellow: "/images/playground/magician/bear-yellow-border.png",
    value: EMove.Bear,
  },
  [EMove.Rabbit]: {
    name: "Rabbit",
    avatar: "/images/playground/magician/rabbit.png",
    imgWhite: "/images/playground/magician/rabbit-white-border.png",
    imgYellow: "/images/playground/magician/rabbit-yellow-border.png",
    value: EMove.Rabbit,
  },
  [EMove.Panda]: {
    name: "Panda",
    avatar: "/images/playground/magician/panda.png",
    imgWhite: "/images/playground/magician/panda-white-border.png",
    imgYellow: "/images/playground/magician/panda-yellow-border.png",
    value: EMove.Panda,
  },
};

export const RPS_MIN_BET_AMOUNT = 1; // minBetAmount

export interface Player {
  address: string;
  moves: EMove;
  tx_hash: string;
  tx_time: number;
}

export enum Status {
  Ongoing = 1,
  Joined = 2,
  Won = 3,
  Canceled = 4,
}

export enum ContractStatus {
  Ongoing = 1,
  Won = 2,
  ReadyForAdminReveal = 3,
  Pending = 4,
}

export interface Room {
  address: string;
  room_id: number;
  bet_amount: string;
  create_tx_hash: string;
  end_tx_hash: string;
  create_time: number;
  status: Status;
  winner_address: string;
  players: Player[];
}


export const PlayerAvatars: Record<string, string> = {
  "0": "/images/playground/magician/avatar-player-0.png",
  "1": "/images/playground/magician/avatar-player-1.png",
  "2": "/images/playground/magician/avatar-player-2.png",
  "3": "/images/playground/magician/avatar-player-3.png",
  "4": "/images/playground/magician/avatar-player-4.png",
  "5": "/images/playground/magician/avatar-player-5.png",
  "6": "/images/playground/magician/avatar-player-6.png",
  "7": "/images/playground/magician/avatar-player-7.png",
  "8": "/images/playground/magician/avatar-player-8.png",
  "9": "/images/playground/magician/avatar-player-9.png",
};

export const EmptyPlayer = "0x0000000000000000000000000000000000000000";
