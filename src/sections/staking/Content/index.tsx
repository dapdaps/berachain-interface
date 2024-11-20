'use client';

import Card from '@/components/card';
import SwitchNetwork from '@/components/switch-network';
import { DEFAULT_CHAIN_ID } from '@/configs';
import chains from '@/configs/chains';
import multicallAddresses from '@/configs/contract/multicall';
import useAccount from '@/hooks/use-account';
import { useProvider } from '@/hooks/use-provider';
import { useMemo, useRef } from 'react';
import Detail from '../Bridge/Detail';
import List from '../Bridge/List';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useInfraredList from '@/sections/staking/hooks/use-infrared-list';
import { useBerps } from '@/sections/staking/hooks/use-berps';

type Props = {
  dapp: any;
};

export type DefaultIndexType = 0 | 1;
export default function Staking({ dapp }: Props) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const dexConfig = dapp?.chains[DEFAULT_CHAIN_ID];
  const { ALL_DATA_URL, addresses, pairs, description } = dexConfig;
  const { account: sender, chainId } = useAccount();
  const { provider } = useProvider();
  const router = useRouter();

  const listRef = useRef<any>();

  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );
  const onChangeData = function (data: any, index: DefaultIndexType) {
    if (dapp?.name === 'Berps') {
      router.push(`/staking/berps?id=${data.id}&tab=${index}`);
      return;
    }
    router.push(`/staking/infrared?id=${data.id}&tab=${index}`);
  };

  const listProps = {
    name: dapp.name,
    description,
    pairs,
    sender,
    chainId,
    provider,
    addresses,
    ALL_DATA_URL,
    multicallAddress,
    onChangeData
  };

  const { dataList: infraredData, loading: infraredLoading, fetchAllData: infraredReload } = useInfraredList();
  const { dataList: berpsData, loading: berpsLoading, reload: berpsReload  } = useBerps(listProps);
  const [dataList, loading, reload] = useMemo(() => {
    if (dapp.name === 'Berps') return [berpsData, berpsLoading, berpsReload];
    return [infraredData, infraredLoading, infraredReload];
  }, [
    infraredData,
    infraredLoading,
    berpsData,
    berpsLoading,
    dapp.name,
  ]);

  return (
    <Card>
      {id ? (
        <Detail
          dapp={dapp}
          onSuccess={() => {
            listRef.current?.reload?.();
          }}
          loading={loading}
        />
      ) : (
        <List
          ref={listRef}
          {...listProps}
          dataList={dataList}
          loading={loading}
          reload={reload}
        />
      )}

      <SwitchNetwork targetChain={chains[DEFAULT_CHAIN_ID]} />
    </Card>
  );
}
