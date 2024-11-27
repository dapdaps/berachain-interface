'use client';

import Card from '@/components/card';
import SwitchNetwork from '@/components/switch-network';
import { DEFAULT_CHAIN_ID } from '@/configs';
import chains from '@/configs/chains';
import multicallAddresses from '@/configs/contract/multicall';
import useAccount from '@/hooks/use-account';
import { useProvider } from '@/hooks/use-provider';
import useAquaBera from '@/sections/staking/hooks/use-aquabera';
import { useBerps } from '@/sections/staking/hooks/use-berps';
import useInfraredList from '@/sections/staking/hooks/use-infrared-list';
import Big from 'big.js';
import _ from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import Detail from '../Bridge/Detail';
import List from '../Bridge/List';
import Modal from '../Bridge/Modal';

type Props = {
  dapp: any;
};

export type DefaultIndexType = 0 | 1;
export default function Staking({ dapp }: Props) {
  const isVaults = _.isArray(dapp)
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const dexConfig = isVaults ? null : dapp?.chains[DEFAULT_CHAIN_ID];

  const { ALL_DATA_URL, addresses, pairs, description } = dexConfig ?? {

  };
  const { account: sender, chainId } = useAccount();
  const { provider } = useProvider();
  const router = useRouter();

  const [type, setType] = useState(0);
  const [checkedRecord, setCheckedRecord] = useState(null)

  const listRef = useRef<any>();
  const modalRef = useRef<any>();


  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );
  const [visible, setVisible] = useState<boolean>(false)

  const onChangeData = function (data: any, index: DefaultIndexType) {
    if (isVaults) {
      if (data?.platform === "aquabera") {
        router.push(`/staking/aquabera?address=${data.address}`)
        return
      }
    } else {
      if (dapp?.name === 'Berps') {
        router.push(`/staking/berps?id=${data.id}&tab=${index}`);
        return;
      }
      if (dapp?.name === 'AquaBera') {

        setType(index)
        setCheckedRecord(data)
        // modalRef?.current?.handleShow(data, index, dexConfig)
        return;
      }
    }
    router.push(`/staking/infrared?id=${data.id}&tab=${index}`);
  };

  const listProps = isVaults ? {
    name: "vaults",
    description: "Deposit or mint BGT-whitelisted LP tokens to earn iBGT (liquid BGT) & Boosted Yield.",
    pairs: [],
    sender,
    chainId,
    provider,
    multicallAddress,
    onChangeData,
  } : {
    name: dapp.name,
    description,
    pairs,
    sender,
    chainId,
    provider,
    addresses,
    ALL_DATA_URL,
    multicallAddress,
    onChangeData,
  };

  const { dataList: infraredData, loading: infraredLoading, fetchAllData: infraredReload, } = useInfraredList(0, isVaults ? "Infrared" : dapp?.name);
  const { dataList: aquabearData, loading: aquabearLoading, reload: aquabearReload } = useAquaBera(isVaults ? "AquaBera" : dapp?.name)
  const { dataList: berpsData, loading: berpsLoading, reload: berpsReload } = useBerps(listProps);

  const [dataList, loading, reload] = useMemo(() => {
    if (isVaults) {
      const _dataList = []
      infraredData?.forEach((_data: any) => {
        _dataList.push({
          ..._data,
          pool: {
            name: _data?.initialData?.pool?.name || 'iBGT',
            protocol: _data?.initialData?.pool?.protocol
          },
          platform: "infrared"
        })
      })
      aquabearData?.forEach((_data: any) => {
        const _depositAmount = _data?.pairedTokens?.reduce((acc, curr) => Big(acc).plus(curr?.yourValue).toFixed(), Big(0))
        _dataList.push({
          ..._data,
          images: [_data?.icon],
          tokens: [_data?.symbol],
          apy: _data?.maxApr,
          depositAmount: _depositAmount,
          usdDepositAmount: _depositAmount,
          platform: "aquabera",
          pool: {
            name: _data?.symbol,
            protocol: 'BEX'
          },
        })
      })
      return [_dataList, infraredLoading || aquabearLoading, () => {
        infraredReload()
        aquabearReload()
      }]
    } else {
      if (dapp.name === 'Berps') return [berpsData, berpsLoading, berpsReload]
      if (dapp.name === 'AquaBera') return [aquabearData, aquabearLoading, aquabearReload]
      return [infraredData, infraredLoading, infraredReload];
    }
  }, [
    infraredData,
    infraredLoading,
    berpsData,
    berpsLoading,
    aquabearData,
    aquabearLoading,
    isVaults,
    dapp.name,
  ]);
  return (
    <Card>
      {id ? (
        <Detail
          name={dapp.name}
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



      <Modal
        // ref={modalRef}
        show={!!checkedRecord}
        data={checkedRecord}
        config={dexConfig}
        type={type}
        onClose={() => {
          setCheckedRecord(null)
        }}
        onSuccess={() => {
          reload()
        }}
      />
    </Card>
  );
}
