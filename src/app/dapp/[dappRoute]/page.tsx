'use client';

import dappConfig from '@/configs/dapp';
import useAccount from '@/hooks/useAccount';
import useDappInfo from '@/hooks/useDappInfo';
import DappView from '@/sections/dapp';
import Empty from '@/sections/dapp/Empty';
import { useDebounceFn } from 'ahooks';
import { useParams } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';
// import type { NextPageWithLayout } from '@/utils/types';
// set dynamic routes for dapps in config file
export default memo(function DappPage(): React.FC {
  const routerParams = useParams()
  const dappPathname = routerParams?.dappRoute as string
  const { chainId, account, provider, chain: currentChain } = useAccount()
  const { dapp, loading } = useDappInfo(dappPathname ? `dapp/${dappPathname}` : '');
  const [ready, setReady] = useState(false);
  const [localConfig, setLocalConfig] = useState<any>();
  const [isChainSupported, setIsChainSupported] = useState<boolean>();

  const getLocalConfig = useCallback(async () => {
    if (!dappPathname) {
      setLocalConfig(null);
      return;
    }
    const config = dappConfig[dappPathname];
    if (!config) {
      setLocalConfig({ name: '' });
      return;
    }
    let result: any = null;
    if (config.type === 'swap') {
      result = await import(`@/configs/swap/${dappPathname}`);
    }
    if (config.type === 'lending') {
      result = (await import(`@/configs/lending/${dappPathname}`))?.default;
    }

    if (config.type === 'liquidity') {
      result = (await import(`@/configs/liquidity/${dappPathname}`))?.default;
    }
    setLocalConfig({ ...result, theme: config.theme, type: config.type });
  }, [dappPathname]);

  const { run } = useDebounceFn(
    () => {
      const _chainId = chainId || dapp.default_chain_id;
      const isSupported = !!dapp.dapp_network?.find((_chain: any) => _chain.chain_id === _chainId);
      setIsChainSupported(isSupported && _chainId === chainId);
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    getLocalConfig();
  }, [dappPathname]);

  useEffect(() => {
    console.log('===currentChain', currentChain)
  }, [currentChain])

  if (localConfig?.name === '') return <Empty />;
  if (!currentChain || !localConfig || !dapp) return <div />;
  return ready && !loading ? (
    <DappView
      dapp={dapp}
      chainId={chainId}
      account={account}
      provider={provider}
      currentChain={currentChain}
      localConfig={localConfig}
      isChainSupported={isChainSupported}
      setIsChainSupported={setIsChainSupported}
    />
  ) : (
    <div />
  );
});
