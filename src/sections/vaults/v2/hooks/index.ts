import { Dispatch, useState } from "react";
import {
  ACTION_TYPE,
  ActionType,
  ActionTypes
} from "@/sections/vaults/v2/config";
import useClickTracking from "@/hooks/use-click-tracking";

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
  const { handleReportWithoutDebounce } = useClickTracking();

  const toggleActionVisible = (params?: {
    visible?: boolean;
    type?: ACTION_TYPE;
    record?: any;
  }) => {
    const { visible: _actionVisible, type: _actionType, record } = params ?? {};

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
    setCurrentProtocol(_actionVisible && record ? record.list?.[0] : null);
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
    handleReportWithoutDebounce("1022-001-013", currentRecord.pool_address);
  };

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
    toggleOpenAddLp
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
}
