import { createContext, ReactNode, useContext } from 'react';
import { Action } from '@/sections/vaults/v2/hooks/use-action';

interface ContextValue extends Action {
}

export const VaultsV2ActionContext = createContext<Partial<ContextValue>>({});

function VaultsV2ActionContextProvider({ children, value }: { children: ReactNode; value: ContextValue }) {
  return (
    <VaultsV2ActionContext.Provider value={{ ...value }} >
      {children}
    </VaultsV2ActionContext.Provider>
  );
}

export default VaultsV2ActionContextProvider;

export function useVaultsV2ActionContext(): ContextValue {
  return useContext(VaultsV2ActionContext) as ContextValue;
}
