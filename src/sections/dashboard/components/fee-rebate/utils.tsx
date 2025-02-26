import {
  ActionExtraData,
  ActionRecord,
  BridgeActionExtraData,
  StakingActionExtraData
} from '@/sections/dashboard/components/fee-rebate/hooks';
import LazyImage from '@/components/layz-image';
import { getTokenLogo } from '@/sections/dashboard/utils';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';

export const formatTokenAction = (record: ActionRecord, prices: Record<string, any>) => {
  let method = record.sub_type;

  if (record.action_type) {
    method += (method && ' ') + record.action_type;
  }

  if (record.token_in_currency) {
    const isMinus = ['swap', 'bridge'].includes(record.action_type?.toLowerCase?.());
    return (
      <div className="flex items-center gap-[4px] flex-wrap">
        <div>{method?.slice?.(0, 1)?.toUpperCase?.() + method?.slice?.(1)}</div>
        <div className="flex items-center gap-[4px] flex-wrap">
          <LazyImage
            src={getTokenLogo(record.tokenInCurrency?.symbol || '')}
            alt=""
            width={20}
            height={20}
            className="rounded-full"
          />
          <div className="flex items-center gap-[4px] flex-wrap">
            <div>{isMinus ? '-' : '+'}</div>
            <div>{numberFormatter(record.action_amount, 4, true)}</div>
            <div>{record.tokenInCurrency?.symbol}</div>
            {
              !!prices[record.tokenInCurrency?.symbol as string] && (
                <div>({numberFormatter(Big(record.action_amount || 0).times(prices[record.tokenInCurrency?.symbol as string] || 0), 2, true, { prefix: '$'})})</div>
              )
            }
          </div>
        </div>
      </div>
    );
  }

  const isMinus = ['borrow', 'remove', 'repayborrow', 'withdraw'].includes(record.sub_type?.toLowerCase?.());

  if (record.extra_data && record.extra_data !== '{}' && ['bridge', 'liquidity'].includes(record.action_type?.toLowerCase?.())) {
    if (record.action_type?.toLowerCase?.() === 'bridge') {
      const _extraData = record.extraData as BridgeActionExtraData;
      return (
        <div className="flex items-center gap-[4px] flex-wrap">
          <div>{method?.slice?.(0, 1)?.toUpperCase?.() + method?.slice?.(1)}</div>
          <div className="flex items-center gap-[4px] flex-wrap">
            <LazyImage
              src={getTokenLogo(_extraData.fromTokenSymbol || '')}
              alt=""
              width={20}
              height={20}
              className="rounded-full"
            />
            <div className="flex items-center gap-[4px] flex-wrap">
              <div>-</div>
              <div>{numberFormatter(_extraData.fromAmount, 4, true)}</div>
              <div>{_extraData.fromTokenSymbol}</div>
              {
                !!prices[_extraData.fromTokenSymbol] && (
                  <div>({numberFormatter(Big(_extraData.fromAmount || 0).times(prices[_extraData.fromTokenSymbol] || 0), 2, true, { prefix: '$'})})</div>
                )
              }
            </div>
          </div>
          <div className="flex items-center gap-[4px] flex-wrap">
            <LazyImage
              src={getTokenLogo(_extraData.toTokenSymbol || '')}
              alt=""
              width={20}
              height={20}
              className="rounded-full"
            />
            <div className="flex items-center gap-[4px] flex-wrap">
              <div>+</div>
              <div>{numberFormatter(_extraData.toAmout, 4, true)}</div>
              <div>{_extraData.toTokenSymbol}</div>
              {
                !!prices[_extraData.toTokenSymbol] && (
                  <div>({numberFormatter(Big(_extraData.toAmout || 0).times(prices[_extraData.toTokenSymbol] || 0), 2, true, { prefix: '$'})})</div>
                )
              }
            </div>
          </div>
        </div>
      );
    }
    const _extraData = record.extraData as ActionExtraData;
    return (
      <div className="flex items-center gap-[4px] flex-wrap">
        <div>{_extraData?.action}</div>
        <div>
          {
            _extraData?.tokens?.map((it, idx) => (
              <div key={idx} className="flex items-center gap-[4px] flex-wrap">
                <LazyImage
                  src={getTokenLogo(it.symbol || '')}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <div className="flex items-center gap-[4px] flex-wrap">
                  <div>{isMinus ? '-' : '+'}</div>
                  <div>{numberFormatter(it.amount, 4, true)}</div>
                  <div>{it.symbol}</div>
                  {
                    !!prices[it.symbol] && (
                      <div>({numberFormatter(Big(it.amount || 0).times(prices[it.symbol] || 0), 2, true, { prefix: '$'})})</div>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  if (record.action_tokens) {
    return (
      <div className="flex items-center gap-[4px] flex-wrap">
        <div>{method?.slice?.(0, 1)?.toUpperCase?.() + method?.slice?.(1)}</div>
        <div>
          {
            record.actionTokens?.map((it, idx) => (
              <div key={idx} className="flex items-center gap-[4px] flex-wrap">
                <LazyImage
                  src={getTokenLogo(it || '')}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <div className="flex items-center gap-[4px] flex-wrap">
                  <div>{isMinus ? '-' : '+'}</div>
                  <div>{numberFormatter(record.action_amount, 4, true)}</div>
                  <div>{it}</div>
                  {
                    !!prices[it] && (
                      <div>({numberFormatter(Big(record.action_amount || 0).times(prices[it] || 0), 2, true, { prefix: '$'})})</div>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[4px] flex-wrap">
      <div>{method?.slice?.(0, 1)?.toUpperCase?.() + method?.slice?.(1)}</div>
      <div>{record.action_title}</div>
    </div>
  );
};
