'use client';
import Card from '@/components/card';
import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import useAccount from '@/hooks/use-account';
import { useProvider } from '@/hooks/use-provider';
import { useMemo, useState } from 'react';
import Detail from '../Bridge/Detail';
import List from '../Bridge/List';
type Props = {
  dapp: any;
};

const header = [
  {
    label: 'Pool'
  },
  {
    label: 'Protocol'
  },
  {
    label: 'TVL',
    sort: true
  },
  {
    label: 'APY',
    sort: true
  },
  {
    label: 'Yours',
    sort: true
  },
  {
    label: 'Action'
  }
];

export type DefaultIndexType = 0 | 1
export default function Liquidity({ dapp }: Props) {
  const dexConfig = dapp?.chains[DEFAULT_CHAIN_ID];
  const { ALL_DATA_URL, BHONEY_ADDRESS, addresses, pairs } = dexConfig;
  const { account: sender, chainId } = useAccount();
  const { provider } = useProvider();
  const [data, setData] = useState(null);
  const [defaultIndex, setDefaultIndex] = useState<DefaultIndexType>(0);

  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );
  const onChangeData = function (data: any, index: DefaultIndexType) {
    setData(data);
    setDefaultIndex(index)
  };
  const onBack = function () {
    setData(null);
  };
  return (
    <Card>
      {data ? (
        <Detail
          {...{
            data,
            sender,
            provider,
            addresses,
            defaultIndex,
            onBack
          }}
        />
      ) : (
        <List
          {...{
            pairs,
            sender,
            chainId,
            provider,
            addresses,
            ALL_DATA_URL,
            multicallAddress,
            onChangeData
          }}
        />
      )}
    </Card>
  );
}
