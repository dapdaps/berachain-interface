import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
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
import { useAction } from '@/sections/vaults/v2/components/action/union/berapaw/use-action';
import useIsMobile from '@/hooks/use-isMobile';

const pageSize = 10;

export function useBerapaw(props: any) {
  const { vaults, name } = props;

  const prices = usePriceStore((store) => store.price);
  const { account, provider } = useCustomAccount();
  const signer = useMemo(() => {
    return provider?.getSigner(account);
  }, [provider, account]);
  const isMobile = useIsMobile();

  const { host, query } = vaults ?? {};
  const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

  const [pageIndex, setPageIndex] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  const [currentVault, setCurrentVault] = useState<any>();
  const [maxAPR, setMaxAPR] = useState<any>();

  const {
    onApprove,
    approving,
    approved,
    onMint,
    minting,
  } = useAction({
    rewardVault: currentVault?.vaultAddress,
  });

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

  const { data: totalData, runAsync: getTotalData, loading: totalDataLoading } = useRequest(async () => {
    try {
      const res = await axios.post(host, query({ pageSize: 300 }));
      if (res.status !== 200 || !res.data.data?.polGetRewardVaults?.vaults) {
        return [];
      }
      const { vaults: _vaults, pagination } = res.data.data.polGetRewardVaults;
      setPageTotal(Math.ceil(Big(pagination?.totalCount || 0).div(pageSize).toNumber()));

      return _vaults.sort((a: any, b: any) => Big(b.dynamicData?.apr || 0).minus(Big(a.dynamicData?.apr || 0)));
    } catch (err: any) {
      console.log("get berapaw vaults failed: %o", err);
    }
    return [];
  }, { manual: true });

  const [totalTVL, maxBgtAPRVault] = useMemo<any[]>(() => {
    if (!totalData) return ["0", "0"];
    let _maxBgtAPRVault;
    totalData.reduce((acc: any, it: any) => {
      if (Big(acc).lt(Big(it.dynamicData?.apr || 0).times(100))) {
        _maxBgtAPRVault = it;
        return Big(it.dynamicData?.apr || 0).times(100);
      }
      return Big(acc);
    }, 0);
    return [
      totalData.reduce((acc: any, it: any) => {
        return Big(acc).plus(Big(it.dynamicData?.tvl || 0))
      }, 0),
      _maxBgtAPRVault
    ];
  }, [totalData]);

  const { data, runAsync, loading } = useRequest(async (_pageIndex?: number) => {
    const __pageIndex = typeof _pageIndex === "undefined" ? pageIndex : _pageIndex;

    const { LBGT: LBGTPrice = 1, BERA: BERAPrice = 1 } = prices;

    const pageData = totalData.slice(isMobile ? 0 : (__pageIndex - 1) * pageSize, __pageIndex * pageSize);

    const allPercentual: any = await getPercentual(pageData);
    const allEarnedAmount: any = await getEarnedAmount(pageData);
    const allBalances: any = await getBalance(pageData);
    const allApproved: any = await getApproved(pageData);

    for (let i = 0; i < pageData.length; i++) {
      const it = pageData[i];
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

    return pageData.sort((a: any, b: any) => {
      if (isMobile) {
        return Big(b.dynamicData?.apr || 0).minus(Big(a.dynamicData?.apr || 0));
      }
      return Big(a.dynamicData?.apr || 0).minus(Big(b.dynamicData?.apr || 0));
    });
  }, { manual: true });

  const handleAction = async (record: any, type: any) => {
    setCurrentVault(record);
    if (type === "mint") {
      if (minting) return;
      const res = await onMint({ rewardVault: record.vaultAddress });
      if (res?.success) {
        runAsync();
      }
      return;
    }
    if (type === "approve") {
      if (approving) return;
      const res = await onApprove({ rewardVault: record.vaultAddress });
      if (res) {
        runAsync();
      }
    }
  };

  useEffect(() => {
    if (!name || name !== "BeraPaw") return;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      getTotalData();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [name, account, provider]);

  useEffect(() => {
    runAsync();
  }, [totalData]);

  useEffect(() => {
    if (!maxBgtAPRVault) return;
    const { LBGT: LBGTPrice = 1, BERA: BERAPrice = 1 } = prices;
    getPercentual([maxBgtAPRVault]).then((allPercentual: any) => {
      setMaxAPR(
        Big(maxBgtAPRVault.dynamicData?.apr || 0).times(100).times(Big(LBGTPrice).div(BERAPrice)).times(Big(1).minus(allPercentual[0] || 0))
      )
    });
  }, [maxBgtAPRVault, prices]);

  return {
    loading: loading || totalDataLoading,
    dataList: data,
    getDataList: (_pageIndex?: number) => {
      if (typeof _pageIndex !== "undefined") {
        runAsync(_pageIndex);
        return;
      }
      getTotalData();
    },
    pageIndex,
    pageTotal,
    handleAction,
    approving,
    minting,
    currentVault,
    totalTVL,
    maxAPR,
  };
}
