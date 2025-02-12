import { providers, utils } from 'ethers';
import { flatten } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import chains from '@/configs/chains';
import multicallAddresses from '@/configs/contract/multicall';
import useAccount from '@/hooks/use-account';
import { multicall } from '@/utils/multicall';

export default function useTokensBalance(tokens: any) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<any>({});
  const { account } = useAccount();

  const queryBalance = useCallback(async () => {
    if (!account || !tokens.length) return;
    const chainId = tokens[0].chainId;

    const provider = new providers.JsonRpcProvider(chains[chainId].rpcUrls.default.http[0]);

    try {
      setLoading(true);
      let hasNative = false;
      const tokensAddress = tokens.filter((token: any) => {
        if (token.address === 'native' || token.isNative) hasNative = true;
        return token.address !== 'native' && !token.isNative;
      });

      const calls = tokensAddress.filter((token: any) => !token.isNative && token.address !== 'native').map((token: any) => ({
        address: token.address,
        name: 'balanceOf',
        params: [account]
      }));

      const multicallAddress = multicallAddresses[chainId];
      const requests = [];

      if (hasNative) requests.push(provider.getBalance(account));
      const splits = Math.ceil(calls.length / 20);
      for (let i = 0; i < splits; i++) {
        requests.push(
          multicall({
            abi: [
              {
                inputs: [
                  { internalType: 'address', name: 'account', type: 'address' }
                ],
                name: 'balanceOf',
                outputs: [
                  { internalType: 'uint256', name: '', type: 'uint256' }
                ],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            options: {},
            calls:
              i === splits - 1
                ? calls.slice(i * 20)
                : calls.slice(i * 20, (i + 1) * 20),
            multicallAddress,
            provider
          })
        );
      }

      const _balance: any = {};
      let rest: any = [];
      if (hasNative) {
        const [nativeBalance, ..._rest] = await Promise.all(requests);
        if (hasNative && nativeBalance)
          _balance.native = utils.formatUnits(nativeBalance, 18);
        rest = _rest;
      } else {
        const [..._rest] = await Promise.all(requests);
        rest = _rest;
      }
      
      const results: any = flatten(rest);

      for (let i = 0; i < results.length; i++) {
        const token = tokensAddress[i];
        _balance[token.address] = utils.formatUnits(
          results[i]?.[0] || 0,
          token.decimals
        );
      }

      setBalances(_balance);
      setLoading(false);
    } catch (err) {
      console.log('err:', err);
      setLoading(false);
    }
  }, [tokens, account]);

  useEffect(() => {
    queryBalance();
  }, [tokens, account]);

  return { loading, balances, queryBalance };
}
