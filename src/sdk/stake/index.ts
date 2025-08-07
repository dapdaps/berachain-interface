import { stake as bexStake, unStake as bexUnstake, quote as bexQuote, getApr as bexGetApr, getWithdrawalRequests as bexGetWithdrawalRequests, withdraw as bexWithdraw } from "./bex";

export async function stake(dexType: string, params: any) {
    console.log("stake", dexType, params);

    switch (dexType.toLowerCase()) {
        case "bex":
            return bexStake(params);
        default:
            return null;
    }
  }
  
  export async function unstake(dexType: string, params: any) {
    switch (dexType.toLowerCase()) {
        case "bex":
            return bexUnstake(params);
        default:
            return null;
    }
  }
  
  export async function quote(dexType: string, params: any) {
    switch (dexType.toLowerCase()) {
        case "bex":
            return bexQuote(params);
        default:
            return null;
    }
  }

  export async function getApr(dexType: string, params: any) {

    switch (dexType.toLowerCase()) {
        case "bex":
            return bexGetApr(params);
        default:
            return null;
    }
  }

  export async function getWithdrawalRequests(dexType: string, params: any) {
    switch (dexType.toLowerCase()) {
        case "bex":
            return bexGetWithdrawalRequests(params);
        default:
            return null;
    }
  }

  export async function withdraw(dexType: string, params: any) {
    switch (dexType.toLowerCase()) {
        case "bex":
            return bexWithdraw(params);
        default:
            return null;
    }
  }