import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { beraB } from '@/configs/tokens/bera-bArtio';

export function useMarketplaceContext(props: Props): Context {
  const { chainId } = props;

  const [lendingVisible, setLendingVisible] = useState(false);
  const [lendingData, setLendingData] = useState<any>({});

  const openDolomite = async () => {
    const dolomiteConfig = await import('@/configs/lending/dolomite');
    const { networks, basic }: any = dolomiteConfig.default;
    const networkConfig = networks[chainId];
    setLendingData({
      dapp: LendingDApps.Dolomite,
      dappLink: '/lending/dolomite',
      config: { ...basic, ...networkConfig },
      networks,
      investToken: beraB['honey'],
    });
  };

  // FIXME Test code for Dolomite
  useEffect(() => {
    // openDolomite().then(() => {
    //   setLendingVisible(true);
    // });
  }, []);

  return {
    chainId,
    lendingVisible,
    setLendingVisible,
    lendingData,
    setLendingData,
    openDolomite,
  };
}

interface Props {
  chainId: number;
}

interface Context {
  chainId: number;
  lendingVisible: boolean;
  lendingData: any;
  setLendingVisible: Dispatch<SetStateAction<boolean>>;
  setLendingData: Dispatch<SetStateAction<any>>;

  openDolomite(): void;
}

const initialState: Context = {
  chainId: 80084,
  lendingVisible: false,
  lendingData: {},
  setLendingVisible: () => {},
  setLendingData: () => {},
  openDolomite: () => {},
};

export const MarketplaceContext = createContext<Context>(initialState);

export enum LendingDApps {
  Bend = 'Bend',
  Dolomite = 'Dolomite',
}
