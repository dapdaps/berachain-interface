import { useAccount } from 'wagmi';
import { useState } from 'react';
import Big from 'big.js';
import { getTokenLogo } from '@/sections/dashboard/utils';
import { useAuthQuery } from '@/hooks/use-auth-query';
import axios from 'axios';

export function useWallet(props: Props) {
  const { currentChain, networkList } = props;

  const { address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<any>([]);
  const [networks, setNetworks] = useState<any>([]);
  const [totalBalance, setTotalBalance] = useState<Big.Big>(Big(0));

  useAuthQuery({
    query: async () => {
      setLoading(true);
      const url = new URL("https://api.db3.app/api/balance/list");
      url.searchParams.set("address", address ?? "");
      url.searchParams.set("chain_id", currentChain.id);
      try {
        const result = await axios.get(url.toString());
        const _data = result?.data?.data?.list ?? [];
        const _networks: any = {};
        let _totalBalance = new Big(0);
        networkList.forEach((n: any) => {
          _networks[n.id] = {
            icon: n.icon,
            id: n.id,
            name: n.name,
            usd: Big(0),
          };
        });
        _data.forEach((record: any) => {
          record.chainLogo = currentChain.icon;
          record.logo = getTokenLogo(record.symbol);
          if (_networks[record.chain_id]) {
            _networks[record.chain_id].usd = Big(_networks[record.chain_id].usd).plus(record.usd || 0);
          }
          _totalBalance = _totalBalance.add(record.usd || 0);
        });
        setTokens(_data);
        setNetworks(Object.values(_networks).sort((a: any, b: any) => {
          return Big(b.usd).toNumber() - Big(a.usd).toNumber();
        }));
        setTotalBalance(_totalBalance);
      } catch (err: any) {
        console.log('getTokens failed: %o', err);
      }
      setLoading(false);
    },
    onEmpty: () => {
      setTokens([]);
      setNetworks([]);
      setTotalBalance(Big(0));
    },
  });

  return {
    loading,
    tokens,
    networks,
    totalBalance,
  };
}

interface Props {
  currentChain: any;
  networkList: any;
}
