import { useState } from "react";
import {
  ACTION_TYPE,
  ActionType,
  ActionTypes
} from "@/sections/vaults/v2/config";

export function useVaultsV2(): VaultsV2 {
  const [actionVisible, setActionVisible] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(
    ActionTypes[ACTION_TYPE.DEPOSIT]
  );
  const [claimVisible, setClaimVisible] = useState(false);
  const [claimSuccessVisible, setClaimSuccessVisible] = useState(false);
  const [strategyVisible, setStrategyVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [currentReward, setCurrentReward] = useState<any>(null);
  const [successReward, setSuccessReward] = useState<any>(null);

  const toggleActionVisible = (params?: {
    visible?: boolean;
    type?: ACTION_TYPE;
    record?: any;
  }) => {
    const { visible: _actionVisible, type: _actionType, record } = params ?? {};
    setActionVisible(
      typeof _actionVisible === "boolean" ? _actionVisible : !actionVisible
    );
    setCurrentRecord(_actionVisible && record ? record : null);
    if (_actionType) {
      setActionType(ActionTypes[_actionType]);
    }
  };

  const toggleClaimVisible = (_claimVisible?: boolean, record?: any, reward?: any) => {
    setClaimVisible(
      typeof _claimVisible === "boolean" ? _claimVisible : !claimVisible
    );
    setCurrentReward(_claimVisible && reward ? reward : null);
    setCurrentRecord(_claimVisible && record ? record : null);
  };

  const toggleClaimSuccessVisible = (_claimSuccessVisible?: boolean, reward?: any) => {
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

  return {
    actionType,
    actionVisible,
    claimVisible,
    claimSuccessVisible,
    strategyVisible,
    currentRecord,
    currentReward,
    successReward,
    toggleActionVisible,
    toggleClaimVisible,
    toggleClaimSuccessVisible,
    toggleStrategyVisible
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
  toggleClaimVisible: (claimVisible?: boolean, record?: any, reward?: any) => void;
  claimSuccessVisible: boolean;
  toggleClaimSuccessVisible: (claimSuccessVisible?: boolean, reward?: any) => void;
  strategyVisible: boolean;
  toggleStrategyVisible: (strategyVisible?: boolean) => void;
  currentReward?: any;
  successReward?: any;
}
