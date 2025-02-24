import { useState } from 'react';
import { useAuthQuery } from '@/hooks/use-auth-query';
import { get } from '@/utils/http';
import { useAccount } from 'wagmi';

export function useTvl(props: Props) {
  const { currentChain, networkList } = props;

  const { address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [tvls, setTvls] = useState<any>(Object.values(CategoryList));

  const tvlsFormatter = (data = []) => {
    const res = [];
    for (const cg of Object.values(CategoryList)) {
      const curr: any = data.find((it: any) => it.protocol === cg.protocol);
      res.push({
        ...cg,
        tradingVolume: curr?.trading_volume || cg.usd,
        usd: curr?.trading_volume || cg.usd,
        executions: curr?.txns || cg.executions,
      });
    }
    setTvls(res);
  };

  useAuthQuery({
    query: async () => {
      try {
        setLoading(true);
        const result = await get(`/api.db3.app/api/account/protocol/volume`, {
          address,
          chain_id: currentChain.id,
        }, { isSkipFormatUrl: true });
        const data = result?.data?.list ?? [];
        tvlsFormatter(data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching tvls data:', error);
        tvlsFormatter([]);
        setLoading(false);
      }
    },
    onEmpty: () => {
      setTvls(Object.values(CategoryList));
    },
  });

  return {
    tvls,
    loading,
  };
}

export const CategoryList = {
  bridged: {
    key: 1,
    label: 'Bridged',
    usd: '0.00',
    executions: 0,
    protocol: 'bridge'
  },
  swapped: {
    key: 1,
    label: 'Swapped',
    usd: '0.00',
    executions: 0,
    protocol: 'swap'
  },
  liquidity: {
    key: 1,
    label: 'Added Liquidity',
    usd: '0.00',
    executions: 0,
    protocol: 'liquidity'
  },
  lending: {
    key: 1,
    label: 'Lent & Borrowed',
    usd: '0.00',
    executions: 0,
    protocol: 'lending'
  }
};

interface Props {
  currentChain: any;
  networkList: any;
}
