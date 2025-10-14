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
  imgHands: string;
  imgYellowY: number;
  imgYellowRotate: number;
  value: EMove;
}

export const Moves: Record<EMove, IMove> = {
  [EMove.Bear]: {
    name: "Bear",
    avatar: "/images/playground/magician/guess-1-white-border.png",
    imgWhite: "/images/playground/magician/guess-1-white-border.png",
    imgYellow: "/images/playground/magician/guess-1-yellow-border.png",
    imgHands: "/images/playground/magician/guess-1-hands.png",
    imgYellowY: -91,
    imgYellowRotate: 0,
    value: EMove.Bear,
  },
  [EMove.Rabbit]: {
    name: "Rabbit",
    avatar: "/images/playground/magician/guess-2-white-border.png",
    imgWhite: "/images/playground/magician/guess-2-white-border.png",
    imgYellow: "/images/playground/magician/guess-2-yellow-border.png",
    imgHands: "/images/playground/magician/guess-2-hands.png",
    imgYellowY: -90,
    imgYellowRotate: 1,
    value: EMove.Rabbit,
  },
  [EMove.Panda]: {
    name: "Panda",
    avatar: "/images/playground/magician/guess-3-white-border.png",
    imgWhite: "/images/playground/magician/guess-3-white-border.png",
    imgYellow: "/images/playground/magician/guess-3-yellow-border.png",
    imgHands: "/images/playground/magician/guess-3-hands.png",
    imgYellowY: -89.5,
    imgYellowRotate: 0,
    value: EMove.Panda,
  },
};

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

export const StatusMap: Record<Status, { name: string; color: string; }> = {
  [Status.Ongoing]: {
    name: "Waiting...",
    color: "#7EA82B",
  },
  [Status.Joined]: {
    name: "Waiting...",
    color: "#7EA82B",
  },
  [Status.Won]: {
    name: "Winner",
    color: "#000",
  },
  [Status.Canceled]: {
    name: "Closed",
    color: "#857B7B",
  },
};

export enum ContractStatus {
  // Open
  Ongoing = 1,
  // Closed
  Won = 2,
  // ReadyForAdminReveal
  ReadyForAdminReveal = 3,
  // PendingReveal
  Pending = 4,
}

export const ContractStatus2Status: Record<ContractStatus, Status> = {
  [ContractStatus.Ongoing]: Status.Ongoing,
  [ContractStatus.Won]: Status.Won,
  [ContractStatus.ReadyForAdminReveal]: Status.Joined,
  [ContractStatus.Pending]: Status.Ongoing,
};

export enum WinnerStatus {
  WinnerPlayerA = 1,
  WinnerPlayerB = 2,
  WinnerPlayerC = 3,
  UnusedRoomClosed = 4,
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
  winner_moves: number;
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

export enum HistoryAction {
  Create = "rpsCreate",
  Join = "rpsJoin",
  Refund = "rpsCancel",
  Won = "rpsPayOut",
}

export const HistoryActionMap: Record<HistoryAction, { name: string; isIncome?: boolean; }> = {
  [HistoryAction.Create]: {
    name: "Create room",
  },
  [HistoryAction.Join]: {
    name: "Play",
  },
  [HistoryAction.Refund]: {
    name: "Refund",
    isIncome: true,
  },
  [HistoryAction.Won]: {
    name: "Cash out",
    isIncome: true,
  },
};

// -10%
export const ClaimRefundFee = 0;
