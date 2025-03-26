export enum ACTION_TYPE {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

export interface ActionType {
  button: string;
  title: string;
  value: ACTION_TYPE;
}

export const ActionTypes: Record<ACTION_TYPE, ActionType> = {
  [ACTION_TYPE.DEPOSIT]: {
    title: "Deposit Vaults",
    button: "Deposit",
    value: ACTION_TYPE.DEPOSIT
  },
  [ACTION_TYPE.WITHDRAW]: {
    title: "Withdraw Vaults",
    button: "Withdraw",
    value: ACTION_TYPE.WITHDRAW
  }
};

export enum ORDER_KEYS {
  TVL = "tvl",
  APY = "apy",
  YOURS = "yours"
}

export enum ORDER_DIRECTION {
  ASC = "asc",
  DESC = "desc"
}

export const OrderKeys: Record<
  ORDER_KEYS,
  { label: string; value: ORDER_KEYS }
> = {
  [ORDER_KEYS.TVL]: {
    label: "TVL",
    value: ORDER_KEYS.TVL
  },
  [ORDER_KEYS.APY]: {
    label: "APY",
    value: ORDER_KEYS.APY
  },
  [ORDER_KEYS.YOURS]: {
    label: "Yours",
    value: ORDER_KEYS.YOURS
  }
};

export const StrategyPool = {
  tokens: [
    {
      icon: "/assets/tokens/wbera.png",
      symbol: "WBERA",
      decimals: 18,
      address: "0x6969696969696969696969696969696969696969"
    },
    {
      icon: "/assets/tokens/honey.svg",
      symbol: "HONEY",
      decimals: 18,
      address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce"
    }
  ],
  protocol: "Bex",
  lpProtocol: "Bex",
  token: {
    symbol: "WBERA-HONEY",
    address: "0x2c4a603a2aa5596287a06886862dc29d56dbc354",
    decimals: 18
  },
  vaultAddress: "0xc2baa8443cda8ebe51a640905a8e6bc4e1f9872c",
  id: "0x2c4a603a2aa5596287a06886862dc29d56dbc354000200000000000000000002",
  poolType: "WEIGHTED"
};
