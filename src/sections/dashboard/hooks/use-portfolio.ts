import { useState } from 'react';
import Big from 'big.js';
import { useAccount } from 'wagmi';
import { useAuthQuery } from '@/hooks/use-auth-query';
import { get } from '@/utils/http';
import { getDappLogo, getTokenLogo } from '@/sections/dashboard/utils';

export function usePortfolio(props: Props) {
  const { currentChain, networkList } = props;

  const { address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [dapps, setDapps] = useState<any>([]);
  const [dappsByChain, setDappsByChain] = useState<any>([]);
  const [totalBalance, setTotalBalance] = useState<Big.Big>(Big(0));

  useAuthQuery({
    query: async () => {
      setLoading(true);
      try {
        setDapps([]);
        const result = await get(`/db3`, {
          url: 'api/balance/dapp/list',
          params: JSON.stringify({
            address,
            chain_id: currentChain.id
          })
        });

        let _totalBalance = Big(0);
        const data: any = result?.data?.list || [];
        const dappsList = [];

        const _dappsByChain: any = networkList.map((chain: any) => ({
          chainId: chain.id,
          totalUsdValue: Big(0),
          totalUsd: '0.00',
          dappList: [],
          logo: chain.icon,
          name: chain.name
        }));
        for (const _dapp of data) {
          let dappTotalUsd = Big(0);
          const dappType = _dapp.type;
          if (!_dapp.assets) continue;
          for (const typeAsset of _dapp.assets) {
            const assetType = typeAsset.type;
            typeAsset.totalUsd = Big(0);
            if (!typeAsset.assets) continue;
            for (let i = 0; i < typeAsset.assets.length; i++) {
              const tokenAsset = typeAsset.assets[i];
              tokenAsset.tokenLogo = getTokenLogo(tokenAsset.symbol);

              // Leveraged Farming
              if (['Leveraged Farming'].includes(dappType)) {
                // The first item in the innermost assets is Supply
                if (i === 0) {
                  typeAsset.totalUsd = typeAsset.totalUsd.plus(
                    tokenAsset.usd || 0
                  );
                  dappTotalUsd = dappTotalUsd.plus(tokenAsset.usd || 0);
                }
                // while the others are Borrow
                else {
                  typeAsset.totalUsd = typeAsset.totalUsd.minus(
                    tokenAsset.usd || 0
                  );
                  dappTotalUsd = dappTotalUsd.minus(tokenAsset.usd || 0);
                }
              }
              // other dApp types
              else {
                if (assetType === 'Borrow') {
                  typeAsset.totalUsd = typeAsset.totalUsd.minus(
                    tokenAsset.usd || 0
                  );
                  dappTotalUsd = dappTotalUsd.minus(tokenAsset.usd || 0);
                } else {
                  typeAsset.totalUsd = typeAsset.totalUsd.plus(
                    tokenAsset.usd || 0
                  );
                  dappTotalUsd = dappTotalUsd.plus(tokenAsset.usd || 0);
                }
              }
            }
          }
          _totalBalance = _totalBalance.plus(dappTotalUsd);
          const dappItem = {
            ..._dapp,
            totalUsd: dappTotalUsd,
            chainLogo: currentChain.icon,
            dappLogo: getDappLogo(_dapp.name),
            detailList: _dapp.assets || [],
            path: ''
          };
          dappsList.push(dappItem);

          // add dapp to chain
          const chainIndex = _dappsByChain.findIndex(
            (_chain: any) => _chain.chainId == _dapp.chain_id
          );
          if (chainIndex > -1) {
            const chainItem = _dappsByChain[chainIndex];
            chainItem.totalUsdValue = Big(chainItem.totalUsd).plus(
              dappTotalUsd
            );
            chainItem.totalUsd = Big(chainItem.totalUsdValue).toFixed(2);
            chainItem.dappList.push(dappItem);
            _dappsByChain[chainIndex] = chainItem;
          }
        }
        const _dappsByChainSorted = _dappsByChain.sort(
          (a: any, b: any) =>
            Big(b.totalUsdValue).toNumber() - Big(a.totalUsdValue).toNumber()
        );

        setDapps(dappsList);
        setDappsByChain(_dappsByChainSorted);
        setTotalBalance(_totalBalance);
      } catch (err: any) {
        console.log('query dApps failed: %o', err);
      }
      setLoading(false);
    },
    onEmpty: () => {
      setDapps([]);
      setDappsByChain([]);
      setTotalBalance(Big(0));
    }
  });

  return {
    loading,
    dapps,
    dappsByChain,
    totalBalance
  };
}

interface Props {
  currentChain: any;
  networkList: any;
}
