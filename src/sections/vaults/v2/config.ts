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
