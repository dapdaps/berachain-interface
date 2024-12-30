import PageBack from '@/components/back';
import CheckBox from "@/components/check-box";
import CircleLoading from "@/components/circle-loading";
import Dropdown from "@/components/dropdown";
import Empty from "@/components/empty";
import MenuButton from "@/components/mobile/menuButton";
import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import aquaberaConfig from '@/configs/staking/dapps/aquabera';
import useCustomAccount from '@/hooks/use-account';
import useMergeDataList from "@/hooks/use-merge-data-list";
import StakingModal from '@/sections/staking/Bridge/Modal';
import useAquaBera from '@/sections/staking/hooks/use-aquabera';
import { useBerps } from '@/sections/staking/hooks/use-berps';
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import _, { cloneDeep } from "lodash";
import Image from "next/image";
import { useMemo, useState } from "react";
import Bg from "../components/mobile-bg";
import HandleModal from "./handle-modal";
import RewardsModal from "./rewards-modal";
import UserInfo from "./user-info";

export default function Mobile({ dapp }: any) {
  const isVaults = _.isArray(dapp)
  const { chainId, provider, account } = useCustomAccount();


  const dexConfig = useMemo(() => aquaberaConfig.chains[chainId], [chainId]);

  const { dataList: infraredData, loading: infraredLoading, fetchAllData: infraredReload } = useInfraredList(0, isVaults ? "Infrared" : dapp?.name);
  const { dataList: aquaBeraData, loading: aquabearLoading, reload: aquabearReload } = useAquaBera(isVaults ? "AquaBera" : dapp?.name)
  const { getMergeDataList } = useMergeDataList()

  const { dataList: berpsData, loading: berpsLoading, reload: berpsReload } = useBerps({
    name: dapp?.name,
    pairs: dapp?.chains?.[DEFAULT_CHAIN_ID]?.pairs,
    sender: account,
    provider: provider,
    addresses: dapp?.chains?.[DEFAULT_CHAIN_ID]?.addresses,
    multicallAddress: multicallAddresses[chainId as any]
  });
  const [dataList, loading, reload] = useMemo(() => {
    if (isVaults) {
      return [getMergeDataList({
        infrared: infraredData,
        aquaBera: aquaBeraData
      }), infraredLoading || aquabearLoading, () => {
        infraredReload()
        aquabearReload()
      }]
    } else {
      if (dapp?.name === 'Berps') return [berpsData, berpsLoading, berpsReload];
      if (dapp?.name === 'AquaBera') return [aquaBeraData, aquabearLoading, aquabearReload]
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
  ]);
  const [sortType, setSortType] = useState(-1);
  const [sortItem, setSortItem] = useState<any>("tvl");
  const [hasStaked, setHasStaked] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [type, setType] = useState(0);
  const [earned, setEarned] = useState<any>();

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

  return (
    <div className="h-full bg-vault relative pt-[25px]">
      <Bg className="opacity-30" />
      <PageBack className="md:absolute md:left-[12px] md:top-[17px] z-[10]" />
      <div className="relative z-[3]">
        <MenuButton className="my-0 mx-auto" contentClassName="text-2xl">
          {
            isVaults ? (
              <div className="flex gap-[12px] text-[24px] items-center">
                <Image
                  src="/images/dapps/infrared.svg"
                  width={33}
                  height={33}
                  alt="Icon"
                />
                <div>Vaults</div>
              </div>
            ) : (
              <div className="flex gap-[12px] text-[24px] items-center">
                <Image
                  src={dapp?.icon}
                  width={33}
                  height={33}
                  alt="Icon"
                />
                <div>{dapp?.name}</div>
              </div>
            )
          }

        </MenuButton>
        <div className="mt-[12px] text-[14px] font-medium px-[12px] text-center">
          {dapp?.chains?.[DEFAULT_CHAIN_ID]?.description}
        </div>
        <div className="px-[12px] pt-[20px] flex justify-between items-center text-[14px] font-medium">
          <div className="flex items-center gap-[8px]">
            <div>Sort by</div>
            <Dropdown
              list={[
                { key: "tvl", name: "TVL" },
                { key: "apy", name: "Apy" }
              ]}
              title={`${sortItem?.name || "TVL"}`}
              value={sortItem.key || "tvl"}
              onChange={(val: any) => {
                setSortType(val.key === sortItem.key ? -sortType : 1);
                setSortItem(val);
              }}
              className="gap-[3px] px-0"
              titleClassName="text-[14px] font-normal"
              dropPanelClassName="top-[30px]"
            />
          </div>
          <div className="flex items-center gap-[8px]">
            <div>You staked only</div>
            <CheckBox
              checked={hasStaked}
              onClick={() => {
                setHasStaked(!hasStaked);
              }}
            />
          </div>
        </div>
      </div>
      <div className="relative z-[2] flex flex-col gap-[12px] px-[12px] mt-[12px] h-[calc(100dvh-260px)] overflow-y-auto pb-[50px]">
        {data.map((item: any, idx: number) => (
          <Item
            key={item.id}
            data={item}
            dapp={dapp}
            isVaults={isVaults}
            onClick={(type: 0 | 1, pairToken: any) => {

              console.log('===type', type)
              if (type === 0) {
                setSelectedRecord(item);
              } else {
                const token = _.cloneDeep(item)
                delete token.pairedTokens
                setSelectedRecord({
                  token0: token,
                  token1: pairToken,
                  platform: "aquabera"
                })
              }
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
      {!!selectedRecord && (
        dapp?.name === "AquaBera" ||
          selectedRecord?.platform === "aquabera" ? (
          <StakingModal
            show={!!selectedRecord}
            data={selectedRecord}
            config={dexConfig}
            type={type}
            onClose={() => {
              setSelectedRecord(null);
            }}
            onSuccess={() => {
              reload();
              setSelectedRecord(null)
            }}
          />
        ) : (
          <HandleModal
            show={!!selectedRecord}
            data={selectedRecord}
            dapp={dapp}
            type={type}
            onClose={() => {
              setSelectedRecord(null);
            }}
            onSuccess={() => {
              reload();
            }}
          />
        )
      )}
      {earned && (
        <RewardsModal
          show={!!earned}
          onClose={() => {
            setEarned(null);
          }}
          data={earned}
          onSuccess={() => {
            reload();
          }}
        />
      )}
    </div>
  );
}
const Item = ({ data, dapp, isVaults, onClick, onClaim }: any) => {
  const protocol = data?.initialData?.protocol
  const isBerps = dapp?.name === 'Berps';
  const isAquaBera = dapp?.name === 'AquaBera'
  // console.log('=name', dapp?.name)
  // console.log('=isAquaBera', isAquaBera)
  return isAquaBera ? (
    <div>
      <div className="bg-white/50 rounded-[10px] backdrop-blur-sm p-[14px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center relative">
              <Image
                className="mr-[-8px] rounded-full"
                src={data?.icon}
                width={40}
                height={40}
                alt="Token"
              />
            </div>
            <div className="text-[16px] font-semibold">
              {data?.symbol}
            </div>
          </div>
          <button
            onClick={() => {
              onClick(0);
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
            <div className="font-medium	text-[14px]">7-day APR</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data?.minApr, '', 2, false, false)}% - {formatValueDecimal(data?.maxApr, '', 2, false, false)}%
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium	text-[14px]">In Wallet</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data?.balance, '', 2, false, false)}
            </div>
          </div>
        </div>
      </div>
      {
        data?.pairedTokens
          ?.filter((pairedToken: any) => Big(pairedToken?.yourValue ?? 0).gt(0))
          ?.map((pairedToken: any) => {
            const values = pairedToken?.values ?? []
            return (
              <div className="text-white bg-black/50 rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]">

                <div className='flex items-center'>
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
                    <rect x="11" y="16" width="13" height="2" rx="1" fill="white" />
                  </svg>
                </button>
              </div>
            )
          })
      }
    </div>
  ) : (
    <div>
      <div className="bg-white/50 rounded-[10px] backdrop-blur-sm p-[14px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center relative">
              {data?.images[0] && (
                <Image
                  className="mr-[-8px] rounded-full"
                  src={data?.images[0]}
                  width={40}
                  height={40}
                  alt="Token"
                />
              )}
              {data?.images[1] && (
                <Image
                  className="rounded-full"
                  src={data?.images[1]}
                  width={40}
                  height={40}
                  alt="Token"
                />
              )}
              <Image
                className="absolute right-[-2px] bottom-[0px]"
                src={
                  data?.platform === 'infrared' ? (
                    protocol?.id === "bex" ?
                      '/images/dapps/infrared/bex.svg' :
                      protocol?.id === "kodiak" ?
                        '/images/dapps/kodiak.svg' :
                        protocol?.id === "berps" ?
                          '/images/dapps/infrared/berps.svg' :
                          '/images/dapps/infrared/infrared.svg'
                  ) : '/images/dapps/infrared/aquabera.svg'
                }
                width={20}
                height={20}
                alt="Protocol"
              />
            </div>
            <div>
              <div className="text-[16px] font-semibold">
                {data?.platform === "infrared" ? data?.initialData?.name : data?.pool?.name}
              </div>
              <div className="text-[14px] mt-[4px]">{protocol?.name}</div>
            </div>
          </div>
          <button
            onClick={() => {
              onClick(0);
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
      {
        data?.platform === "aquabera" ? (
          <>
            {
              data?.pairedTokens
                ?.filter((pairedToken: any) => Big(pairedToken?.yourValue ?? 0).gt(0))
                ?.map((pairedToken: any) => {
                  const values = pairedToken?.values ?? []
                  return (
                    <div className="text-white bg-black/50 rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]">
                      <div className='flex items-center'>
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
                          <rect x="11" y="16" width="13" height="2" rx="1" fill="white" />
                        </svg>
                      </button>
                    </div>
                  )
                })
            }
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
                    onClick(1);
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
                    <rect x="11" y="16" width="13" height="2" rx="1" fill="white" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )
      }

    </div >
  );
};
