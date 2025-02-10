import CircleLoading from "@/components/circle-loading";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import { memo, useMemo } from "react";
import AddLiquidityModal from "@/sections/pools/add-liquidity-modal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useIbgtVaults } from "@/stores/ibgt-vaults";
import DetailSummary from "@/sections/staking/Bridge/Detail/Summary";
import DetailBex from "@/sections/staking/Bridge/Detail/Bex";
import DetailBerps from "@/sections/staking/Bridge/Detail/Berps";
import { useDetail } from "@/sections/staking/Bridge/Detail/hooks";
import Stake from "./Stake";
import BerpsDeposit from "@/sections/staking/Bridge/Detail/Berps/Deposit";
import InputNumber from "@/components/input-number";

export default memo(function Detail(props: any) {
  const { dapp, loading } = props;
  const name = dapp?.name;
  const params = useSearchParams();
  const ibgtVaults: any = useIbgtVaults();
  const id = params.get("id");
  const defaultIndex = params.get("tab");
  const pathname = usePathname();
  const router = useRouter();
  const data = useMemo(() => {
    if (name === "Berps") {
      return ibgtVaults.berpsVaults.find((item: any) => item.id === id);
    }
    return ibgtVaults.vaults.find((item: any) => item.id === id);
  }, [id, name, ibgtVaults]);

  const tabs: any = ["Stake", "Unstake"];
  const BerpsTab: any = { Stake: "Deposit", Unstake: "Withdraw" };

  const {
    state,
    updateState,
    isBERPS,
    isInfraredBerps,
    symbol,
    isInSufficient,
    isWithdrawInsufficient,
    handleMax,
    handleTokenChange,
    handleLPChange,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleClaim,
    onUpdateLpPercent,
    handleMintLP,
    mintData,
    withdrawable,
    showAddModal,
    setShowAddModal,
    detailBerpsRef,
    claiming,
    isBerpsDepositVisible
  } = useDetail({
    id,
    name,
    data,
    defaultIndex
  });

  console.log("====mintData", mintData);
  const {
    // isDeposit,
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
    updater
  } = state;

  return (
    <div>
      <DetailSummary data={data} loading={loading} />

      <div className="flex items-stretch gap-[30px]">
        {isBERPS ? (
          <DetailBerps ref={detailBerpsRef} data={data} loading={loading} />
        ) : (
          <DetailBex
            data={data}
            mintData={mintData}
            setShowAddModal={handleMintLP}
            claiming={claiming}
            handleClaim={handleClaim}
            isInfraredBerps={isInfraredBerps}
          />
        )}
        <div className="flex-1 pt-[24px] pb-[20px] px-[20px] min-h-[300px]">
          <div className="mb-[17px] flex items-center h-[56px] rounded-[12px] border border-[#373A53] bg-white p-[5px]">
            {tabs.map((tab: any, index: number) => (
              <div
                key={index}
                className={clsx([
                  "cursor-pointer flex items-center justify-center border border-transparent rounded-[10px] flex-1",
                  Number(defaultIndex) === index
                    ? "h-full  !border-black bg-[#FFDC50]"
                    : ""
                ])}
                onClick={() => {
                  router.replace(`${pathname}?id=${id}&tab=${index}`);
                }}
              >
                <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">
                  {isBERPS ? BerpsTab[tab] : tab}
                </span>
              </div>
            ))}
          </div>

          {Number(defaultIndex) === 0 ? (
            <Stake
              id={id}
              symbol={symbol}
              data={data}
              inAmount={inAmount}
              handleTokenChange={handleTokenChange}
              balances={balances}
              isBERPS={isBERPS}
              isInSufficient={isInSufficient}
              isTokenApproved={isTokenApproved}
              isTokenApproving={isTokenApproving}
              isLoading={isLoading}
              handleDeposit={handleDeposit}
              handleApprove={handleApprove}
              handleMax={handleMax}
            />
          ) : (
            <div>
              <InputNumber
                value={lpAmount}
                onChange={(e) => {
                  handleLPChange(e.target.value);

                  const value = e.target.value;

                  if (!value) {
                    onUpdateLpPercent(0);
                  }

                  if (value && Big(value).gt(0)) {
                    const newSliderPercent = Big(value || 0)
                      .div(Big(lpBalance).gt(0) ? lpBalance : 1)
                      .times(100)
                      .toFixed(0);
                    onUpdateLpPercent(Number(newSliderPercent));
                  }
                }}
                className="w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]"
                placeholder="0"
              />
              <div className="flex justify-between px-[10px] pt-[12px] pb-[24px]">
                <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">
                  {lpAmount
                    ? "$" +
                      Big(lpAmount)
                        .times(data?.initialData?.stake_token?.price ?? 0)
                        .toFixed(2)
                    : "-"}
                </span>
                <div
                  className="cursor-pointer text-[#3D405A] font-Montserrat text-[12px] font-medium"
                  onClick={() => {
                    const newSliderPercent = Big(lpBalance || 0)
                      .div(Big(lpBalance).gt(0) ? lpBalance : 1)
                      .times(100)
                      .toFixed(0);

                    onUpdateLpPercent(Number(newSliderPercent));

                    handleLPChange(lpBalance);
                  }}
                >
                  balance:{" "}
                  <span className="underline">
                    {balanceFormated(lpBalance ?? 0, 6)}
                  </span>
                </div>
              </div>
              <button
                disabled={!withdrawable}
                className={clsx(
                  "w-full h-[60px] text-[18px] font-semibold flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black",
                  {
                    "opacity-50": !withdrawable
                  }
                )}
                onClick={handleWithdraw}
              >
                {isLoading ? (
                  <CircleLoading size={14} />
                ) : (
                  <>
                    {isWithdrawInsufficient
                      ? "InSufficient Balance"
                      : "Withdraw"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {mintData && (
        <AddLiquidityModal
          data={mintData}
          dex={mintData.protocol}
          stakingToken={mintData.stakingToken}
          open={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            updateState({
              updater: Date.now()
            });
          }}
        />
      )}
      <BerpsDeposit
        visible={isBerpsDepositVisible}
        onClose={() => {
          handleMintLP(false);
        }}
      />
    </div>
  );
});

export const stakeAbi = [
  {
    constant: false,
    inputs: [
      {
        name: "amount",
        type: "uint256"
      }
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "assets",
        type: "uint256"
      },
      {
        name: "receiver",
        type: "address"
      }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
export const withdrawAbi = [
  {
    constant: false,
    inputs: [
      {
        name: "_shareAmt",
        type: "uint256"
      }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "shares",
        type: "uint256"
      }
    ],
    name: "makeWithdrawRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "shares",
        type: "uint256"
      },
      {
        name: "receiver",
        type: "address"
      },
      {
        name: "owner",
        type: "address"
      }
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "shares",
        type: "uint256"
      },
      {
        name: "unlockEpoch",
        type: "uint256"
      }
    ],
    name: "cancelWithdrawRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
