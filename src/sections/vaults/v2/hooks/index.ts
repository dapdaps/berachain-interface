import { Dispatch, useMemo, useState } from 'react';
import {
  ACTION_TYPE,
  ActionType,
  ActionTypes
} from "@/sections/vaults/v2/config";
import useClickTracking from "@/hooks/use-click-tracking";
import { BASE_URL, get } from '@/utils/http';
import axios from 'axios';
import { useRequest } from 'ahooks';
import { maxBy } from 'lodash';

export function useVaultsV2(): VaultsV2 {
  const [actionVisible, setActionVisible] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(
    ActionTypes[ACTION_TYPE.DEPOSIT]
  );
  const [claimVisible, setClaimVisible] = useState(false);
  const [claimSuccessVisible, setClaimSuccessVisible] = useState(false);
  const [strategyVisible, setStrategyVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [currentProtocol, setCurrentProtocol] = useState<any>(null);
  const [currentReward, setCurrentReward] = useState<any>(null);
  const [successReward, setSuccessReward] = useState<any>(null);
  const [openAddLp, setOpenAddLp] = useState(false);
  const [swapToken, setSwapToken] = useState<any>(null);
  const [currentDepositTab, setCurrentDepositTab] = useState<any>("deposit");

  const [isBeraPaw] = useMemo(() => {
    return [currentProtocol?.project?.toLowerCase() === "berapaw" && currentProtocol?.linkVault];
  }, [currentProtocol]);

  const { handleReportWithoutDebounce } = useClickTracking();

  const toggleActionVisible = (params?: {
    visible?: boolean;
    type?: ACTION_TYPE;
    record?: any;
    defaultProtocol?: any;
  }) => {
    const { visible: _actionVisible, type: _actionType, record, defaultProtocol } = params ?? {};

    if (_actionVisible) {
      handleReportWithoutDebounce("1022-001-009", record.pool_address);
    }

    setActionVisible(
      typeof _actionVisible === "boolean" ? _actionVisible : !actionVisible
    );
    setCurrentRecord(_actionVisible && record ? record : null);
    if (_actionType) {
      setActionType(ActionTypes[_actionType]);
    }
    let maxApyRecord = maxBy(record?.list ?? [], (item: any) => item.totalApy.toNumber());
    if (defaultProtocol) {
      maxApyRecord = defaultProtocol;
    }
    setCurrentProtocol(_actionVisible && record ? maxApyRecord : null);
  };

  const toggleActionType = (_actionType?: ActionType) => {
    setActionType(
      typeof _actionType !== void 0
        ? (_actionType as ActionType)
        : actionType === ActionTypes[ACTION_TYPE.DEPOSIT]
        ? ActionTypes[ACTION_TYPE.WITHDRAW]
        : ActionTypes[ACTION_TYPE.DEPOSIT]
    );
  };

  const toggleClaimVisible = (_claimVisible?: boolean, reward?: any) => {
    setClaimVisible(
      typeof _claimVisible === "boolean" ? _claimVisible : !claimVisible
    );
    setCurrentReward(_claimVisible && reward ? reward : null);
  };

  const toggleClaimSuccessVisible = (
    _claimSuccessVisible?: boolean,
    reward?: any
  ) => {
    setClaimSuccessVisible(
      typeof _claimSuccessVisible === "boolean"
        ? _claimSuccessVisible
        : !claimSuccessVisible
    );
    setSuccessReward(_claimSuccessVisible && reward ? reward : null);
  };

  const toggleStrategyVisible = (_strategyVisible?: boolean) => {
    setStrategyVisible(
      typeof _strategyVisible === "boolean"
        ? _strategyVisible
        : !strategyVisible
    );
  };

  const toggleOpenAddLp = (_openAddLp?: boolean) => {
    setOpenAddLp(typeof _openAddLp === "boolean" ? _openAddLp : !openAddLp);
    if (_openAddLp) {
      handleReportWithoutDebounce("1022-001-013", currentRecord.pool_address);
    }
  };

  const { data: totalStatistics, loading: totalStatisticsLoading, runAsync: getTotalStatistics } = useRequest(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/go/vaults/stats`);
      if (res.status !== 200 || res.data.code !== 200) {
        console.log("getTotalStatistics error:", res.data.message);
        return {};
      }
      return res.data.data || {};
    } catch (err: any) {
      console.log(err);
    }
    return {};
  }, {
    manual: true,
  });

  return {
    actionType,
    actionVisible,
    claimVisible,
    claimSuccessVisible,
    strategyVisible,
    currentRecord,
    currentReward,
    successReward,
    currentProtocol,
    openAddLp,
    toggleActionVisible,
    toggleClaimVisible,
    toggleClaimSuccessVisible,
    toggleStrategyVisible,
    setCurrentProtocol,
    toggleActionType,
    toggleOpenAddLp,
    swapToken,
    setSwapToken,
    totalStatistics,
    getTotalStatistics,
    totalStatisticsLoading,
    isBeraPaw,
    currentDepositTab,
    setCurrentDepositTab,
  };
}

export interface VaultsV2 {
  actionType: ActionType;
  currentRecord?: any;
  actionVisible: boolean;
  toggleActionVisible: (params?: {
    visible?: boolean;
    type?: ACTION_TYPE;
    record?: any;
    defaultProtocol?: any;
  }) => void;
  claimVisible: boolean;
  toggleClaimVisible: (claimVisible?: boolean, reward?: any) => void;
  claimSuccessVisible: boolean;
  toggleClaimSuccessVisible: (
    claimSuccessVisible?: boolean,
    reward?: any
  ) => void;
  strategyVisible: boolean;
  toggleStrategyVisible: (strategyVisible?: boolean) => void;
  currentReward?: any;
  successReward?: any;
  currentProtocol?: any;
  setCurrentProtocol: Dispatch<any>;
  toggleActionType: (actionType?: ActionType) => void;
  openAddLp: boolean;
  toggleOpenAddLp: (openAddLp?: boolean) => void;
  swapToken: any;
  setSwapToken: (swapToken: any) => void;
  totalStatistics: { id?: number; total_staked_transactions?: number; total_staked_volume?: string; total_transactions?: number; total_volume?: string; };
  getTotalStatistics: () => Promise<void>;
  totalStatisticsLoading: boolean;
  isBeraPaw: boolean;
  currentDepositTab: any;
  setCurrentDepositTab: Dispatch<any>;
}
