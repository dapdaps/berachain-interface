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
  const [availableAssets, setAvailableAssets] = useState(false);
  const [claimVisible, setClaimVisible] = useState(false);
  const [claimSuccessVisible, setClaimSuccessVisible] = useState(false);
  const [strategyVisible, setStrategyVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

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

  const toggleAvailableAssets = (_availableAssets?: boolean) => {
    setAvailableAssets(
      typeof _availableAssets === "boolean"
        ? _availableAssets
        : !availableAssets
    );
  };

  const toggleClaimVisible = (_claimVisible?: boolean, record?: any) => {
    setClaimVisible(
      typeof _claimVisible === "boolean" ? _claimVisible : !claimVisible
    );
    setCurrentRecord(_claimVisible && record ? record : null);
  };

  const toggleClaimSuccessVisible = (_claimSuccessVisible?: boolean) => {
    setClaimSuccessVisible(
      typeof _claimSuccessVisible === "boolean"
        ? _claimSuccessVisible
        : !claimSuccessVisible
    );
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
    availableAssets,
    claimVisible,
    claimSuccessVisible,
    strategyVisible,
    currentRecord,
    toggleActionVisible,
    toggleAvailableAssets,
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
  availableAssets: boolean;
  toggleAvailableAssets: (availableAssets?: boolean) => void;
  claimVisible: boolean;
  toggleClaimVisible: (claimVisible?: boolean, record?: any) => void;
  claimSuccessVisible: boolean;
  toggleClaimSuccessVisible: (claimSuccessVisible?: boolean) => void;
  strategyVisible: boolean;
  toggleStrategyVisible: (strategyVisible?: boolean) => void;
}
