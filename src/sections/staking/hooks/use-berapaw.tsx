import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getTokenLogo } from '@/sections/dashboard/utils';
import Big from 'big.js';
import { usePriceStore } from '@/stores/usePriceStore';
import { Contract, ethers, utils } from 'ethers';
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
import { useBeraPawContext } from '@/sections/staking/dapps/berapaw/context';
import { bera } from '@/configs/tokens/bera';
import Link from 'next/link';
import { trim } from 'lodash';

const pageSize = 9;
export const LPStakingWBERALBGTPoolAddress = "0x705fc16ba5a1eb67051934f2fb17eacae660f6c7";
export const LPStakingWBERALBGTVaultAddress = "0xa77dee7bc36c463bB3E39804c9C7b13427D712B0";

export function useBerapaw(props: any) {
  const { vaults, name } = props;

  const { currentTab } = useBeraPawContext();
  const prices = usePriceStore((store) => store.beraTownPrice);
  const { account, provider } = useCustomAccount();
  const signer = useMemo(() => {
    return provider?.getSigner(account);
  }, [provider, account]);
  const isMobile = useIsMobile();

  const timer1 = useRef<any>();
  const timer2 = useRef<any>();

  const { host, query } = vaults ?? {};
  const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

  const [pageIndex, setPageIndex] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  const [currentVault, setCurrentVault] = useState<any>();
  const [maxAPR, setMaxAPR] = useState<any>();
  const [orderBy, setOrderBy] = useState<any>("tvl");
  const [sort, setSort] = useState<any>("desc");
  const [search, setSearch] = useState<any>("");
  const [stakeModalVisible, setStakeModalVisible] = useState<boolean>(false);
  const [stakeModalData, setStakeModalData] = useState<any>();

  const {
    onApprove,
    approving,
    approved,
    onMint,
    minting,
    onStake,
    staking,
    onDeposit,
    depositing,
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
        address: it.vaultAddress,
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

  const getPoolTotalSupply = async (vaults: any) => {
    return new Promise((resolve) => {
      const calls = vaults.map((it: any) => ({
        address: it.stakingToken.address,
        name: "totalSupply",
        params: []
      }));
      multicall({
        abi: ABI,
        calls,
        options: {},
        multicallAddress,
        provider
      }).then((res: any) => {
        if (res && res.length) {
          resolve(res.map((it: any, idx: number) => {
            if (!it) return "0";
            return ethers.utils.formatUnits(it[0] || "0", vaults[idx].stakingToken?.decimals || 18);
          }));
          return;
        }
        resolve([]);
      }).catch((err: any) => {
        console.log("get PoolTotalSupply error: %o", err);
        resolve([]);
      });
    });
  };

  const { data: totalData, runAsync: getTotalData, loading: totalDataLoading } = useRequest(async () => {
    try {
      const { LBGT: LBGTPrice = 1, BERA: BERAPrice = 1 } = prices;
      const res = await axios.post(host, query({ pageSize: 300 }));
      if (res.status !== 200 || !res.data.data?.polGetRewardVaults?.vaults) {
        return [];
      }
      const { vaults: _vaults, pagination } = res.data.data.polGetRewardVaults;
      // let noMetadataVaults = 0;
      // _vaults = _vaults.filter((it: any) => {
      //   if (!it.metadata) {
      //     noMetadataVaults += 1;
      //     return false;
      //   }
      //   return true;
      // });
      // if (pagination?.totalCount) {
      //   pagination.totalCount -= noMetadataVaults;
      // }
      setPageTotal(Math.ceil(Big(pagination?.totalCount || 0).div(pageSize).toNumber()));

      const allPercentual: any = await getPercentual(_vaults);
      const allEarnedAmount: any = await getEarnedAmount(_vaults);
      const allBalances: any = await getBalance(_vaults);
      const allApproved: any = await getApproved(_vaults);
      const allPoolTotalSupply: any = await getPoolTotalSupply(_vaults);

      for (let i = 0; i < _vaults.length; i++) {
        const it = _vaults[i];
        it.type = "vaults";
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
        it.poolTotalSupply = allPoolTotalSupply[i] || 1;
        it.price = +it.poolTotalSupply > 0 ? Big(it.dynamicData?.tvl || 0).div(it.poolTotalSupply) : 0;
        it.positionAmountUsd = Big(it.positionAmount).times(it.price);
        it.stakingToken.icon = getTokenLogo(it.stakingToken?.symbol);
      }

      return _vaults;
    } catch (err: any) {
      console.log("get berapaw vaults failed: %o", err);
    }
    return [];
  }, { manual: true });

  const { data: vaultsData, runAsync: getVaultsData, loading: vaultsDataLoading } = useRequest(async (_pageIndex?: number) => {
    const __pageIndex = typeof _pageIndex === "undefined" ? pageIndex : _pageIndex;

    const sortedData = totalData.sort((a: any, b: any) => {
      if (orderBy === "tvl") {
        if (Big(a.dynamicData?.tvl || 0)[sort === "desc" ? "gt" : "lt"](Big(b.dynamicData?.tvl || 0))) return -1;
        if (Big(a.dynamicData?.tvl || 0)[sort === "desc" ? "lt" : "gt"](Big(b.dynamicData?.tvl || 0))) return 1;
        return 0;
      }
      if (orderBy === "apr") {
        if (Big(Big(a.LBGTApr || 0).plus(a.dynamicData?.apr || 0))[sort === "desc" ? "gt" : "lt"](Big(b.LBGTApr || 0).plus(b.dynamicData?.apr || 0))) return -1;
        if (Big(Big(a.LBGTApr || 0).plus(a.dynamicData?.apr || 0))[sort === "desc" ? "lt" : "gt"](Big(b.LBGTApr || 0).plus(b.dynamicData?.apr || 0))) return 1;
        return 0;
      }
      if (orderBy === "position") {
        if (Big(a.positionAmountUsd || 0)[sort === "desc" ? "gt" : "lt"](Big(b.positionAmountUsd || 0))) return -1;
        if (Big(a.positionAmountUsd || 0)[sort === "desc" ? "lt" : "gt"](Big(b.positionAmountUsd || 0))) return 1;
        return 0;
      }
      return 0;
    });
    const _search = trim(search || "").toLowerCase();
    const searchData = sortedData.filter((it: any) => {
      if (it.metadata?.name?.toLowerCase().includes(_search)) return true;
      if (it.stakingToken?.symbol?.toLowerCase().includes(_search)) return true;
      if (it.stakingToken?.address?.toLowerCase() === _search) return true;
      if (it.underlyingTokens?.some((token: any) => token.symbol?.toLowerCase().includes(_search) || token.address?.toLowerCase() === _search)) return true;
      return false;
    });
    const pageData = searchData.slice(isMobile ? 0 : (__pageIndex - 1) * pageSize, __pageIndex * pageSize);

    setPageIndex(__pageIndex);

    return pageData;
  }, { manual: true });

  const handleAction = async (record: any, type: any) => {
    setCurrentVault(record);
    if (type === "mint") {
      if (minting) return;
      const res = await onMint({ rewardVault: record.vaultAddress });
      if (res?.success) {
        getTotalData();
      }
      return;
    }
    if (type === "approve") {
      // 250604 Open a modal
      setStakeModalVisible(true);
      setStakeModalData(record);
    }
  };

  const handleApprove = async (record: any, opts?: { isReload?: boolean; }) => {
    const { isReload = true } = opts ?? {};
    if (approving) return false;
    const res = await onApprove({ rewardVault: record.vaultAddress });
    if (res) {
      if (isReload) {
        getTotalData();
        onStakeModalClose();
      }
      return true;
    }
    return false;
  };

  const handleStake = async (record: any, amount: string, type: "stake" | "deposit" = "stake") => {
    let res: any;
    if (type === "deposit") {
      if (depositing) return false;
      res = await onDeposit({ rewardVault: record.vaultAddress, amount, token: record.stakingToken });
    } else {
      if (staking) return false;
      res = await onStake({ rewardVault: record.vaultAddress, amount, token: record.stakingToken });
    }
    if (res) {
      getTotalData();
      onStakeModalClose();
      return true;
    }
    return false;
  };

  const onStakeModalClose = () => {
    setStakeModalVisible(false);
    setStakeModalData(null);
  };

  const { data: stakeData, runAsync: getStakeData, loading: stakeDataLoading } = useRequest(async () => {
    const LBGTStakingRewards = "0xF0422bC37f1d2D1B57596cCA5A64E30c71D10170";
    const BexVaultRouteAddress = "0x4be03f781c497a489e3cb0287833452ca9b9e80b";
    const LPStakingPoolContract = new Contract(LPStakingWBERALBGTPoolAddress, ABI, signer);
    const LPDecimals = await LPStakingPoolContract.callStatic.decimals();

    const _list: any = [
      {
        type: "stake",
        description: "Stake LBGT and autocompound boosted incentives and native fees.",
        pool_address: bera["lbgt"].address,
        vault_address: bera["stlbgt"].address,
        address: bera["stlbgt"].address,
        symbol: bera["stlbgt"].symbol,
        decimals: bera["stlbgt"].decimals,
        underlying_tokens: [
          { ...bera["lbgt"] },
        ],
        reward_tokens: [
          { ...bera["lbgt"] },
        ],
        token0: { ...bera["lbgt"] },
        stakingToken: { ...bera["lbgt"] },
        metadata: {
          name: "LBGT"
        },
        approved: true,
        vaultAddress: bera["stlbgt"].address,
      },
      {
        type: "stake",
        description: (
          <div className="">
            Stake <Link href={`/dex/bex/pools`} className="underline underline-offset-2 whitespace-nowrap flex-nowrap"><span>LBGT-WBERA LP</span> <span className="inline-block w-[16px] h-[16px] translate-y-0.5 bg-[url('/images/vaults/v2/open-link.svg')] bg-no-repeat bg-center bg-contain"></span></Link> tokens to earn LBGT and pPaw rewards.
          </div>
        ),
        pool_address: LPStakingWBERALBGTPoolAddress,
        vault_address: LPStakingWBERALBGTVaultAddress,
        address: LPStakingWBERALBGTVaultAddress,
        symbol: "LBGT-WBERA",
        decimals: LPDecimals,
        underlying_tokens: [
          { ...bera["wbera"] },
          { ...bera["lbgt"] },
        ],
        reward_tokens: [
          { ...bera["ppaw"] },
          { ...bera["lbgt"] },
        ],
        token0: { ...bera["wbera"] },
        token1: { ...bera["lbgt"] },
        stakingToken: {
          address: LPStakingWBERALBGTPoolAddress,
          symbol: "LBGT-WBERA",
          name: "50WBERA-50LBGT-WEIGHTED",
          decimals: LPDecimals,
        },
        metadata: {
          name: "LBGT-WBERA"
        },
        approved: true,
        vaultAddress: LPStakingWBERALBGTVaultAddress,
      },
    ];
    const { LBGT: LBGTPrice = 1, WBERA: WBERAPrice = 1 } = prices;
    const pPawPrice = 0.69;
    try {
      const stakeLBGTData = await multicall({
        abi: ABI,
        options: {},
        calls: [
          {
            address: bera["stlbgt"].address,
            name: "totalAssets",
            params: []
          },
          {
            address: "0x3ea91AE9e47EdBC43e64C6DDF99D67207296eC28",
            name: "rewardRate",
            params: []
          },
          {
            address: bera["lbgt"].address,
            name: "balanceOf",
            params: [bera["stlbgt"].address]
          },
          {
            address: bera["stlbgt"].address,
            name: "balanceOf",
            params: [account]
          },
          {
            address: LPStakingWBERALBGTPoolAddress,
            name: "balanceOf",
            params: [account]
          },
          {
            address: LPStakingWBERALBGTVaultAddress,
            name: "totalSupply",
            params: []
          },
          {
            address: LPStakingWBERALBGTPoolAddress,
            name: "totalSupply",
            params: []
          },
          {
            address: LBGTStakingRewards,
            name: "getRewardForDuration",
            params: []
          },
          {
            address: LPStakingWBERALBGTVaultAddress,
            name: "getRewardForDuration",
            params: []
          },
          {
            address: LPStakingWBERALBGTVaultAddress,
            name: "balanceOf",
            params: [account]
          },
          {
            address: LBGTStakingRewards,
            name: "earned",
            params: [account]
          },
          {
            address: LPStakingWBERALBGTVaultAddress,
            name: "earned",
            params: [account]
          },
          {
            address: LPStakingWBERALBGTPoolAddress,
            name: "getPoolId",
            params: []
          },
        ],
        multicallAddress,
        provider
      });
      const [
        lbgtTotalAssetsRes,
        lbgtRewardRateRes,
        lbgtBalanceOfRes,
        userLbgtBalanceOfRes,
        userLPBalanceOfRes,
        LPVaultTotalSupplyRes,
        LPPoolTotalSupplyRes,
        LBGTRewardForDurationRes,
        LPRewardForDurationRes,
        userLPVaultBalanceOfRes,
        userClaimLBGTAmountRes,
        userClaimPPAWAmountRes,
        LPPoolIdRes,
      ] = stakeLBGTData;
      const [lbgtTotalAssets] = lbgtTotalAssetsRes ?? [];
      const [lbgtRewardRate] = lbgtRewardRateRes ?? [];
      const [lbgtBalanceOf] = lbgtBalanceOfRes ?? [];
      const [userLbgtBalanceOf] = userLbgtBalanceOfRes ?? [];
      const [userLPBalanceOf] = userLPBalanceOfRes ?? [];
      const [LPVaultTotalSupply] = LPVaultTotalSupplyRes ?? [];
      const [LPPoolTotalSupply] = LPPoolTotalSupplyRes ?? [];
      const [LBGTRewardForDuration] = LBGTRewardForDurationRes ?? [];
      const [LPRewardForDuration] = LPRewardForDurationRes ?? [];
      const [userLPVaultBalanceOf] = userLPVaultBalanceOfRes ?? [];
      const [userClaimLBGTAmount] = userClaimLBGTAmountRes ?? [];
      const [userClaimPPAWAmount] = userClaimPPAWAmountRes ?? [];
      const [LPPoolId] = LPPoolIdRes ?? [];
      const lbgtTVL = Big(utils.formatUnits(lbgtTotalAssets || "0", bera["lbgt"].decimals)).times(LBGTPrice);
      const lbgtAPR = Big(utils.formatUnits(lbgtRewardRate || "0", 36)).times(Big(31536000).div(utils.formatUnits(lbgtBalanceOf || "1", bera["lbgt"].decimals))).times(100);

      const stakeLBGTDataWithdraw = await multicall({
        abi: ABI,
        options: {},
        calls: [
          {
            address: bera["stlbgt"].address,
            name: "previewRedeem",
            params: [userLbgtBalanceOf || "0"]
          },
          {
            address: BexVaultRouteAddress,
            name: "getPoolTokens",
            params: [LPPoolId]
          },
        ],
        multicallAddress,
        provider
      });
      const [
        lbgtPreviewRedeemRes,
        LPPoolTokensRes,
      ] = stakeLBGTDataWithdraw;

      const [lbgtPreviewRedeem] = lbgtPreviewRedeemRes ?? [];
      const [LPPoolTokens, LPPoolBalanceOf] = LPPoolTokensRes ?? [];

      const userStakedLBGTAmount = utils.formatUnits(lbgtPreviewRedeem || "0", bera["stlbgt"].decimals);
      const userStakedLPAmount = utils.formatUnits(userLPVaultBalanceOf || "0", LPDecimals);
      const WBERAPoolBalance = utils.formatUnits(LPPoolBalanceOf?.[0] || "0", bera["wbera"].decimals);
      const LBGTPoolBalance = utils.formatUnits(LPPoolBalanceOf?.[1] || "0", bera["lbgt"].decimals);
      const LPTvl = Big(WBERAPoolBalance || "0").times(WBERAPrice).plus(Big(LBGTPoolBalance || "0").times(LBGTPrice));
      const LPTokenPrice = Big(LPTvl).div(utils.formatUnits(LPPoolTotalSupply || "0", LPDecimals));
      const LPVaultTvl = Big(utils.formatUnits(LPVaultTotalSupply || "0", LPDecimals) || "0").times(LPTokenPrice);

      const LBGTApr = Big(utils.formatUnits(LBGTRewardForDuration || "0", LPDecimals)).times(8760).times(LBGTPrice).div(LPVaultTvl).times(100);
      const PPAWApr = Big(utils.formatUnits(LPRewardForDuration || "0", LPDecimals)).times(121).times(pPawPrice).div(LPVaultTvl).times(100);

      // stake LBGT
      _list[0].apr = lbgtAPR;
      _list[0].apy = Big(1).plus(Big(_list[0].apr).div(100).div(365)).pow(365).minus(1).times(100);
      _list[0].reward_tokens[0].apr = lbgtAPR;
      _list[0].tvl = lbgtTVL;
      _list[0].user_stake = {
        amount: userStakedLBGTAmount,
        usd: Big(userStakedLBGTAmount || 0).times(LBGTPrice),
      };
      _list[0].user_reward = [];

      // stake LBGT-WBERA
      _list[1].apr = Big(LBGTApr).plus(PPAWApr);
      _list[1].apy = Big(1).plus(Big(_list[1].apr).div(100).div(365)).pow(365).minus(1).times(100);
      _list[1].reward_tokens[0].apr = PPAWApr;
      _list[1].reward_tokens[1].apr = LBGTApr;
      _list[1].tvl = LPVaultTvl;
      _list[1].user_stake = {
        amount: userStakedLPAmount,
        usd: Big(userStakedLPAmount || 0).times(LPTokenPrice).toString(),
      };
      const rewardToken0Amount = utils.formatUnits(userClaimPPAWAmount || "0", _list[1].reward_tokens[0].decimals);
      const rewardToken1Amount = utils.formatUnits(userClaimLBGTAmount || "0", _list[1].reward_tokens[1].decimals);
      _list[1].user_reward = [
        {
          ..._list[1].reward_tokens[0],
          amount: rewardToken0Amount,
          usd: Big(rewardToken0Amount || 0).times(pPawPrice).toString(),
        },
        {
          ..._list[1].reward_tokens[1],
          amount: rewardToken1Amount,
          usd: Big(rewardToken1Amount || 0).times(LBGTPrice).toString(),
        }
      ];
    } catch (err: any) {
      console.log('stakeLBGTData failed: %o', err);
    }

    return _list;
  }, { manual: true });

  const onSort = (_orderBy: "apr" | "position" | "tvl", _sort?: "asc" | "desc") => {
    let __sort = _sort;
    if (typeof _sort === "undefined") {
      if (_orderBy !== orderBy) {
        __sort = "desc";
      } else {
        __sort = sort === "asc" ? "desc" : "asc";
      }
    }
    setOrderBy(_orderBy);
    setSort(__sort);
  };

  const onSearch = (_search?: string) => {
    setSearch(_search);
  };

  const [totalTVL, maxBgtAPRVault] = useMemo<any[]>(() => {
    if (currentTab === "stake") {
      if (!stakeData) return ["0", "0"];
      let _maxStakeAPRVault;
      stakeData.reduce((acc: any, it: any) => {
        if (Big(acc).lt(it.apr || 0)) {
          _maxStakeAPRVault = it;
          return Big(it.apr || 0);
        }
        return Big(acc);
      }, 0);
      return [
        stakeData.reduce((acc: any, it: any) => {
          return Big(acc).plus(Big(it.tvl || 0))
        }, 0),
        _maxStakeAPRVault
      ];
    }
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
  }, [totalData, currentTab, stakeData]);

  const [dataList, loading] = useMemo(() => {
    if (currentTab === "vaults") {
      return [vaultsData, vaultsDataLoading || totalDataLoading];
    }
    return [stakeData, stakeDataLoading];
  }, [
    currentTab,
    vaultsData,
    vaultsDataLoading,
    totalDataLoading,
    stakeData,
    stakeDataLoading,
  ]);

  useEffect(() => {
    if (!name || name !== "BeraPaw") return;
    if (currentTab === "vaults") {
      clearTimeout(timer2.current);
      timer1.current = setTimeout(() => {
        clearTimeout(timer1.current);
        getTotalData();
      }, 0);
    }
    if (currentTab === "stake") {
      clearTimeout(timer1.current);
      timer2.current = setTimeout(() => {
        clearTimeout(timer2.current);
        getStakeData();
      }, 0);
    }

    return () => {
      clearTimeout(timer1.current);
      clearTimeout(timer2.current);
    };
  }, [name, account, provider, currentTab, prices]);

  useEffect(() => {
    getVaultsData();
  }, [totalData, pageIndex, sort, orderBy, search]);

  useEffect(() => {
    if (!maxBgtAPRVault) return;
    if (currentTab === "stake") {
      setMaxAPR(maxBgtAPRVault.apr);
      return;
    }
    const { LBGT: LBGTPrice = 1, BERA: BERAPrice = 1 } = prices;
    getPercentual([maxBgtAPRVault]).then((allPercentual: any) => {
      setMaxAPR(
        Big(maxBgtAPRVault.dynamicData?.apr || 0).times(100).times(Big(LBGTPrice).div(BERAPrice)).times(Big(1).minus(allPercentual[0] || 0))
      )
    });
  }, [maxBgtAPRVault, prices, currentTab]);

  return {
    loading,
    dataList,
    getDataList: (_pageIndex?: number) => {
      if (currentTab === "vaults") {
        if (typeof _pageIndex !== "undefined") {
          getVaultsData(_pageIndex);
          return;
        }
        getTotalData();
        return;
      }
      getStakeData();
    },
    pageIndex,
    pageTotal,
    handleAction,
    approving,
    minting,
    currentVault,
    totalTVL,
    maxAPR,
    orderBy,
    sort,
    onSort,
    search,
    onSearch,
    stakeModalVisible,
    onStakeModalClose,
    stakeModalData,
    handleApprove,
    handleStake,
    staking: staking || depositing,
  };
}

export const ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [
      { internalType: "uint8", name: "", type: "uint8" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardRate",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'balanceOf',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'previewRedeem',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRewardForDuration',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'earned',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: "getPoolId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32"
      }
    ],
    name: "getPoolTokens",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "lastChangeBlock",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
];
