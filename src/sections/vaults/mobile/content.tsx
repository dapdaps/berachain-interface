import Empty from '@/components/empty';
import CircleLoading from '@/components/circle-loading';
import clsx from 'clsx';
import Big from 'big.js';
import { formatValueDecimal } from '@/utils/balance';
import { getProtocolIcon } from '@/utils/utils';
import UserInfo from '@/sections/vaults/mobile/user-info';
import useInfraredList from '@/sections/staking/hooks/use-infrared-list';
import useAquaBera from '@/sections/staking/hooks/use-aquabera';
import useMergeDataList from '@/hooks/use-merge-data-list';
import { useBerps } from '@/sections/staking/hooks/use-berps';
import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import { useBerapaw } from '@/sections/staking/hooks/use-berapaw';
import React, { useImperativeHandle, useMemo } from 'react';
import { cloneDeep } from 'lodash';
import useCustomAccount from '@/hooks/use-account';

// ⚠️Moved from src/sections/vaults/mobile/index.tsx
const MobileContent = (props: any, ref: any) => {
  const {
    className,
    dapp,
    isVaults,
    setSelectedRecord,
    setType,
    setEarned,
    sortItem,
    hasStaked,
    sortType,
  } = props;

  const { chainId, provider, account } = useCustomAccount();

  const {
    dataList: infraredData,
    loading: infraredLoading,
    fetchAllData: infraredReload,
    maxApr: infraredMaxApr,
  } = useInfraredList(0, isVaults ? "Infrared" : dapp?.name);
  const {
    dataList: aquaBeraData,
    loading: aquabearLoading,
    reload: aquabearReload
  } = useAquaBera(isVaults ? "AquaBera" : dapp?.name);
  const { getMergeDataList } = useMergeDataList();

  const {
    dataList: berpsData,
    loading: berpsLoading,
    reload: berpsReload
  } = useBerps({
    name: dapp?.name,
    pairs: dapp?.chains?.[DEFAULT_CHAIN_ID]?.pairs,
    sender: account,
    provider: provider,
    addresses: dapp?.chains?.[DEFAULT_CHAIN_ID]?.addresses,
    multicallAddress: multicallAddresses[chainId as any]
  });

  const {
    dataList: berapawData,
    loading: berapawLoading,
    getDataList: berapawReload,
    pageIndex: berapawPageIndex,
    pageTotal: berapawPageTotal,
    handleAction: berapawHandleAction,
    approving: berapawApproving,
    minting: berapawMinting,
    currentVault: currentBerapawItem,
    maxAPR: berapawMaxApr,
    totalTVL: berapawTotalTVL,
  } = useBerapaw({ ...dapp, ...dapp?.chains[DEFAULT_CHAIN_ID] });

  const [
    dataList,
    loading,
    reload,
    maxApr,
    totalTVL,
    pageIndex,
    pageTotal,
    pending,
    currentItem
  ] = useMemo(() => {
    if (isVaults) {
      return [
        getMergeDataList({
          infrared: infraredData,
          aquaBera: aquaBeraData
        }),
        infraredLoading || aquabearLoading,
        () => {
          infraredReload();
          aquabearReload();
        },
        infraredMaxApr,
      ];
    } else {
      if (dapp?.name === "Berps") {
        return [berpsData, berpsLoading, berpsReload];
      }
      if (dapp?.name === "AquaBera") {
        return [aquaBeraData, aquabearLoading, aquabearReload, infraredMaxApr];
      }
      if (dapp.name === "BeraPaw") {
        return [
          berapawData,
          berapawLoading,
          berapawReload,
          berapawMaxApr,
          berapawTotalTVL,
          berapawPageIndex,
          berapawPageTotal,
          berapawApproving || berapawMinting,
          currentBerapawItem
        ];
      }
      return [infraredData, infraredLoading, infraredReload];
    }
  }, [
    infraredData,
    infraredLoading,
    berpsData,
    berpsLoading,
    aquaBeraData,
    aquabearLoading,
    isVaults,
    dapp.name,
    berapawData,
    berapawLoading,
    berapawReload,
    berapawPageIndex,
    berapawPageTotal,
    berapawApproving,
    berapawMinting,
    currentBerapawItem,
    berapawMaxApr,
    berapawTotalTVL,
    infraredMaxApr,
  ]);

  const data = useMemo(() => {
    if (!dataList?.length) return [];
    if (!sortItem) return dataList;
    return cloneDeep(dataList)
      .filter((item: any) =>
        hasStaked ? Big(item?.usdDepositAmount || 0).gt(0) : true
      )
      .sort((a: any, b: any) =>
        Big(b[sortItem.key] || 0).gt(a[sortItem.key] || 0)
          ? sortType
          : -sortType
      );
  }, [sortItem, sortType, dataList, hasStaked]);

  const refs = {
    data,
    loading,
    reload,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={clsx("relative z-[2] flex flex-col gap-[12px] px-[12px] mt-[12px] h-[calc(100dvh-260px)] overflow-y-auto pb-[50px]", className)}>
      {data.map((item: any, idx: number) => (
        <Item
          key={item.id}
          data={item}
          dapp={dapp}
          isVaults={isVaults}
          onClick={(data: any, type: 0 | 1) => {
            setSelectedRecord(data);
            setType(type);
          }}
          onClaim={setEarned}
        />
      ))}
      {data.length === 0 && !loading && (
        <div className="mt-[50px] w-full flex justify-center items-center">
          <Empty desc="No Pools." />
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center h-[200px]">
          <CircleLoading />
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(MobileContent);

const Item = ({ data, dapp, isVaults, onClick, onClaim }: any) => {
  const protocol = data?.initialData?.protocol;
  const isBerps = dapp?.name === "Berps";
  const isAquaBera = dapp?.name === "AquaBera";

  const _data = {
    pool: data,
    token0: data?.tokens?.[0],
    token1: data?.tokens?.[1]
  };
  return isAquaBera ? (
    <div>
      <div className="bg-white/50 rounded-[10px] backdrop-blur-sm p-[14px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center relative">
              {data?.tokens?.[0]?.icon ? (
                <img
                  className="mr-[-8px] rounded-full"
                  src={data?.tokens?.[0]?.icon}
                  width={40}
                  height={40}
                  alt="Token"
                />
              ) : (
                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[4px] bg-gray-800 text-white font-bold">
                  {data?.tokens?.[0]?.symbol?.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="text-[16px] font-semibold">{data?.id}</div>
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => {
                onClick(_data, 0);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
              >
                <rect
                  x="1"
                  y="1"
                  width="32"
                  height="32"
                  rx="10"
                  fill="#FFDC50"
                  stroke="black"
                />
                <path
                  d="M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z"
                  fill="black"
                />
              </svg>
            </button>
            {Big(data?.yourValue ?? 0).gt(0) && (
              <button
                onClick={() => {
                  onClick(_data, 1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <rect
                    opacity="0.5"
                    x="1"
                    y="1"
                    width="32"
                    height="32"
                    rx="10"
                    stroke="white"
                  />
                  <rect
                    x="11"
                    y="16"
                    width="13"
                    height="2"
                    rx="1"
                    fill="white"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="mt-[16px] flex justify-between">
          <div>
            <div className="font-medium	text-[14px]">APY</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data?.apr, "", 2, false, false)}%
            </div>
          </div>

          <div>
            <div className="font-medium	text-[14px]">TVL</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data?.tvl, "$", 2, false, false)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium	text-[14px]">In Wallet</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data?.balance, "", 2, false, false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="bg-white/50 rounded-[10px] backdrop-blur-sm p-[14px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center relative">
              {data?.images?.[0] && (
                <img
                  className="mr-[-8px] rounded-full"
                  src={data?.images[0]}
                  width={40}
                  height={40}
                  alt="Token"
                />
              )}
              {data?.images?.[1] && (
                <img
                  className="rounded-full"
                  src={data?.images[1]}
                  width={40}
                  height={40}
                  alt="Token"
                />
              )}
              <img
                className="absolute right-[-2px] bottom-[0px]"
                src={getProtocolIcon(
                  data?.platform === "infrared" ? protocol?.id : "aquabera"
                )}
                width={20}
                height={20}
                alt="Protocol"
              />
            </div>
            <div>
              <div className="text-[16px] font-semibold">
                {data?.platform === "infrared"
                  ? data?.initialData?.name
                  : data?.pool?.name}
              </div>
              <div className="text-[14px] mt-[4px]">{protocol?.name}</div>
            </div>
          </div>
          <button
            onClick={() => {
              onClick(data, 0);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <rect
                x="1"
                y="1"
                width="32"
                height="32"
                rx="10"
                fill="#FFDC50"
                stroke="black"
              />
              <path
                d="M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
        <div className="mt-[16px] flex justify-between">
          <div>
            <div className="font-medium	text-[14px]">TVL</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data.tvl, "$", 2, true)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium	text-[14px]">APY</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {Big(data?.apy ?? 0).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      {data?.platform === "aquabera" ? (
        <>
          {data?.pairedTokens
            ?.filter((pairedToken: any) =>
              Big(pairedToken?.yourValue ?? 0).gt(0)
            )
            ?.map((pairedToken: any) => {
              const values = pairedToken?.values ?? [];
              return (
                <div className="text-white bg-black/50 rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]">
                  <div className="flex items-center">
                    <div>
                      <div className="text-[14px]">You Value</div>
                      <div className="mt-[3px] flex items-center gap-[3px]">
                        <span className="text-[16px] font-semibold">
                          {formatValueDecimal(values?.[0], "", 2, true, false)}
                        </span>
                        <span className="text-[12px] font-medium">
                          {data?.symbol}
                        </span>
                      </div>
                      <div className="mt-[3px] flex items-center gap-[3px]">
                        <span className="text-[16px] font-semibold">
                          {formatValueDecimal(values?.[1], "", 2, true, false)}
                        </span>
                        <span className="text-[12px] font-medium">
                          {pairedToken?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClick(1, pairedToken);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <rect
                        opacity="0.5"
                        x="1"
                        y="1"
                        width="32"
                        height="32"
                        rx="10"
                        stroke="white"
                      />
                      <rect
                        x="11"
                        y="16"
                        width="13"
                        height="2"
                        rx="1"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
        </>
      ) : (
        <>
          {(Big(data?.usdDepositAmount || 0).gt(0) || isBerps) && (
            <div className="text-white bg-black/50 rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]">
              <UserInfo
                data={data}
                onClaim={() => {
                  onClaim(data);
                }}
              />
              <button
                onClick={() => {
                  onClick(data, 1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <rect
                    opacity="0.5"
                    x="1"
                    y="1"
                    width="32"
                    height="32"
                    rx="10"
                    stroke="white"
                  />
                  <rect
                    x="11"
                    y="16"
                    width="13"
                    height="2"
                    rx="1"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
