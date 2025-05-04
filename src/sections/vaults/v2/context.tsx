import { createContext, ReactNode, RefObject, useContext } from 'react';
import { VaultsV2 } from '@/sections/vaults/v2/hooks';
import { List } from '@/sections/vaults/v2/hooks/list';

interface ContextValue extends List, VaultsV2 {
  containerRef?: RefObject<HTMLDivElement>;
}

export const VaultsV2Context = createContext<Partial<ContextValue>>({});

function VaultsV2ContextProvider({ children, value }: { children: ReactNode; value: ContextValue }) {
  return (
    <VaultsV2Context.Provider value={{ ...value }} >
      {children}
    </VaultsV2Context.Provider>
  );
}

export default VaultsV2ContextProvider;

export function useVaultsV2Context(): ContextValue {
  return useContext(VaultsV2Context) as ContextValue;
}
