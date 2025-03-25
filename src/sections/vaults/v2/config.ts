export enum ACTION_TYPE {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export interface ActionType {
  button: string;
  title: string;
}

export const ActionTypes: Record<ACTION_TYPE, ActionType> = {
  [ACTION_TYPE.DEPOSIT]: {
    title: "Deposit Vaults",
    button: "Deposit",
  },
  [ACTION_TYPE.WITHDRAW]: {
    title: "Withdraw Vaults",
    button: "Withdraw",
  },
};

export enum ORDER_KEYS {
  TVL = 'tvl',
  APY = 'apy',
  YOURS = 'yours',
}

export enum ORDER_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export const OrderKeys: Record<ORDER_KEYS, {label: string;value:ORDER_KEYS;}> = {
  [ORDER_KEYS.TVL]: {
    label: "TVL",
    value: ORDER_KEYS.TVL,
  },
  [ORDER_KEYS.APY]: {
    label: "APY",
    value: ORDER_KEYS.APY,
  },
  [ORDER_KEYS.YOURS]: {
    label: "Yours",
    value: ORDER_KEYS.YOURS,
  },
}
