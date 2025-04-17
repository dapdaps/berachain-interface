import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import Big from 'big.js';
import { useRequest } from 'ahooks';
import { BEARCHAIN_API } from '@/hooks/use-bgt';
import axios from 'axios';
import { getTokenLogo } from '@/sections/dashboard/utils';
import { numberFormatter } from '@/utils/number-formatter';
import { berachain } from '@reown/appkit/networks';
import Skeleton from 'react-loading-skeleton';

const Incentives = (props: any) => {
  const { className, vaults = [], loading } = props;

  const tokens = useMemo(() => {
    const _tokens: string[] = [];
    vaults.forEach((item: any) => {
      item.receivingVault?.activeIncentives?.forEach((incentive: any) => {
        if (_tokens.indexOf(incentive.token.address) === -1) {
          _tokens.push(incentive.token.address);
        }
      })
    });
    return _tokens;
  }, [vaults]);

  const { data: priceData, loading: priceDataLoading, runAsync: getPriceData } = useRequest(async () => {
    const res = await axios.post(BEARCHAIN_API, {
      operationName: "GetTokenCurrentPrices",
      variables :{"chains":["BERACHAIN"],"addressIn": tokens},
      query :"query GetTokenCurrentPrices($chains: [GqlChain!]!, $addressIn: [String!]!) {\n  tokenGetCurrentPrices(chains: $chains, addressIn: $addressIn) {\n    address\n    chain\n    price\n    updatedAt\n    updatedBy\n    __typename\n  }\n}"
    });
    if (res.status !== 200 || !res.data?.data?.tokenGetCurrentPrices) {
      return [];
    }
    return res.data.data.tokenGetCurrentPrices;
  }, {
    manual: true,
  });

  const [list] = useMemo(() => {
    const totalPercentageNumerator = vaults.reduce((prev: any, curr: any) => Big(prev).plus(curr.percentageNumerator || 0), Big(0));
    // [token.address]: {
    //   address: token.address,
    //   name: token.name,
    //   symbol: token.symbol,
    //   decimals: token.decimals,
    //   vaults: [
    //     Vault
    //   ],
    // }
    const _list = new Map();
    vaults.forEach((item: any, index: number) => {
      item.percentageNumeratorFormatted = Big(item.percentageNumerator || 0).div(totalPercentageNumerator);

      // grouped by incentive.token
      if (item.receivingVault?.activeIncentives?.length > 0) {
        item.receivingVault.activeIncentives.forEach((incentive: any) => {
          incentive.ratePerBGTEmitted = Big(incentive.incentiveRate || 0).times(item.percentageNumeratorFormatted);

          if (_list.has(incentive.token.address)) {
            const _curr = _list.get(incentive.token.address);
            _list.set(incentive.token.address, {
              ..._curr,
              remainingAmount: Big(_curr.remainingAmount).plus(incentive.remainingAmount || 0),
              remainingAmountUsd: Big(_curr.remainingAmountUsd).plus(incentive.remainingAmountUsd || 0),
              ratePerBGTEmitted: Big(_curr.ratePerBGTEmitted || 0).plus(incentive.ratePerBGTEmitted || 0),
              vaults: [..._list.get(incentive.token.address).vaults, item],
            });
          } else {
            const currPrice = priceData?.find((item: any) => item.address === incentive.token.address);
            _list.set(incentive.token.address, {
              address: incentive.token.address,
              name: incentive.token.name,
              symbol: incentive.token.symbol,
              decimals: incentive.token.decimals,
              remainingAmount: Big(incentive.remainingAmount || 0),
              remainingAmountUsd: Big(incentive.remainingAmountUsd || 0),
              ratePerBGTEmitted: Big(incentive.ratePerBGTEmitted || 0),
              price: currPrice?.price || 0,
              icon: getTokenLogo(incentive.token.symbol),
              link: `${berachain.blockExplorers.default.url}/token/${incentive.token.address}`,
              vaults: [item],
            });
          }
        });
      }
    });

    return [_list];
  }, [vaults, priceData]);

  useEffect(() => {
    if (!tokens.length) return;
    getPriceData();
  }, [tokens]);

  return (
    <div className={clsx("", className)}>
      <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
        Incentives
      </div>
      <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium leading-normal mt-[7px]">
        Breakdown of incentives given to user for boosting this validator
      </div>
      <div className="mt-[24px] grid grid-cols-3 gap-x-[13px] gap-y-[16px]">
        {
          loading ? (
            <>
              <Skeleton width="100%" height={124} borderRadius={10} />
              <Skeleton width="100%" height={124} borderRadius={10} />
              <Skeleton width="100%" height={124} borderRadius={10} />
            </>
          ) : Array.from(list.values()).map((item: any, index: number) => (
            <div
              key={index}
              className="h-[124px] rounded-[10px] bg-[rgba(0,0,0,0.06)] p-[16px]"
            >
              <div className="flex items-center gap-[10px]">
                <a
                  href={item.link}
                  target="_blank"
                  rel="nofollow"
                  className="shrink-0 block w-[36px] h-[36px] rounded-full bg-center bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url("${item.icon}")`,
                  }}
                />
                <a href={item.link} target="_blank" rel="nofollow" className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
                  {item.symbol}
                </a>
              </div>
              <div className="mt-[16px] flex justify-between items-start">
                <LabelValue label="Remaining">
                  <div className="">
                    {numberFormatter(item.remainingAmount, 2, true, { isShort: true, isShortUppercase: true })}
                  </div>
                  <div className="text-[#3D405A] font-[500] text-[14px]">
                    ({numberFormatter(item.remainingAmountUsd, 2, true, { isShort: true, isShortUppercase: true, prefix: '$' })})
                  </div>
                </LabelValue>
                <LabelValue label="Rate Per BGT Emitted">
                  <div className="">
                    {numberFormatter(item.ratePerBGTEmitted, 2, true, { isShort: true, isShortUppercase: true })}
                  </div>
                  <div className="text-[#3D405A] font-[500] text-[14px]">
                    ({numberFormatter(Big(item.ratePerBGTEmitted || 0).times(item.price || 0), 2, true, { isShort: true, isShortUppercase: true, prefix: '$' })})
                  </div>
                </LabelValue>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Incentives;

const LabelValue = (props: any) => {
  const { className, label, children, labelClassName, valueClassName } = props;
  
  return (
    <div className={clsx("text-[#3D405A] font-Montserrat text-[14px] font-medium leading-normal", className)}>
      <div className={clsx('', labelClassName)}>
        {label}
      </div>
      <div className={clsx("text-black text-[16px] font-[600] flex items-center gap-[4px]", valueClassName)}>
        {children}
      </div>
    </div>
  );
};
