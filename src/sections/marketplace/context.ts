import { createContext, Dispatch, SetStateAction, useState } from 'react';

export function useMarketplaceContext(): Context {
  const [lendingVisible, setLendingVisible] = useState(false);

  return {
    lendingVisible,
    setLendingVisible,
  };
}

interface Context {
  lendingVisible: boolean;
  setLendingVisible: Dispatch<SetStateAction<boolean>>
}

const initialState: Context = {
  lendingVisible: false,
  setLendingVisible: () => {},
};

export const MarketplaceContext = createContext<Context>(initialState);
