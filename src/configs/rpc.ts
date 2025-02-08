export const RPC_LIST: any = {
  default: {
    url: "https://rpc.berachain.com",
    simpleName: "bera rpc"
  }
};

export enum RpcStatus {
  Fast = "FAST",
  Slow = "SLOW",
  Stop = "STOP"
}

export const RPC_TIMEOUT = 10000;

export const RPC_STATUS: Record<
  RpcStatus,
  { color: string; lt: number; gte: number }
> = {
  FAST: {
    color: "#57DB64",
    lt: 500,
    gte: 0
  },
  SLOW: {
    color: "#FFAA27",
    gte: 500,
    lt: 2000
  },
  STOP: {
    color: "#FF547D",
    gte: 2000,
    lt: RPC_TIMEOUT
  }
};
