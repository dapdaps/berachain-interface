import SwitchTabs from "@/components/switch-tabs";
import { beraB } from "@/configs/tokens/bera-bArtio";
import { useIBGT } from "@/hooks/use-ibgt";
import useToast from "@/hooks/use-toast";
import IbgtForm from "@/sections/bgt/components/ibgt-form";
import InfraredRewards from "@/sections/staking/components/infrared-rewards";
import InfraredTop from "@/sections/staking/components/infrared-top";
import { formatValueDecimal } from "@/utils/balance";
import { berachainTestnetbArtio } from "viem/chains";
import Big from "big.js";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createWalletClient, custom } from "viem";

const IBGTMobileView = (props: Props) => {
  // const { visible, onClose } = props;

  const {
    data: ibgtData,
    tokenData: data,
    tabs,
    tIndex,
    setTIndex,
    state,
    isInSufficient,
    isWithdrawInsufficient,
    handleMax,
    handleTokenChange,
    handleLPChange,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleClaim,
    symbol,
    claiming,
    handleMintIBGT
  } = useIBGT(props);
  const rewards = data?.rewards;
  const toast = useToast();
  const [tab, setTab] = useState<any>(tabs[0]);

  const {
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount
  } = state;

  const [totalVisible, setTotalVisible] = useState(false);
  const handleTotal = () => {
    setTotalVisible(!totalVisible);
  };

  const handleAddWallet = async () => {
    if (
      !window?.ethereum ||
      window.ethereum === void 0 ||
      // @ts-ignore
      window.ethereum === "undefined"
    )
      return;
    const _toastId = toast.loading({ title: "Adding..." });
    try {
      const walletClient = createWalletClient({
        // @ts-ignore
        chain: berachainTestnetbArtio,
        // @ts-ignore
        transport: custom(window.ethereum!)
      });
      await walletClient.watchAsset({
        type: "ERC20",
        options: beraB.ibgt
      });
      toast.dismiss(_toastId);
      toast.success({
        title: "Add Successful!"
      });
    } catch (err: any) {
      let msg = "";
      if (err?.message?.includes("User denied")) {
        msg = "User denied";
      }
      console.log(err);
      toast.dismiss(_toastId);
      toast.fail({
        title: "Add failure!",
        text: msg
      });
    }
  };

  return (
    <>
      <div className="max-h-[calc(100%)] overflow-x-hidden overflow-y-auto pb-[80px]">
        <div className="mb-[10px]">
          <InfraredTop
            pointsClass="md:bg-[rgba(255,255,255,0.16)]"
            hiddenRewards
          />
        </div>
        <div className="px-[10px] ">
          <div className="bg-[#FFDC50] rounded-[10px] p-[17px_8px_19px_16px] flex justify-between">
            <div className="">
              <div className="text-[#3D405A] text-[14px] font-[500]">TVL</div>
              <div className="text-black text-[16px] font-[600] mt-[11px]">
                {formatValueDecimal(data?.tvl, "$", 2, true)}
              </div>
            </div>
            <div className="">
              <div className="text-[#3D405A] text-[14px] font-[500]">APY</div>
              <div className="text-black text-[16px] font-[600] mt-[11px]">
                {Big(data?.apy ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[#3D405A] text-[14px] font-[500]">
                % of iBGT staked
              </div>
              <div
                className="text-black text-[16px] font-[600] relative mt-[11px]"
                onClick={handleTotal}
              >
                <span>
                  {ibgtData?.total
                    ? Big(ibgtData?.staked)
                        .div(ibgtData?.total)
                        .times(100)
                        .toFixed(2)
                    : "-"}
                  %
                </span>
                <div className="border-b border-black border-dashed" />
              </div>
            </div>
          </div>
        </div>
        <div className="px-[10px] mt-[10px]">
          <div className="relative bg-[rgba(255,255,255,0.16)] rounded-[10px] py-[14px] flex justify-center gap-[100px]">
            <div className="flex flex-col items-center gap-[7px] text-[14px] font-[500]">
              <div className="">Your Position</div>
              <div className="flex justify-center items-center gap-[7px]">
                <img
                  src="/images/dapps/infrared/ibgt.svg"
                  alt=""
                  className="w-[26px] h-[26px] rounded-full"
                />
                <div className="text-[20px] font-[600]">
                  {formatValueDecimal(
                    data?.depositAmount ?? 0,
                    "",
                    2,
                    false,
                    false
                  )}
                </div>
                <div className="">iBGT</div>
              </div>
            </div>
            <InfraredRewards
              rewards={rewards}
              claiming={claiming}
              handleClaim={handleClaim}
            />
            {/* <div className="flex flex-col items-center gap-[7px] text-[14px] font-[500]">
              <div className="">Rewards</div>
              <div className="flex justify-center items-center gap-[7px]">
                <img
                  src={`/images/dapps/infrared/${data?.rewardSymbol?.toLocaleLowerCase() ?? "honey"
                    }.svg`}
                  alt=""
                  className="w-[26px] h-[26px] rounded-full"
                />
                <div className="text-[20px] font-[600]">{formatValueDecimal(data?.earned, '', 2)}{' '}</div>
                <div className="">{data?.rewardSymbol}</div>
              </div>
              <button
                disabled={Big(data?.earned ?? 0).lte(0)}
                style={{
                  opacity: Big(data?.earned ?? 0).lte(0) ? 0.3 : 1
                }}
                type="button"
                className="border border-[#373A53] rounded-[10px] h-[36px] leading-[34px] px-[16px] text-[14px] font-[500] text-center"
                onClick={handleClaim}
              >
                Claim
              </button>
            </div> */}
            <div className="absolute w-[1px] h-[37px] bg-[#373A53] left-[50%] top-[23px] translate-x-[-50%]"></div>
          </div>
        </div>
        <div className="px-[10px] mt-[20px]">
          <SwitchTabs
            tabs={[
              { label: tabs[0], value: tabs[0] },
              { label: tabs[1], value: tabs[1] }
            ]}
            onChange={(val, index) => {
              setTIndex(index);
              setTab(val);
            }}
            current={tab}
            className="md:h-[52px] rounded-[10px]"
            cursorClassName="rounded-[10px]"
          />
          <AnimatePresence mode="wait">
            {tab === tabs[0] && (
              <IbgtForm
                key="stake"
                type="Stake"
                amount={inAmount}
                onChange={handleTokenChange}
                balance={Big(balances[symbol] ?? 0).toFixed(6)}
                usdValue={
                  inAmount
                    ? "$" +
                      Big(inAmount)
                        .times(data?.initialData?.stakeTokenPrice ?? 0)
                        .toFixed(2)
                    : "-"
                }
                onSubmit={handleDeposit}
                onBalance={handleMax}
                loading={isLoading}
                btnText="Stake iBGT"
                isInSufficient={isInSufficient}
                isTokenApproved={isTokenApproved}
                isTokenApproving={isTokenApproving}
                symbol={symbol}
                handleApprove={handleApprove}
              />
            )}
            {tab === tabs[1] && (
              <IbgtForm
                key="Withdraw"
                type="Withdraw"
                amount={lpAmount}
                onChange={handleLPChange}
                balance={lpBalance}
                usdValue={
                  lpAmount
                    ? "$" +
                      Big(lpAmount)
                        .times(data?.initialData?.stakeTokenPrice ?? 0)
                        .toFixed(2)
                    : "-"
                }
                onSubmit={handleWithdraw}
                onBalance={() => {
                  handleLPChange(lpBalance);
                }}
                loading={isLoading}
                btnText="Withdraw iBGT"
                isInSufficient={isWithdrawInsufficient}
                isTokenApproved={true}
                isTokenApproving={false}
              />
            )}
          </AnimatePresence>
        </div>
        <div
          className="flex justify-center items-center gap-[5px] py-[20px]"
          onClick={handleAddWallet}
        >
          <span className="text-[#929292] font-[500] text-[14px]">
            Add iBGT to wallet
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="16"
              height="16"
              rx="8"
              stroke="#929292"
              strokeOpacity="0.5"
            />
            <path
              d="M9.51055 9.54607L11.8693 9.54608C12.0467 9.54605 12.1905 9.43253 12.1905 9.29262L12.1905 8.77831C12.1905 8.63836 12.0466 8.52522 11.8692 8.52502L9.51052 8.52509L9.51047 6.16638C9.51056 5.98893 9.39713 5.84503 9.25709 5.84512L8.74276 5.84514C8.60296 5.84506 8.48944 5.98886 8.48956 6.16635L8.4896 8.52511L6.13074 8.52516C5.95347 8.52513 5.80954 8.63835 5.80957 8.77833L5.80954 9.29266C5.80955 9.43261 5.95338 9.5461 6.13072 9.54614L8.48961 9.54612L8.48959 11.9047C8.48956 12.0823 8.60291 12.226 8.74286 12.226L9.25719 12.2259C9.39711 12.2259 9.51054 12.0822 9.51066 11.9048L9.51055 9.54607Z"
              fill="#929292"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default IBGTMobileView;

interface Props {
  visible: boolean;

  onClose(): void;
}
