import { useState } from 'react';
import { ACTION_TYPE, ActionType, ActionTypes } from '@/sections/vaults/v2/config';

export function useVaultsV2(): VaultsV2 {
  const [actionVisible, setActionVisible] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(ActionTypes[ACTION_TYPE.DEPOSIT]);
  const [availableAssets, setAvailableAssets] = useState(false);

  const toggleActionVisible = (params?: { visible?: boolean; type?: ACTION_TYPE; }) => {
    const { visible: _actionVisible, type: _actionType } = params ?? {};
    setActionVisible(typeof _actionVisible === "boolean" ? _actionVisible : !actionVisible);
    if (_actionType) {
      setActionType(ActionTypes[_actionType]);
    }
  }

  const toggleAvailableAssets = (_availableAssets?: boolean) => {
    setAvailableAssets(typeof _availableAssets === "boolean" ? _availableAssets : !availableAssets);
  }

  return {
    actionType,
    actionVisible,
    availableAssets,
    toggleActionVisible,
    toggleAvailableAssets,
  };
}

export interface VaultsV2 {
  actionType: ActionType;
  actionVisible: boolean;
  toggleActionVisible: (params?: { visible?: boolean; type?: ACTION_TYPE; }) => void;
  availableAssets: boolean;
  toggleAvailableAssets: (availableAssets?: boolean) => void;
}
