import { memo, useMemo, useState } from 'react';

import RemoveAmount from '../../components/remove-amount';
import RemoveButton from '../../components/button/remove-button';
import RemovePercent from '../../components/remove-percent';
import Tokens from '../../components/tokens';
import useUserInfo from '../island/hooks/use-user-info';
import useWithdraw from '../island/hooks/use-withdraw';
import Big from 'big.js';
import { DEFAULT_CHAIN_ID } from '@/configs';
const Remove = (data: any) => {
  const {
    id,
    tokenId,
    farmAddress,
    token0,
    token1,
    pool,
    price,
    onSuccess
  } = data
  const { loading: infoLoading, info, queryInfo } = useUserInfo({
    islandContract: id,
    farmContract: farmAddress,
    token0,
    token1,
    pool,
    price
  });

  // const { amount0, amount1, amount } = info?.withdraw ?? {};
  // const liquidity = Big(amount ? amount : 0).mul(1e18).toFixed(0)
  const [percent, setPercent] = useState(0);

  const [amount0, amount1, amount] = useMemo(() => {
    return [
      Big(info?.withdraw?.amount0 ?? 0).toFixed(),
      Big(info?.withdraw?.amount1 ?? 0).toFixed(),
      Big(info?.balance ?? 0).times(percent).div(100).toFixed()
    ];
  }, [info, percent]);
  const liquidity = useMemo(() => Big(info?.balance ?? 0).mul(1e18).toFixed(0), [info, percent])

  const { loading, onWithdraw: onRemove } = useWithdraw({
    data,
    amount,
    onSuccess,
    // onError
  });
  const errorTips = useMemo(() => {
    if (!percent) return 'Select a percent';
    return '';
  }, [percent]);

  const value = useMemo(() => {
    if (Big(liquidity || 0).eq(0)) return '';
    if (percent === 0) return '';
    return Big(liquidity || 0)
      .mul(percent / 100)
      .div(1e18)
      .toFixed(18);
  }, [liquidity, percent]);
  const lpToken = useMemo(
    () => ({
      address: data.id,
      symbol: data.symbol,
      chainId: DEFAULT_CHAIN_ID,
      decimals: 18,
      icon: data.icon
    }),
    [data]
  );


  console.log('====data', data)

  return (
    <>
      <Tokens type='island' liquidity={liquidity} token0={token0} token1={token1} />
      <RemovePercent percent={percent} setPercent={setPercent} />
      <RemoveAmount
        type='V2'
        amount0={amount0}
        amount1={amount1}
        token0={token0}
        token1={token1}
        percent={percent}
      />
      <RemoveButton
        text='Remove Liquidity'
        loading={loading || infoLoading}
        onClick={onRemove}
        value={value}
        token={lpToken}
        spender={data.router}
        errorTips={errorTips}
      />
    </>
  )
  // return loading ? (
  //   <ModalLoading
  //     title="Waiting for confirmation"
  //     subTitle={`Withdrawing ${balanceFormated(amount0, 4)} ${data.token0.symbol
  //       } and ${balanceFormated(amount1, 4)} ${data.token1.symbol}`}
  //   />
  // ) : (
  //   <>
  //     <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
  //       <div className="flex items-center justify-between mt-[6px]">
  //         <div className="flex items-center gap-[9px]">
  //           <img
  //             src={data.token0.icon}
  //             alt={data.token0.name}
  //             width={26}
  //             height={26}
  //             className="rounded-full"
  //           />
  //           <div className="font-semibold text-[16px]">
  //             {data.token0.symbol}
  //           </div>
  //         </div>
  //         <div className="font-semibold text-[16px]">
  //           {balanceFormated(amount0, 6)}
  //         </div>
  //       </div>
  //       <div className="flex items-center justify-between mt-[6px]">
  //         <div className="flex items-center gap-[9px]">
  //           <img
  //             src={data.token1.icon}
  //             alt={data.token1.name}
  //             width={26}
  //             height={26}
  //             className="rounded-full"
  //           />
  //           <div className="font-semibold text-[16px]">
  //             {data.token1.symbol}
  //           </div>
  //         </div>
  //         <div className="font-semibold text-[16px]">
  //           {balanceFormated(amount1, 6)}
  //         </div>
  //       </div>
  //     </div>
  //     <Button
  //       type="primary"
  //       className="w-full h-[46px] mt-[16px]"
  //       onClick={onWithdraw}
  //       loading={withdrawLoading}
  //     >
  //       Withdraw
  //     </Button>
  //   </>
  // );
};

export default memo(Remove);
