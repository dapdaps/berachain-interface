import { useEffect, useMemo, useState } from 'react';
import { get, post } from '@/utils/http';
import { useAccount } from 'wagmi';
import useToast from '@/hooks/use-toast';
import { getDappLogo } from '@/sections/dashboard/utils';
import { uniqBy } from 'lodash';
import { useThrottleFn } from 'ahooks';
import { formatTokenAction } from '@/sections/dashboard/components/fee-rebate/utils';

export function useFeeRebate(): FeeRebate {
  const { address } = useAccount();
  const toast = useToast();

  const listPageSize = 5;
  const [userData, setUserData] = useState<FeeRebateUserData>();
  const [userDataLoading, setUserDataLoading] = useState<boolean>(false);
  const [list, setList] = useState<ActionRecord[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [listTotal, setTotal] = useState<number>(0);
  const [listTotalPage, setTotalPage] = useState<number>(0);
  const [listPage, setListPage] = useState<number>(1);
  const [refunding, setRefunding] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<ActionRecord[]>([]);

  const [hasSelected, hasNextPage, hasPrevPage] = useMemo(() => {
    return [!!selectedList?.length, listPage < listTotalPage, listPage > 1];
  }, [selectedList, listPage, listTotalPage]);

  const getUserData = async () => {
    setUserDataLoading(true);
    try {
      const res = await get('/api/refund/user', { address });
      if (res.code !== 0) {
        console.log('getUserData failed: %o', res);
        setUserDataLoading(false);
        return;
      }
      setUserData(res.data);
    } catch (err: any) {
      console.log('getUserData failed: %o', err);
    }
    setUserDataLoading(false);
  };

  const getList = async (params?: any) => {
    const { page } = params || {};

    setListLoading(true);
    const requestParams = {
      address,
      page: page || listPage,
      page_size: listPageSize,
    };
    try {
      const res = await get('/api/refund/transaction/list', requestParams);
      if (res.code !== 0) {
        console.log('getList failed: %o', res);
        setListLoading(false);
        return;
      }
      const _list = res.data.data || [];
      _list.forEach((record: ActionRecord) => {
        let _dappName = record.template;
        if (_dappName?.toLowerCase() === 'beraswap') {
          _dappName = 'bex';
        }
        record.dapp_logo = getDappLogo(_dappName);
        try {
          record.extraData = JSON.parse(record.extra_data || "{}");
          record.actionTokens = JSON.parse(record.action_tokens || "[]");
          record.tokenInCurrency = JSON.parse(record.token_in_currency || "{}");
          record.tokenOutCurrency = JSON.parse(record.token_out_currency || "{}");
        } catch (_err) {
          console.log('parse extra_data failed: %o', _err);
        }
      });
      _list.sort((a: ActionRecord, b: ActionRecord) => a.refund_status - b.refund_status);
      setList(_list);
      setTotal(res.data.total);
      setTotalPage(res.data.total_page);
      setListPage(requestParams.page);
    } catch (err: any) {
      console.log('getList failed: %o', err);
    }
    setListLoading(false);
  };

  const handleSelected = (record: ActionRecord) => {
    if (record.refund_status === 1 || refunding) return;
    let _list = selectedList?.slice?.() || [];
    const curr = _list?.findIndex?.((it) => it.id === record.id);
    if (curr !== void 0 && curr > -1) {
      _list?.splice(curr, 1);
    } else {
      _list?.push?.(record);
    }
    _list = uniqBy(_list, 'id');
    setSelectedList(_list);
  };

  const handleRefund = async () => {
    setRefunding(true);
    try {
      const res = await post('/api/refund', {
        ids: selectedList?.map((it) => it.id),
      });
      if (res.code !== 0) {
        console.log('getList failed: %o', res);
        toast.fail({ title: res.message || 'Refund failed' });
        setRefunding(false);
        return;
      }
      toast.success({ title: 'Refund success' });
      clearSelected();
      getList();
    } catch (err: any) {
      toast.fail({ title: err.message || 'Refund failed' });
      console.log('getList failed: %o', err);
    }
    setRefunding(false);
  };

  const clearSelected = () => {
    setSelectedList([]);
  };

  const { run: handleNextPage } = useThrottleFn(() => {
    if (!hasNextPage) return;
    const page = listPage + 1;
    getList({ page });
  }, { wait: 1000 });

  const { run: handlePrevPage } = useThrottleFn(() => {
    if (!hasPrevPage) return;
    const page = listPage - 1;
    getList({ page });
  }, { wait: 1000 });

  useEffect(() => {
    if (!address) return;
    getUserData();
  }, [address]);

  return {
    userData,
    userDataLoading,
    getList,
    list,
    selectedList,
    listLoading,
    listPage,
    listTotal,
    listTotalPage,
    handleSelected,
    hasSelected,
    refunding,
    handleRefund,
    clearSelected,
    hasNextPage,
    hasPrevPage,
    handleNextPage,
    handlePrevPage,
  };
}

export interface ActionRecord {
  id: number;
  action_title: string;
  action_type: string;
  action_tokens: string; // JSON string of string array
  action_amount: string;
  account_id: string;
  template: string;
  status: string;
  action_status: string;
  tx_id: string;
  gas: string;
  source: string;
  chain_id: number;
  to_chain_id: number;
  token_in_currency: string | null;
  token_out_currency: string | null;
  extra_data: string; // JSON string
  trading_value: string;
  bridge_status: null;
  pool: string;
  sub_type: string;
  timestamp: number;
  create_time: string;
  wallet: string;
  ip: string;
  refund_status: number;

  dapp_logo?: string;
  extraData?: ActionExtraData | BridgeActionExtraData | StakingActionExtraData;
  actionTokens?: string[];
  tokenInCurrency?: { address: string; symbol: string; decimals: number; };
  tokenOutCurrency?: { address: string; symbol: string; decimals: number; };
}

export interface ActionExtraData {
  action: string;
  type: string;
  tokens: Array<{
    symbol: string;
    address: string;
    amount: string;
  }>;
}

export interface BridgeActionExtraData {
  hash: string;                // Transaction hash, a unique identifier for the transaction
  link: string;                // URL link to the transaction on a blockchain explorer (e.g., BeraScan)
  duration: string;            // Duration of the transaction (unit unclear, possibly seconds)
  fromChainId: number;         // Source chain ID (e.g., 80094 for Berachain Mainnet)
  fromChainName: string;       // Name of the source chain (e.g., "Berachain Mainnet")
  fromChainLogo: string;       // Path or URL to the source chain's logo
  fromTokenLogo: string;       // Path or URL to the source token's logo
  fromAmount: string;          // Amount of tokens sent from the source chain (string to support decimals)
  fromTokenSymbol: string;     // Symbol of the source token (e.g., "USDC.e")
  toChainId: number;           // Destination chain ID (e.g., 56 for BSC)
  toChainName: string;         // Name of the destination chain (e.g., "BSC")
  toChainLogo: string;         // Path or URL to the destination chain's logo
  toTokenLogo: string;         // Path or URL to the destination token's logo
  toAmout: string;             // Amount of tokens received on the destination chain (corrected from "toAmout")
  toTokenSymbol: string;       // Symbol of the destination token (e.g., "USDC")
  time: number;                // Timestamp of the transaction in milliseconds (Unix epoch)
  tool: string;                // Tool or protocol used for bridging (e.g., "Stargate")
  bridgeType: string;          // Type of bridge used (e.g., "Stargate")
  fromAddress: string;         // Address initiating the transaction on the source chain
  toAddress: string;           // Address receiving the tokens on the destination chain
  status: number;              // Status of the transaction (e.g., 3 might indicate completed)
}

export interface StakingActionExtraData {
  token0Symbol: string;  // Symbol of the first token (e.g., "HONEY")
  token1Symbol: string;  // Symbol of the second token (e.g., "sUSDe")
  amount0: string;       // Amount of the first token (string to support high precision decimals)
  amount1: string;       // Amount of the second token (string to support high precision decimals)
}

interface FeeRebateUserData {
  total: number;
  request: number;
  available: number;
}

export interface FeeRebate {
  userData?: FeeRebateUserData;
  userDataLoading: boolean;
  list: ActionRecord[];
  selectedList: ActionRecord[];
  listLoading: boolean;
  listTotal: number;
  listTotalPage: number;
  listPage: number;
  hasSelected?: boolean;
  refunding: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  getList(params?: { page?: number; }): Promise<void>;
  handleRefund(): Promise<void>;
  handleSelected(record: ActionRecord): void;
  clearSelected(): void;
  handleNextPage(): void;
  handlePrevPage(): void;
}


