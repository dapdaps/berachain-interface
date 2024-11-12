import { useState } from "react";
import SwitchTabs from "@/components/switch-tabs";
import V3List from "./v3";
import V2List from "./v2";
import IncreaseLiquidityModal from "../../increase-liquidity-modal";
import RemoveLiquidityModal from "../../remove-liquidity-modal";
import CollectFees from "../../collect-fees";

export default function Yours({
  pools = [],
  onChangeTab,
  currentTab,
  loading,
  ticksInfo,
  onSuccess,
  dex
}: any) {
  const [selectedReocrd, setSelectedRecord] = useState<any>(null);
  const [openModal, setOpenModal] = useState("");

  return (
    <div className="pb-[20px] md:h-full">
      <div className="flex items-center md:px-[12px]">
        {currentTab && (
          <SwitchTabs
            tabs={[
              { label: "V3 Pools", value: "v3" },
              { label: "V2 Pools", value: "v2" }
            ]}
            current={currentTab}
            onChange={onChangeTab}
            style={{
              width: 200,
              height: 40,
              padding: 4
            }}
            tabStyle={{
              fontSize: 14
            }}
            className="md:bg-[#DFDCC4] md:border-none md:rounded-[12px] md:mb-[10px]"
            cursorClassName="md:rounded-[12px]"
          />
        )}
      </div>
      {currentTab === "v3" ? (
        <V3List
          pools={pools}
          loading={loading}
          ticksInfo={ticksInfo}
          onAction={(val: string, item: any) => {
            setSelectedRecord(item);
            setOpenModal(val);
          }}
        />
      ) : (
        <V2List
          pools={pools}
          loading={loading}
          onAction={(val: string, item: any) => {
            setSelectedRecord(item);
            setOpenModal(val);
          }}
        />
      )}
      {selectedReocrd && (
        <>
          <IncreaseLiquidityModal
            version={currentTab || "v2"}
            fee={selectedReocrd.fee}
            tokenId={selectedReocrd.tokenId}
            token0={selectedReocrd.token0}
            token1={selectedReocrd.token1}
            open={openModal === "increase"}
            onClose={() => {
              setOpenModal("");
              setSelectedRecord(null);
            }}
            dex={dex}
            onSuccess={onSuccess}
          />
          <RemoveLiquidityModal
            version={currentTab || "v2"}
            fee={selectedReocrd.fee}
            tokenId={selectedReocrd.tokenId}
            token0={selectedReocrd.token0}
            token1={selectedReocrd.token1}
            open={openModal === "remove"}
            onClose={() => {
              setOpenModal("");
              setSelectedRecord(null);
            }}
            dex={dex}
            onSuccess={onSuccess}
          />
          <CollectFees
            fee={selectedReocrd.fee}
            tokenId={selectedReocrd.tokenId}
            token0={selectedReocrd.token0}
            token1={selectedReocrd.token1}
            version={currentTab}
            dex={dex}
            open={openModal === "claim"}
            onClose={() => {
              setOpenModal("");
              setSelectedRecord(null);
            }}
          />
        </>
      )}
    </div>
  );
}
