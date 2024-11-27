import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { beraB } from '@/configs/tokens/bera-bArtio';
import useBend from '../Lending/Bend/hooks/useBend';


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
    const config = await import('@/configs/staking/dapps/infrared');
    setVaultsData({
      dapp: VaultsDApps.Infrared,
      dappLink: '/staking/infrared',
      config: config.default,
      platform: "infrared",
      data
    });
  };

  const openAquaBera = async (data: any, type: number) => {
    const config = await import('@/configs/staking/dapps/aquabera');

    setVaultsData({
      dapp: VaultsDApps.AquaBera,
      dappLink: '/staking/infrared',
      config: config.default,
      type,
      platform: "aquabera",
      data
    });
  }

  // FIXME Test code for Dolomite
  useEffect(() => {
    // openDolomite().then(() => {
    //   setLendingVisible(true);
    // });
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
    openInfrared,
    openAquaBera
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
  openInfrared(data: any): void;
  openAquaBera(data: any): void;

  // open

}

const initialState: any = {
  chainId: 80084,
  lendingVisible: false,
  lendingData: {},
  setLendingVisible: () => { },
  setLendingData: () => { },
  openDolomite: () => { },

  stakingVisible: false,
  stakingData: {},
  setStakingVisible: () => { },
  setStakingData: () => { },
  openInfrared: (data: any) => { },
  openAquaBera: (data: any) => { }
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
  Infrared = 'Infrared',
  AquaBera = 'AquaBera'

}
