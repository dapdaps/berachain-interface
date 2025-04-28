import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getTokenLogo } from '@/sections/dashboard/utils';
import Big from 'big.js';
import { usePriceStore } from '@/stores/usePriceStore';
import { ethers } from 'ethers';
import { BERAPAW_MINT_ADDRESS } from '@/sections/vaults/v2/components/action/union/berapaw/config';
import {
  BERAPAW_APPROVE_ABI,
  BERAPAW_MINT_ABI,
  BERAPAW_VAULT_ABI
} from '@/sections/vaults/v2/components/action/union/berapaw/abi';
import useCustomAccount from '@/hooks/use-account';
import { TOKEN_ABI } from '@/hooks/use-token-balance';
import { multicall } from '@/utils/multicall';
import multicallAddresses from '@/configs/contract/multicall';
import { DEFAULT_CHAIN_ID } from '@/configs';

export function useBerapaw(props: any) {
  const { vaults, name } = props;

  const prices = usePriceStore((store) => store.price);
  const { account, provider } = useCustomAccount();
  const signer = provider?.getSigner();

  const { host, query } = vaults;
  const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

  const [pageIndex, setPageIndex] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  console.log('useBerapaw props: %o', props);

  const getPercentual = (vaults: any) => {
    return new Promise((resolve) => {
      const calls = vaults.map((it: any) => ({
        address: BERAPAW_MINT_ADDRESS,
        name: "bribeBack",
        params: [it.vaultAddress]
      }));
      multicall({
        abi: BERAPAW_MINT_ABI,
        calls,
        options: {},
        multicallAddress,
        provider: signer,
      }).then((res: any) => {
        if (res && res.length) {
          resolve(res.map((it: any, idx: number) => {
            if (!it) return "0";
            return ethers.utils.formatUnits(it.percentual || "0", 18);
          }));
          return;
        }
        resolve([]);
      }).catch((err: any) => {
        console.log("approved error: %o", err);
        resolve([]);
      });
    });
  };

  const getEarnedAmount = (vaults: any) => {
    return new Promise((resolve) => {
      const calls = vaults.map((it: any) => ({
        address: it.vaultAddress,
        name: "earned",
        params: [account]
      }));
      multicall({
        abi: BERAPAW_VAULT_ABI,
        calls,
        options: {},
        multicallAddress,
        provider: signer,
      }).then((res: any) => {
        if (res && res.length) {
          resolve(res.map((it: any, idx: number) => {
            if (!it) return "0";
            return ethers.utils.formatUnits(it[0] || "0", 18);
          }));
          return;
        }
        resolve([]);
      }).catch((err: any) => {
        console.log("approved error: %o", err);
        resolve([]);
      });
    });
  };

  const getApproved = (vaults: any) => {
    return new Promise((resolve) => {
      const calls = vaults.map((it: any) => ({
        address: it.vaultAddress,
        name: "operator",
        params: [account]
      }));
      multicall({
        abi: BERAPAW_APPROVE_ABI,
        calls,
        options: {},
        multicallAddress,
        provider: signer,
      }).then((res: any) => {
        if (res && res.length) {
          resolve(res.map((it: any, idx: number) => {
            if (!it) return false;
            return it[0] === BERAPAW_MINT_ADDRESS;
          }));
          return;
        }
        resolve([]);
      }).catch((err: any) => {
        console.log("approved error: %o", err);
        resolve([]);
      });
    });
  };

  const getBalance = async (vaults: any) => {
    return new Promise((resolve) => {
      const balanceCalls = vaults.map((it: any) => ({
        address: it.stakingToken?.address,
        name: "balanceOf",
        params: [account]
      }));
      multicall({
        abi: TOKEN_ABI,
        calls: balanceCalls,
        options: {},
        multicallAddress,
        provider
      }).then((res: any) => {
        if (res && res.length) {
          resolve(res.map((it: any, idx: number) => {
            if (!it) return "0";
            return ethers.utils.formatUnits(it.balance || "0", vaults[idx].stakingToken?.decimals || 18);
          }));
          return;
        }
        resolve([]);
      }).catch((err: any) => {
        console.log("balanceOf error: %o", err);
        resolve([]);
      });
    });
  };

  const { data, runAsync, loading } = useRequest(async (_pageIndex?: number) => {
    const __pageIndex = typeof _pageIndex === "undefined" ? pageIndex : _pageIndex;

    try {
      const res = await axios.post(host, query({ pageSize: 10, skip: (__pageIndex - 1) * 10 }));
      if (res.status !== 200 || !res.data.data?.polGetRewardVaults?.vaults) {
        return [];
      }
      const { vaults, pagination } = res.data.data.polGetRewardVaults;
      const { LBGT: LBGTPrice = 1, BERA: BERAPrice = 1 } = prices;

      const allPercentual: any = await getPercentual(vaults);
      const allEarnedAmount: any = await getEarnedAmount(vaults);
      const allBalances: any = await getBalance(vaults);
      const allApproved: any = await getApproved(vaults);

      for (let i = 0; i < vaults.length; i++) {
        const it = vaults[i];
        const underlyingTokens = it.activeIncentives?.map((incentive: any) => ({
          ...incentive.token,
          icon: getTokenLogo(incentive.token?.symbol),

        })) ?? [];
        // const percentual = await getPercentual(it.vaultAddress);
        // console.log('rewardVault[%s] percentual: %o', it.vaultAddress, percentual);
        it.underlyingTokens = underlyingTokens;
        // LBGT APR：=BGT APR × Price × (1 − BribeBack Percentual)
        // Price= LBGT price / bera price
        // BribeBack Percentual = mint bribeBack percentual / 1e18
        it.LBGTApr = Big(it.dynamicData?.apr || 0).times(Big(LBGTPrice).div(BERAPrice)).times(Big(1).minus(allPercentual[i] || 0));
        it.estimateMintAmount = Big(allEarnedAmount[i] || 0).times(Big(1).minus(allPercentual[i] || 0));
        it.approved = allApproved[i] || false;
        it.positionAmount = allBalances[i] || "0";
      }
      setPageIndex(__pageIndex);
      setPageTotal(Math.ceil(Big(pagination?.totalCount || 0).div(10).toNumber()));
      return vaults.sort((a: any, b: any) => Big(a.dynamicData?.apr || 0).minus(Big(b?.dynamicData?.apr || 0)));
    } catch (err: any) {
      console.log("get berapaw vaults failed: %o", err);
    }
    return [];
  }, { manual: true });

  useEffect(() => {
    if (!name || name !== "BeraPaw") return;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      runAsync();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [name, account, provider]);

  return {
    loading,
    dataList: data,
    getDataList: runAsync,
    pageIndex,
    pageTotal,
  };
}
