import Big from 'big.js';
import { Contract, utils } from 'ethers';
import { useState } from 'react';
import useAccount from '@/hooks/use-account';
import useAddAction from '@/hooks/use-add-action';
import useToast from '@/hooks/use-toast';
import { useSettingsStore } from '@/stores/settings';
import abi from './abi';
import bex from '@/configs/pools/bex';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default function useRemove({
  detail,
  info,
  percent,
  amount0,
  amount1,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, chainId, provider } = useAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);
  const { addAction } = useAddAction('dapp');
  const contracts = bex.contracts[DEFAULT_CHAIN_ID];

  const onRemove = async () => {
    if (!contracts) return;
    setLoading(true);
    let toastId = toast.loading({ title: 'Confirming...' });
    try {
      const { liquidity } = detail;
      const { token0, token1, poolIdx, lpAddress } = info;
      const _liquidity = new Big(liquidity).mul(percent / 100).toFixed(0);

      const queryContract = new Contract(contracts.CrocQuery, abi, provider);
      const limitResponse = await queryContract.queryPrice(
        token0.address,
        token1.address,
        poolIdx
      );
      const limitLower = Big(limitResponse)
        .mul(1 - slippage / 100)
        .toFixed(0);
      const limitHigher = Big(limitResponse)
        .mul(1 + slippage / 100)
        .toFixed(0);

      const RouterContract = new Contract(
        contracts.CrocSwapDex,
        abi,
        provider.getSigner(account)
      );

      const method = 'userCmd';

      const cmd = utils.defaultAbiCoder.encode(
        [
          'uint8',
          'address',
          'address',
          'uint256',
          'int24',
          'int24',
          'uint128',
          'uint128',
          'uint128',
          'uint8',
          'address'
        ],
        [
          4,
          token0.address,
          token1.address,
          poolIdx,
          0,
          0,
          _liquidity,
          limitLower,
          limitHigher,
          0,
          lpAddress
        ]
      );

      const params = [128, cmd];

      let estimateGas: any = new Big(1000000);

      try {
        estimateGas = await RouterContract.estimateGas[method](...params);
      } catch (err: any) {
        console.log('estimateGas err', err);
        if (err?.code === 'UNPREDICTABLE_GAS_LIMIT') {
          estimateGas = new Big(3000000);
        }
      }
      console.log('estimateGas', estimateGas.toString());
      const tx = await RouterContract[method](...params, {
        gasLimit: new Big(estimateGas).mul(120).div(100).toFixed(0)
      });

      toast.dismiss(toastId);
      toastId = toast.loading({ title: 'Pending...' });

      const { status, transactionHash } = await tx.wait();
      setLoading(false);
      addAction({
        type: 'Liquidity',
        action: 'Remove Liquidity',
        token0: token0.symbol,
        token1: token1.symbol,
        template: 'Bex',
        status,
        transactionHash,
        extra_data: JSON.stringify({
          amount0: amount0 * (percent / 100),
          amount1: amount1 * (percent / 100),
          action: 'Remove Liquidity',
          type: 'univ3'
        })
      });
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: 'Remove successfully!',
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: 'Remove faily!' });
      }
    } catch (err: any) {
      console.log('err', err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes('user rejected transaction')
          ? 'User rejected transaction'
          : `Remove faily!`
      });
    }
  };

  return { loading, onRemove };
}
