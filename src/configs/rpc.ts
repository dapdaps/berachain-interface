export const RPC_LIST: any = {
  default: {
    url: "https://bartio.rpc.berachain.com",
    simpleName: "bartio rpc"
  },
  nodeinfra: {
    url: "https://bera-testnet.nodeinfra.com",
    simpleName: "node infra"
  },
  drpc: {
    url: "https://bartio.drpc.org",
    simpleName: "drpc rpc"
  }
};

export enum RpcStatus {
  Fast = "FAST",
  Slow = "SLOW",
  Stop = "STOP"
}

export const RPC_TIMEOUT = 8000;

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
