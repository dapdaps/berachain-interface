import PageBack from "@/components/back";
import CheckBox from "@/components/check-box";
import Dropdown from "@/components/dropdown";
import MenuButton from "@/components/mobile/menuButton";
import { DEFAULT_CHAIN_ID } from "@/configs";
import aquaberaConfig from "@/configs/staking/dapps/aquabera";
import useCustomAccount from "@/hooks/use-account";
import StakingModal from "@/sections/staking/Bridge/Modal";
import InfraredTop from "@/sections/staking/components/infrared-top";
import MobileContent from '@/sections/vaults/mobile/content';
import _ from "lodash";
import Image from "next/image";
import { useMemo, useRef, useState } from 'react';
import Bg from "../components/mobile-bg";
import HandleModal from "./handle-modal";
import RewardsModal from "./rewards-modal";

export default function Mobile({ dapp }: any) {
  const isVaults = _.isArray(dapp);
  const { chainId } = useCustomAccount();
  const contentRef = useRef<any>();

  // @ts-ignore
  const dexConfig = useMemo(() => aquaberaConfig.chains[chainId], [chainId]);

  const [sortType, setSortType] = useState(-1);
  const [sortItem, setSortItem] = useState<any>("tvl");
  const [hasStaked, setHasStaked] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [type, setType] = useState(0);
  const [earned, setEarned] = useState<any>();

  return (
    <div className="h-full bg-vault relative pt-[25px]">
      <Bg className="opacity-30" />
      <PageBack className="md:absolute md:left-[12px] md:top-[17px] z-[10]" />
      <div className="relative z-[3]">
        <MenuButton className="my-0 mx-auto" contentClassName="text-2xl">
          {isVaults ? (
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
              <img src={dapp?.icon} width={33} height={33} alt="Icon" />
              <div>{dapp?.name}</div>
            </div>
          )}
        </MenuButton>
        <div className="mt-[12px] text-[14px] font-medium px-[12px] text-center">
          {dapp?.chains?.[DEFAULT_CHAIN_ID]?.description}
        </div>
        {
          dapp?.name === "Infrared" && (
            <InfraredTop />
          )
        }
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
      <MobileContent
        ref={contentRef}
        className=""
        dapp={dapp}
        isVaults={isVaults}
        setSelectedRecord={setSelectedRecord}
        setType={setType}
        setEarned={setEarned}
        sortItem={sortItem}
        hasStaked={hasStaked}
        sortType={sortType}
      />
      {!!selectedRecord &&
        (dapp?.name === "AquaBera" ||
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
              contentRef.current?.reload();
              setSelectedRecord(null);
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
              contentRef.current?.reload();
            }}
          />
        ))}
      {earned && (
        <RewardsModal
          show={!!earned}
          onClose={() => {
            setEarned(null);
          }}
          data={earned}
          onSuccess={() => {
            contentRef.current?.reload();
          }}
        />
      )}
    </div>
  );
}
