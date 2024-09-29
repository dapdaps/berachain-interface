import BearBackground from '@/components/bear-background';
import dynamic from 'next/dynamic';
import { memo } from 'react';

const Dapp = ({
  dapp,
  chainId,
  account,
  provider,
  dappChains,
  currentChain,
  localConfig,
  network,
  isChainSupported,
  setIsChainSupported,
  chains,
  props = {}
}) => {
  const componentProps = {
    chainId,
    name: dapp.name,
    account,
    provider,
    curChain: currentChain,
    defaultDex: dapp.name,
    ...dapp,
    dexConfig: {
      ...localConfig?.basic,
      ...localConfig?.networks[currentChain?.chain_id],
      theme: localConfig?.theme
    },
    onSwitchChain: (params: any) => {
      if (Number(params.chainId) === chainId) {
        setIsChainSupported(true);
      } else {
        switchChain(params);
      }
    },
    isChainSupported,
    windowOpen: (url: any, target: any) => {
      window.open(url, target);
    },
    ...props
  };
  const DynamicComponent = dynamic(() => import(`@/modules/${localConfig?.type}/${localConfig?.basic?.name}`), {
    ssr: false,
    // loading: () => {
    //   return <Spinner />;
    // }
  })
  return (
    <BearBackground type='dapp'>
      <DynamicComponent />
    </BearBackground>
  );
};

export default memo(Dapp);
