"use client";

import Card from "@/components/card";
import SwitchNetwork from "@/components/switch-network";
import { DEFAULT_CHAIN_ID } from "@/configs";
import chains from "@/configs/chains";
import multicallAddresses from "@/configs/contract/multicall";
import useAccount from "@/hooks/use-account";
import useMergeDataList from "@/hooks/use-merge-data-list";
import { useProvider } from "@/hooks/use-provider";
import useAquaBera from "@/sections/staking/hooks/use-aquabera";
import { useBerps } from "@/sections/staking/hooks/use-berps";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import { usePriceStore } from "@/stores/usePriceStore";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import Detail from "../Bridge/Detail";
import List from "../Bridge/List";
import Modal from "../Bridge/Modal";
import { useBerapaw } from '@/sections/staking/hooks/use-berapaw';
import BerapawModal from "../Bridge/Modal/berapaw/modal";

type Props = {
  dapp: any;
  className?: string;
  listTitle?: any;
};

export type DefaultIndexType = 0 | 1;
export default function Staking({ dapp, className, listTitle }: Props) {
  const isVaults = _.isArray(dapp);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const prices = usePriceStore((store) => store.price);

  const dexConfig = useMemo(() => {
    if (dapp?.name === "BeraPaw") {
      return {
        ...dapp?.chains[DEFAULT_CHAIN_ID],
        ...dapp
      };
    }
    return isVaults ? null : dapp?.chains[DEFAULT_CHAIN_ID];
  }, [isVaults, dapp]);

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
    orderBy: berapawOrderBy,
    sort: berapawSort,
    onSort: onBerapawSort,
    search: berapawSearch,
    onSearch: onBerapawSearch,
    stakeModalVisible,
    stakeModalData,
    onStakeModalClose,
    handleApprove: onBerapawApprove,
    handleStake: onBerapawStake,
    staking: berapawStaking,
  } = useBerapaw({ ...dapp, ...dexConfig });

  const { ALL_DATA_URL, addresses, pairs, description } = dexConfig ?? {};
  const { account: sender, chainId } = useAccount();
  const { provider } = useProvider();
  const router = useRouter();

  const [type, setType] = useState(0);
  const [checkedRecord, setCheckedRecord] = useState(null);

  const listRef = useRef<any>();

  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );

  const onChangeData = function (data: any, index: DefaultIndexType) {
    if (isVaults) {
      if (data?.platform === "aquabera") {
        router.push(`/staking/aquabera?address=${data.address}`);
        return;
      }
    } else {
      if (dapp?.name === "Berps") {
        router.push(`/staking/berps?id=${data.id}&tab=${index}`);
        return;
      }
      if (dapp?.name === "AquaBera") {
        setType(index);
        setCheckedRecord(data);
        return;
      }
      if (dapp?.name === "BeraPaw") {
        if (data.type === "stake") {
          setType(index);
          setCheckedRecord(data);
          return;
        }
        berapawHandleAction(data, index);
        return;
      }
    }
    router.push(
      `/staking/infrared?id=${data.id}&vaultAddress=${data?.vaultAddress}&tab=${index}`
    );
  };

  const listProps = isVaults
    ? {
        name: "vaults",
        description:
          "Deposit or mint BGT-whitelisted LP tokens to earn iBGT (liquid BGT) & Boosted Yield.",
        pairs: [],
        sender,
        chainId,
        provider,
        multicallAddress,
        onChangeData
      }
    : {
        name: dapp.name,
        description,
        pairs,
        sender,
        chainId,
        provider,
        addresses,
        ALL_DATA_URL,
        multicallAddress,
        onChangeData
      };

  const {
    dataList: infraredData,
    loading: infraredLoading,
    fetchAllData: infraredReload,
    maxApr: infraredMaxApr
  } = useInfraredList(0, isVaults ? "Infrared" : dapp?.name);


  
  const {
    dataList: aquaBeraData,
    loading: aquabearLoading,
    reload: aquabearReload
  } = useAquaBera(isVaults ? "AquaBera" : dapp?.name);
  const {
    dataList: berpsData,
    loading: berpsLoading,
    reload: berpsReload
  } = useBerps(listProps);

  const { getMergeDataList } = useMergeDataList();
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
        infraredMaxApr
      ];
    } else {
      if (dapp.name === "Berps") {
        return [berpsData, berpsLoading, berpsReload];
      }
      if (dapp.name === "AquaBera") {
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
    infraredMaxApr
  ]);

  return (
    <Card className={className}>
      {id ? (
        <Detail
          dapp={dapp}
          onSuccess={() => {
            reload?.();
          }}
          loading={loading}
        />
      ) : (
        <List
          ref={listRef}
          {...listProps}
          dataList={dataList}
          loading={loading}
          reload={reload}
          maxApr={maxApr}
          totalTVL={totalTVL}
          pageIndex={pageIndex}
          pageTotal={pageTotal}
          pending={pending}
          currentItem={currentItem}
          title={listTitle}
          sort={berapawSort}
          orderBy={berapawOrderBy}
          onSort={onBerapawSort}
          search={berapawSearch}
          onSearch={onBerapawSearch}
        />
      )}
      <SwitchNetwork targetChain={chains[DEFAULT_CHAIN_ID]} />

      <Modal
        // ref={modalRef}
        // @ts-ignore
        show={!!checkedRecord}
        data={checkedRecord}
        config={dexConfig}
        type={type}
        onClose={() => {
          setCheckedRecord(null);
        }}
        onSuccess={() => {
          reload();
          setCheckedRecord(null);
          listRef?.current?.changeCheckedIndex(-1);
        }}
      />
      <BerapawModal
        show={stakeModalVisible}
        data={stakeModalData}
        onClose={onStakeModalClose}
        onSuccess={() => {
          onStakeModalClose();
          berapawReload();
        }}
        onApprove={onBerapawApprove}
        approving={berapawApproving}
        onStake={onBerapawStake}
        staking={berapawStaking}
        dexConfig={dexConfig}
      />
    </Card>
  );
}
