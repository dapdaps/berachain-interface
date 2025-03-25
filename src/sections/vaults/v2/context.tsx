import { createContext, ReactNode, useContext } from 'react';
import { VaultsV2 } from '@/sections/vaults/v2/hooks';

export const VaultsV2Context = createContext<Partial<VaultsV2>>({});

function VaultsV2ContextProvider({ children, value }: { children: ReactNode; value: VaultsV2 }) {
  return (
    <VaultsV2Context.Provider value={{ ...value }} >
      {children}
    </VaultsV2Context.Provider>
  );
}

export default VaultsV2ContextProvider;

export function useVaultsV2Context(): VaultsV2 {
  return useContext(VaultsV2Context) as VaultsV2;
}
