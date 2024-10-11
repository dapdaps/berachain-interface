import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { beraB } from '@/configs/tokens/bera-bArtio';
import useBend from '../Lending/Bend/useBend';


export function useMarketplaceContext(props: Props): Context {
  const { chainId } = props;
  
  const [lendingVisible, setLendingVisible] = useState(false);
  const [lendingData, setLendingData] = useState<any>({});
  const { init: bendInit } = useBend()

  const [stakingVisible, setStakingVisible] = useState(false);
  const [stakingData, setStakingData] = useState<any>({});

  const [vaultsVisible, setVaultsVisible] = useState(false);
  const [vaultsData, setVaultsData] = useState<any>({});

  const openDolomite = async () => {
    const dolomiteConfig = await import('@/configs/lending/dolomite');
    const { networks, basic }: any = dolomiteConfig.default;
    const networkConfig = networks[chainId];
    setLendingData({
      dapp: LendingDApps.Dolomite,
      dappLink: '/lending/dolomite',
      config: { ...basic, ...networkConfig },
      networks,
      investToken: beraB['honey']
    });
  };

  const openInfrared = async (data: any) => {
    const config = await import('@/configs/liquidity/dapps/infrared');
    setVaultsData({
      dapp: VaultsDApps.Infrared,
      dappLink: '/liquidity/infrared',
      config: config.default,
      data
      // investToken: beraB['honey'],
    });
  };

  // FIXME Test code for Dolomite
  useEffect(() => {
    openDolomite().then(() => {
      setLendingVisible(true);
    });
  }, []);

  // loader for bend
    useEffect(() => {
      bendInit()
    }, []);

  return {
    chainId,
    lendingVisible,
    setLendingVisible,
    lendingData,
    setLendingData,
    openDolomite,
    stakingVisible,
    stakingData,
    setStakingVisible,
    setStakingData,

    vaultsVisible,
    vaultsData,
    setVaultsVisible,
    setVaultsData,

    openInfrared: () => {}
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

  stakingVisible: boolean;
  stakingData: any;
  setStakingVisible: Dispatch<SetStateAction<boolean>>;
  setStakingData: Dispatch<SetStateAction<any>>;

  vaultsVisible: boolean;
  vaultsData: any;
  setVaultsVisible: Dispatch<SetStateAction<boolean>>;
  setVaultsData: Dispatch<SetStateAction<any>>;
  openInfrared(): void;
}

const initialState: any = {
  chainId: 80084,
  lendingVisible: false,
  lendingData: {},
  setLendingVisible: () => {},
  setLendingData: () => {},
  openDolomite: () => {},

  stakingVisible: false,
  stakingData: {},
  setStakingVisible: () => {},
  setStakingData: () => {},
  openInfrared: () => {}
};

export const MarketplaceContext = createContext<Context>(initialState);

export enum LendingDApps {
  Bend = 'Bend',
  Dolomite = 'Dolomite'
}

export enum StakingDApps {
  Infrared = 'Infrared'
}
export enum VaultsDApps {
  Infrared = 'Infrared'
}
